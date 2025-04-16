import Question from "../models/qaSection/questionModel.js"; // Adjust the import based on your project structure
import Answer from "../models/qaSection/answerModel.js";
import Comment from "../models/qaSection/answerCommentModel.js";
import Replies from "../models/qaSection/answerReplyModel.js";
import Notification from "../models/notifications/postNotificationModel.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErors.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import { io } from "../server.js";
import { updateUserPoints, awardBadges } from "../utils/gamification.js";

// question controllers
export const addQuestion = async (req, res) => {
  const { questionText, context, tags } = req.body;
  const { userId } = req.user;

  const newQuestion = await Question.create(
    [
      {
        questionText,
        context,
        createdBy: userId, // Only store user ID
        tags,
      },
    ]
  );

  await User.findByIdAndUpdate(
    userId,
    { $push: { questions: newQuestion[0]._id } },
  );
  await updateUserPoints(userId, "question");
  const earnedBadges = await awardBadges(userId, "question");

  res.status(StatusCodes.CREATED).json({
    msg: "Question added successfully",
  });
};

export const getAllQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "newest";
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    // Base pipeline for questions
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "answers",
          localField: "answers",
          foreignField: "_id",
          as: "answers",
        },
      },
      {
        $addFields: {
          author: {
            userId: "$createdBy",
            username: { $arrayElemAt: ["$userDetails.name", 0] },
            userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
          },
          totalAnswers: { $size: "$answers" },
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
    ];

    // Add search stage if search query exists
    if (search) {
      pipeline.unshift({
        $match: {
          $or: [
            { questionText: { $regex: search, $options: "i" } },
            { context: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Add filter stages based on sortBy
    switch (sortBy) {
      case "oldest":
        pipeline.push({ $sort: { createdAt: 1 } });
        break;
      case "mostAnswered":
        pipeline.push({ $sort: { totalAnswers: -1, createdAt: -1 } });
        break;
      case "unanswered":
        pipeline.unshift({
          $match: {
            $or: [{ answers: { $size: 0 } }, { answers: { $exists: false } }],
          },
        });
        pipeline.push({ $sort: { createdAt: -1 } });
        break;
      default: // 'newest'
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Get total count for pagination info
    const totalCount = await Question.aggregate([
      ...(search
        ? [
          {
            $match: {
              $or: [
                { questionText: { $regex: search, $options: "i" } },
                { context: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
        : []),
      ...(sortBy === "unanswered"
        ? [
          {
            $match: {
              $or: [
                { answers: { $size: 0 } },
                { answers: { $exists: false } },
              ],
            },
          },
        ]
        : []),
    ]).count("total");

    // Add pagination stages
    pipeline.push({ $skip: skip }, { $limit: limit });

    const questions = await Question.aggregate(pipeline);
    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.status(StatusCodes.OK).json({
      questions,
      currentPage: page,
      totalPages,
      totalQuestions: total,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error in getAllQuestions:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch questions",
    });
  }
};

export const getUserQuestions = async (req, res) => {
  const { id: userId } = req.params;
  const { page = 1, limit = 4 } = req.query;
  const skip = (page - 1) * limit;

  try {
    // Get total count for pagination
    const totalQuestions = await Question.countDocuments({ createdBy: userId });
    const totalPages = Math.ceil(totalQuestions / limit);

    const questions = await Question.aggregate([
      {
        $match: { createdBy: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "answeredTo",
          as: "answers",
        },
      },
      {
        $addFields: {
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
          totalAnswers: { $size: "$answers" },
        },
      },
      {
        $project: {
          userDetails: 0,
          answers: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: parseInt(skip),
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    res.status(StatusCodes.OK).json({
      questions,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalQuestions,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getUserQuestions:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch user questions",
    });
  }
};

export const getAllQuestionsWithAnswer = async (req, res) => {
  // Get pagination parameters from query with defaults
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || "newest";

  // Get total count for pagination info - show all questions
  const totalCount = await Question.countDocuments({});

  // Base pipeline for all questions
  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "answers",
        localField: "answers",
        foreignField: "_id",
        as: "answers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "answers.createdBy",
        foreignField: "_id",
        as: "answerUserDetails",
      },
    },
    {
      $addFields: {
        author: {
          userId: "$createdBy",
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        },
        totalAnswers: { $size: "$answers" },
        answers: {
          $map: {
            input: "$answers",
            as: "answer",
            in: {
              _id: "$$answer._id",
              context: "$$answer.context",
              createdBy: "$$answer.createdBy",
              likes: "$$answer.likes",
              comments: "$$answer.comments",
              createdAt: "$$answer.createdAt",
              updatedAt: "$$answer.updatedAt",
              author: {
                userId: "$$answer.createdBy",
                username: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$answerUserDetails",
                              cond: {
                                $eq: ["$$this._id", "$$answer.createdBy"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$user.name",
                  },
                },
                userAvatar: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$answerUserDetails",
                              cond: {
                                $eq: ["$$this._id", "$$answer.createdBy"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$user.avatar",
                  },
                },
              },
              totalLikes: { $size: { $ifNull: ["$$answer.likes", []] } },
              totalComments: { $size: { $ifNull: ["$$answer.comments", []] } },
            },
          },
        },
      },
    },
    {
      $addFields: {
        mostLikedAnswer: {
          $reduce: {
            input: "$answers",
            initialValue: { totalLikes: -1 },
            in: {
              $cond: [
                { $gt: ["$$this.totalLikes", "$$value.totalLikes"] },
                "$$this",
                "$$value",
              ],
            },
          },
        },
        totalAnswerLikes: {
          $sum: {
            $map: {
              input: "$answers",
              as: "answer",
              in: { $size: { $ifNull: ["$$answer.likes", []] } },
            },
          },
        },
      },
    },
    {
      $project: {
        userDetails: 0,
        answerUserDetails: 0,
      },
    },
  ];

  // Add sort stage based on filter
  switch (sortBy) {
    case "oldest":
      pipeline.push({ $sort: { createdAt: 1 } });
      break;
    case "mostAnswered":
      pipeline.push({ $sort: { totalAnswers: -1, createdAt: -1 } });
      break;
    default: // 'newest'
      pipeline.push({ $sort: { createdAt: -1 } });
  }

  // Add pagination stages
  pipeline.push({ $skip: skip }, { $limit: limit });

  const questions = await Question.aggregate(pipeline);
  const totalPages = Math.ceil(totalCount / limit);

  res.status(StatusCodes.OK).json({
    questions,
    currentPage: page,
    totalPages,
    totalQuestions: totalCount,
    hasMore: page < totalPages,
  });
};

// answer controllers
export const createAnswer = async (req, res) => {
  const { userId } = req.user;
  const { id: questionId } = req.params;
  const { context } = req.body;
  try {
    // First verify the question exists
    const question = await Question.findById(questionId);
    if (!question) {
      throw new NotFoundError("Question not found");
    }

    const newAnswer = await Answer.create(
      [
        {
          context,
          createdBy: userId,
          answeredTo: questionId,
        },
      ]
    );

    await Question.findByIdAndUpdate(
      questionId,
      { $push: { answers: newAnswer[0]._id } },
    );

    await User.findByIdAndUpdate(
      userId,
      { $push: { answers: newAnswer[0]._id } },
    );

    // Send notification to user who asked the question
    if (question.createdBy.toString() !== req.user.userId) {
      const notification = await Notification.create({
        userId: question.createdBy,
        createdBy: userId,
        type: "answered",
        message: `${req.user.username} Answered your question`,
        answerId: newAnswer[0]._id,
        questionId: question._id,
      });
      // Emit to socket
      io.to(question.createdBy.toString()).emit(
        "newNotification",
        notification
      );
    }
    await updateUserPoints(userId, "answer");
    const earnedBadges = await awardBadges(userId, "answer");
    res.status(StatusCodes.CREATED).json({
      msg: "Answer created successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const getAnswerById = async (req, res) => {
  const { id: answerId } = req.params;

  // First get the answer with user details and comment count
  const answer = await Answer.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(answerId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "qacomments",
        localField: "comments",
        foreignField: "_id",
        as: "commentDetails",
      },
    },
    {
      $addFields: {
        author: {
          userId: "$createdBy",
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: "$commentDetails" },
      },
    },
    {
      $project: {
        userDetails: 0,
        commentDetails: 0,
      },
    },
  ]);

  if (!answer.length) {
    throw new NotFoundError("Answer not found");
  }

  // Then get the question this answer belongs to
  const question = await Question.aggregate([
    {
      $match: { _id: answer[0].answeredTo },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "answers",
        localField: "answers",
        foreignField: "_id",
        as: "answers",
      },
    },
    {
      $addFields: {
        author: {
          userId: "$createdBy",
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: { $ifNull: ["$comments", []] } },
      },
    },
    {
      $project: {
        userDetails: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  res.status(StatusCodes.OK).json({
    question: question[0],
    answer: answer[0],
  });
};
export const getAnswersByQuestionId = async (req, res) => {
  try {
    const { id: questionId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "newest";
    const skip = (page - 1) * limit;

    // First get the question with user details
    const question = await Question.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(questionId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "answers",
          localField: "answers",
          foreignField: "_id",
          as: "answers",
        },
      },
      {
        $addFields: {
          author: {
            userId: "$createdBy",
            username: { $arrayElemAt: ["$userDetails.name", 0] },
            userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
          },
          totalAnswers: { $size: "$answers" },
        },
      },
      {
        $project: {
          userDetails: 0,
          answers: 0,
        },
      },
    ]);

    if (!question.length) {
      throw new NotFoundError("Question not found");
    }

    // Get total count for pagination info
    const totalAnswers = await Answer.countDocuments({
      answeredTo: questionId,
    });
    const totalPages = Math.ceil(totalAnswers / limit);

    // Then get paginated answers with user details
    const pipeline = [
      {
        $match: { answeredTo: new mongoose.Types.ObjectId(questionId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "qacomments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $addFields: {
          author: {
            userId: "$createdBy",
            username: { $arrayElemAt: ["$userDetails.name", 0] },
            userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
          },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
    ];

    // Add sort stage based on filter
    switch (sortBy) {
      case "oldest":
        pipeline.push({ $sort: { createdAt: 1 } });
        break;
      case "mostLiked":
        pipeline.push({ $sort: { totalLikes: -1, createdAt: -1 } });
        break;
      default: // 'newest'
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Add pagination stages
    pipeline.push({ $skip: skip }, { $limit: limit });

    const answers = await Answer.aggregate(pipeline);

    res.status(StatusCodes.OK).json({
      question: question[0],
      answers,
      pagination: {
        currentPage: page,
        totalPages,
        totalAnswers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: error.message });
    } else {
      console.error("Error in getAnswersByQuestionId:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: "Failed to fetch answers",
      });
    }
  }
};
export const getUserAnswers = async (req, res) => {
  const { id: userId } = req.params;
  const { page = 1, limit = 4 } = req.query;
  const skip = (page - 1) * limit;

  try {
    // Get total count for pagination
    const totalAnswers = await Answer.countDocuments({ createdBy: userId });
    const totalPages = Math.ceil(totalAnswers / limit);

    const answers = await Answer.aggregate([
      {
        $match: { createdBy: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "answeredTo",
          foreignField: "_id",
          as: "question",
        },
      },
      {
        $addFields: {
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $size: { $ifNull: ["$comments", []] } },
          question: { $arrayElemAt: ["$question", 0] },
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: parseInt(skip),
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    res.status(StatusCodes.OK).json({
      answers,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalAnswers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getUserAnswers:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch user answers",
    });
  }
};
// answer comment controllers
export const createAnswerComment = async (req, res) => {
  const { content } = req.body;
  const { id: answerId } = req.params;

  const comment = await Comment.create({
    answerId,
    createdBy: req.user.userId,
    content,
  });

  const answer = await Answer.findById(answerId);
  answer.comments.push(comment._id);
  await answer.save();

  // Get the created comment with user details
  const commentWithUser = await Comment.aggregate([
    { $match: { _id: comment._id } },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $addFields: {
        createdBy: "$createdBy",
        username: { $arrayElemAt: ["$userDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        repliesLength: { $size: { $ifNull: ["$replies", []] } },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalReplies: { $size: { $ifNull: ["$replies", []] } },
      },
    },
    {
      $project: {
        userDetails: 0,
      },
    },
  ]);
  if (answer.createdBy.toString() !== req.user.userId) {
    const notification = new Notification({
      userId: answer.createdBy, // The user who created the post
      createdBy: req.user.userId,
      answerId: answerId,
      type: "answerComment",
      message: `${req.user.username} commented on your answer`, // Assuming you have the username available
    });
    await notification.save();

    // Retrieve the populated notification

    io.to(answer.createdBy.toString()).emit("newNotification", notification); // Emit to the specific user's room
  }
  const user = await User.findById({ _id: answer.createdBy });
  await updateUserPoints(user._id, "comment");
  const earnedBadges = await awardBadges(user._id, "comment");
  res.status(StatusCodes.CREATED).json({
    message: "Comment created successfully",
    comment: commentWithUser[0],
  });
};

export const getAllCommentsByAnswerId = async (req, res) => {
  const { id: answerId } = req.params;
  const comments = await Comment.aggregate([
    {
      $match: {
        answerId: new mongoose.Types.ObjectId(answerId),
        deleted: { $ne: true },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "answerreplies",
        localField: "replies",
        foreignField: "_id",
        as: "repliesData",
      },
    },
    {
      $unwind: {
        path: "$repliesData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "repliesData.replyTo",
        foreignField: "_id",
        as: "replyToUserDetails",
      },
    },
    {
      $group: {
        _id: "$_id",
        answerId: { $first: "$answerId" },
        content: { $first: "$content" },
        createdBy: { $first: "$createdBy" },
        username: { $first: { $arrayElemAt: ["$userDetails.name", 0] } },
        userAvatar: { $first: { $arrayElemAt: ["$userDetails.avatar", 0] } },
        likes: { $first: "$likes" },
        replies: { $first: "$replies" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        deleted: { $first: "$deleted" },
        repliesLength: { $first: { $size: { $ifNull: ["$replies", []] } } },
        totalLikes: { $first: { $size: { $ifNull: ["$likes", []] } } },
        totalReplies: { $first: { $size: { $ifNull: ["$replies", []] } } },
        repliesData: {
          $push: {
            _id: "$repliesData._id",
            content: "$repliesData.content",
            createdBy: "$repliesData.createdBy",
            replyTo: "$repliesData.replyTo",
            isAnonymous: "$repliesData.isAnonymous",
            realCreator: "$repliesData.realCreator",
            likes: "$repliesData.likes",
            createdAt: "$repliesData.createdAt",
            updatedAt: "$repliesData.updatedAt",
            replyToUser: {
              _id: { $arrayElemAt: ["$replyToUserDetails._id", 0] },
              name: { $arrayElemAt: ["$replyToUserDetails.name", 0] },
              avatar: { $arrayElemAt: ["$replyToUserDetails.avatar", 0] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        repliesData: {
          $filter: {
            input: "$repliesData",
            as: "reply",
            cond: { $ne: ["$$reply._id", null] },
          },
        },
      },
    },
    {
      $project: {
        userDetails: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  res.status(StatusCodes.OK).json({ comments });
};

// Reply controllers
export const createAnswerReply = async (req, res) => {
  const { content } = req.body;
  const { id: parentId } = req.params;

  const comment = await Comment.findById(parentId);
  const parentReply = await Replies.findById(parentId);

  if (!comment && !parentReply) {
    throw new BadRequestError("Comment or reply not found");
  }

  const reply = await Replies.create({
    commentId: comment ? comment._id : parentReply.commentId,
    parentId: parentReply ? parentReply._id : null,
    createdBy: req.user.userId,
    content,
    replyTo: comment ? comment.createdBy : parentReply.createdBy,
  });

  if (comment) {
    comment.replies.push(reply._id);
    await comment.save();
  }

  // Get the created reply with user details
  const replyWithUser = await Replies.aggregate([
    { $match: { _id: reply._id } },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "replyTo",
        foreignField: "_id",
        as: "replyToDetails",
      },
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$authorDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
        commentUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
        commentUserAvatar: { $arrayElemAt: ["$replyToDetails.avatar", 0] },
        commentUserId: "$replyTo",
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
      },
    },
    {
      $project: {
        authorDetails: 0,
        replyToDetails: 0,
      },
    },
  ]);
  if (req.user.userId !== comment.createdBy.toString()) {
    console.log("notified");
    const notification = new Notification({
      userId: comment.createdBy, // The user who created the post
      createdBy: req.user.userId,
      answerReplyId: reply._id,
      answerId: comment.answerId,
      type: "answerReply",
      message: `${req.user.username} replied to your comment`, // Assuming you have the username available
    });
    await notification.save();
    io.to(comment.createdBy.toString()).emit("newNotification", notification);
  }

  res.status(StatusCodes.CREATED).json({
    message: "Reply created successfully",
    reply: replyWithUser[0],
  });
};

export const getAllAnswerRepliesByCommentId = async (req, res) => {
  const { id: commentId } = req.params;

  const replies = await Replies.aggregate([
    {
      $match: {
        commentId: new mongoose.Types.ObjectId(commentId),
        deleted: { $ne: true },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "authorDetails",
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "replyTo",
        foreignField: "_id",
        as: "replyToDetails",
      },
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$authorDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
        commentUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
        commentUserAvatar: { $arrayElemAt: ["$replyToDetails.avatar", 0] },
        commentUserId: { $arrayElemAt: ["$replyToDetails._id", 0] },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
      },
    },
    {
      $project: {
        authorDetails: 0,
        replyToDetails: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (replies.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "No replies found for this comment", replies: [] });
  }

  res.status(StatusCodes.OK).json({ replies });
};

export const likeAnswerReply = async (req, res) => {
  const { id: replyId } = req.params;
  const userId = req.user.userId;

  const reply = await Replies.findById(replyId);
  if (!reply) {
    throw new NotFoundError("Reply not found");
  }

  const isLiked = reply.likes.includes(userId);
  if (isLiked) {
    reply.likes = reply.likes.filter((id) => id.toString() !== userId);
  } else {
    reply.likes.push(userId);
  }
  await reply.save();

  const replyWithDetails = await Replies.aggregate([
    { $match: { _id: reply._id } },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "replyTo",
        foreignField: "_id",
        as: "replyToDetails",
      },
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$authorDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
        commentUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
        commentUserAvatar: { $arrayElemAt: ["$replyToDetails.avatar", 0] },
        commentUserId: "$replyTo",
        totalLikes: { $size: "$likes" },
      },
    },
    {
      $project: {
        authorDetails: 0,
        replyToDetails: 0,
      },
    },
  ]);
  const comment = await Comment.findById(reply.commentId);
  if (req.user.userId !== reply.createdBy.toString() && !isLiked) {
    const notificationAlreadyExists = await Notification.findOne({
      userId: reply.createdBy,
      createdBy: req.user.userId,
      answerReplyId: reply._id,
      answerCommentId: reply.commentId,
      answerId: comment.answerId,
      type: "answerCommentReplyLiked",
    });
    if (!notificationAlreadyExists) {
      const notification = new Notification({
        userId: reply.createdBy, // The user who created the post
        createdBy: req.user.userId,
        answerReplyId: reply._id,
        answerCommentId: reply.commentId,
        answerId: comment.answerId,
        type: "answerCommentReplyLiked",
        message: `${req.user.username} liked your reply`,
      });
      await notification.save();
      io.to(reply.createdBy.toString()).emit("newNotification", notification);
    }
  }
  res.status(StatusCodes.OK).json({
    message: isLiked ? "Reply unliked" : "Reply liked",
    reply: replyWithDetails[0],
  });
};

export const deleteAnswerReply = async (req, res) => {
  const { id: replyId } = req.params;

  const reply = await Replies.findById(replyId);
  if (!reply) {
    throw new BadRequestError("Reply not found");
  }

  if (reply.createdBy.toString() !== req.user.userId) {
    throw new UnauthorizedError("You are not authorized to delete this reply");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  // Delete the reply
  await Replies.findByIdAndDelete(replyId).session(session);

  // Remove reply from comment's replies array
  const comment = await Comment.findOne({ replies: replyId }).session(session);
  if (comment) {
    comment.replies.pull(replyId);
    await comment.save({ session });
  }

  await session.commitTransaction();
  res.status(StatusCodes.OK).json({ message: "Reply deleted successfully" });
  session.endSession();
};

// Like controllers for comments and replies
export const likeAnswerComment = async (req, res) => {
  const { id: commentId } = req.params;
  const userId = req.user.userId;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  const isLiked = comment.likes.includes(userId);
  if (isLiked) {
    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
  } else {
    comment.likes.push(userId);
  }
  await comment.save();

  const commentWithDetails = await Comment.aggregate([
    { $match: { _id: comment._id } },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $addFields: {
        createdBy: "$createdBy",
        username: { $arrayElemAt: ["$userDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        totalLikes: { $size: "$likes" },
      },
    },
    {
      $project: {
        userDetails: 0,
      },
    },
  ]);
  if (req.user.userId !== comment.createdBy.toString() && !isLiked) {
    const notificationAlreadyExists = await Notification.findOne({
      userId: comment.createdBy,
      createdBy: userId,
      answerId: comment.answerId,
      answerCommentId: commentId,
      type: "answerCommentLiked",
    });
    if (!notificationAlreadyExists) {
      const notification = new Notification({
        userId: comment.createdBy, // The user who created the post
        createdBy: userId,
        answerId: comment.answerId,
        answerCommentId: commentId,
        message: `${req.user.username} liked your comment`,
        type: "answerCommentLiked",
      });
      await notification.save();
      io.to(comment.createdBy.toString()).emit("newNotification", notification);
      res.status(StatusCodes.OK).json({
        message: isLiked ? "Comment unliked" : "Comment liked",
        comment: commentWithDetails[0],
      });
    }
  }

  res.status(StatusCodes.OK).json({
    message: isLiked ? "Comment unliked" : "Comment liked",
    comment: commentWithDetails[0],
  });
};

// edit controllers
export const editAnswer = async (req, res) => {
  const { id: answerId } = req.params;
  const { context } = req.body;
  const { userId } = req.user;

  if (!context) {
    throw new BadRequestError("Answer context is required");
  }

  // Find the answer and check if it exists
  const answer = await Answer.findById(answerId);
  if (!answer) {
    throw new NotFoundError("Answer not found");
  }

  // Check if the user is authorized to edit this answer
  if (answer.createdBy.toString() !== userId) {
    throw new UnauthorizedError("Not authorized to edit this answer");
  }

  // Update the answer
  const updatedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      context,
      editedAt: new Date(),
    },
    { new: true, runValidators: true }
  );

  // Fetch the updated answer with user details
  const answerWithDetails = await Answer.aggregate([
    {
      $match: { _id: updatedAnswer._id },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $addFields: {
        author: {
          userId: "$createdBy",
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        },
      },
    },
    {
      $project: {
        userDetails: 0,
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    msg: "Answer updated successfully",
    answer: answerWithDetails[0],
  });
};

export const editAnswerComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { content } = req.body;
  const { userId } = req.user;

  if (!content) {
    throw new BadRequestError("Comment content is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  if (comment.createdBy.toString() !== userId) {
    throw new UnauthorizedError("Not authorized to edit this comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content,
      editedAt: new Date(),
    },
    { new: true }
  ).populate("createdBy", "name avatar");

  res.status(StatusCodes.OK).json({
    message: "Comment updated successfully",
    comment: {
      ...updatedComment.toObject(),
      username: updatedComment.createdBy.name,
      userAvatar: updatedComment.createdBy.avatar,
      totalReplies: updatedComment.replies?.length || 0,
      totalLikes: updatedComment.likes?.length || 0,
    },
  });
};

export const editAnswerReply = async (req, res) => {
  const { id: replyId } = req.params;
  const { content } = req.body;
  const { userId } = req.user;

  if (!content) {
    throw new BadRequestError("Reply content is required");
  }

  const reply = await Replies.findById(replyId);
  if (!reply) {
    throw new BadRequestError("Reply not found");
  }

  if (reply.createdBy.toString() !== userId) {
    throw new UnauthorizedError("Not authorized to edit this reply");
  }

  const updatedReply = await Replies.findByIdAndUpdate(
    replyId,
    {
      content,
      editedAt: new Date(),
    },
    { new: true }
  )
    .populate("createdBy", "name avatar")
    .populate("replyTo", "name avatar");

  res.status(StatusCodes.OK).json({
    message: "Reply updated successfully",
    reply: {
      ...updatedReply.toObject(),
      username: updatedReply.createdBy.name,
      userAvatar: updatedReply.createdBy.avatar,
      commentUsername: updatedReply.replyTo.name,
      commentUserAvatar: updatedReply.replyTo.avatar,
      commentUserId: updatedReply.replyTo._id,
      totalLikes: updatedReply.likes?.length || 0,
    },
  });
};

// delete controllers
export const deleteQuestion = async (req, res) => {
  const { id: postId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  const question = await Question.findById(postId).session(session);
  if (!question) {
    throw new BadRequestError("Question not found");
  }
  console.log({
    question,
    user: req.user,
  });
  if (
    question.createdBy.toString() !== req.user.userId &&
    req.user.role !== "admin"
  ) {
    throw new UnauthorizedError(
      "You are not authorized to delete this question"
    );
  }

  const answers = await Answer.find({ answeredTo: postId }).session(session);
  if (answers.length > 0) {
    const answerIds = answers.map((answer) => answer._id);

    const comments = await Comment.find({
      postId: { $in: answerIds },
    }).session(session);
    if (comments.length > 0) {
      const commentIds = comments.map((comment) => comment._id);

      await Replies.deleteMany({ commentId: { $in: commentIds } }).session(
        session
      );

      await Comment.deleteMany({ postId: { $in: answerIds } }).session(session);
    }

    await Answer.deleteMany({ answeredTo: postId }).session(session);
  }

  // Remove question from user's questions array
  const user = await User.findById(question.createdBy).session(session);
  if (user) {
    user.questions.pull(postId);
    await user.save({ session });
  }

  await Question.deleteOne({ _id: postId }).session(session);

  await session.commitTransaction();
  session.endSession();

  res.status(StatusCodes.OK).json({
    message: "Question deleted successfully",
  });
};

export const deleteAnswer = async (req, res) => {
  const { id: answerId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const answer = await Answer.findById(answerId).session(session);
    if (!answer) {
      throw new BadRequestError("Answer not found");
    }

    if (
      answer.createdBy.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      throw new UnauthorizedError(
        "You are not authorized to delete this answer"
      );
    }

    // Find comments first so we can get their IDs for deleting replies
    const comments = await Comment.find({ postId: answerId }).session(session);
    const commentIds = comments.map((comment) => comment._id);

    // Delete all replies to comments
    await Replies.deleteMany({ commentId: { $in: commentIds } }).session(
      session
    );

    // Delete all comments
    await Comment.deleteMany({ postId: answerId }).session(session);

    // Remove answer from question's answers array
    const question = await Question.findOne({ answers: answerId }).session(
      session
    );
    if (question) {
      question.answers.pull(answerId);
      await question.save({ session });
    }

    // Remove answer from user's answers array
    const user = await User.findById(req.user.userId).session(session);
    if (user) {
      user.answers.pull(answerId);
      await user.save({ session });
    }

    // Delete the answer itself
    await Answer.deleteOne({ _id: answerId }).session(session);

    await session.commitTransaction();
    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const deleteAnswerComment = async (req, res) => {
  const { id: commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  if (comment.createdBy.toString() !== req.user.userId) {
    throw new UnauthorizedError(
      "You are not authorized to delete this comment"
    );
  }
  await updateUserPoints(req.user.userId, "deleteComment");
  const session = await mongoose.startSession();
  session.startTransaction();

  await Replies.deleteMany({ commentId }).session(session);

  // Delete the comment itself
  await Comment.findByIdAndDelete(commentId).session(session);

  // Remove comment from answer's comments array
  const answer = await Answer.findOne({ comments: commentId }).session(session);
  if (answer) {
    answer.comments.pull(commentId);
    await answer.save({ session });
  }

  await session.commitTransaction();
  res.status(StatusCodes.OK).json({ message: "Comment deleted successfully" });
  session.endSession();
};

// like controllers
export const likeAnswer = async (req, res) => {
  const { id: answerId } = req.params;
  const { userId } = req.user;

  // First find the answer to check if it exists
  const existingAnswer = await Answer.findById(answerId);
  if (!existingAnswer) {
    throw new BadRequestError("Answer not found");
  }

  // Check if user has already liked
  const hasLiked = existingAnswer.likes.includes(userId);

  // Update likes array based on whether user has already liked
  const updatedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      [hasLiked ? "$pull" : "$push"]: { likes: userId },
    },
    { new: true }
  );
  if (hasLiked) {
    await updateUserPoints(userId, "unlike");
  } else {
    await updateUserPoints(userId, "like");
    const earnedBadges = await awardBadges(userId, "like");
  }

  if (updatedAnswer.createdBy.toString() !== userId) {
    const notificationAlreadyExists = await Notification.findOne({
      userId: updatedAnswer.createdBy,
      answerId: answerId,
      createdBy: userId,
      type: "answerLiked",
    });
    if (!notificationAlreadyExists) {
      const notification = new Notification({
        userId: updatedAnswer.createdBy, // The user who created the post
        createdBy: userId,
        answerId: updatedAnswer._id,
        questionId: existingAnswer.answeredTo,
        type: "answerLiked",
        message: `${req.user.username} liked your answer`, // Assuming you have the username available
      });
      await notification.save();
      io.to(updatedAnswer.createdBy.toString()).emit(
        "newNotification",
        notification
      );
    }
  }
  // Update total likes count
  updatedAnswer.totalLikes = updatedAnswer.likes.length;
  await updatedAnswer.save();

  res.status(StatusCodes.OK).json({
    message: "success",
    likes: updatedAnswer.likes,
    totalLikes: updatedAnswer.totalLikes,
  });
};
export const getMostAnsweredQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      {
        $match: {
          answers: { $exists: true, $ne: [] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $sort: {
          totalAnswers: -1,
        },
      },
      {
        $limit: 7,
      },
      {
        $lookup: {
          from: "answers",
          localField: "answers",
          foreignField: "_id",
          as: "answers",
        },
      },
      {
        $addFields: {
          author: {
            userId: "$createdBy",
            username: "$userDetails.name",
            userAvatar: "$userDetails.avatar",
          },
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
    ]);
    res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.error("Error fetching most answered questions:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch most answered questions",
    });
  }
};
