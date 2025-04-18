import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import { deleteFile } from '../utils/fileUtils.js';
import RequestContribute from "../models/requestContribute/requestContributeModel.js";
import sendContributorKeyEmail from "../utils/sendContributorKeyEmail.js";
import ArticleModel from "../models/articles/articleModel.js";
import Post from "../models/postModel.js";
import Question from "../models/qaSection/questionModel.js";
import Notification from "../models/notifications/postNotificationModel.js";
import UserSuggestion from "../models/UserSuggestion.js";
import { io } from "../server.js";
import Answer from "../models/qaSection/answerModel.js";
import { getUserProgress } from "../utils/gamification.js";
import mongoose from "mongoose";
import PersonalStory from "../models/personalStoryModel.js";

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "name email avatar _id role "
  );
  res.status(StatusCodes.OK).json(user);
};

export const getUserDetailsById = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findById(userId).select("-password");
  const totalPosts = await Post.find({ createdBy: userId }).countDocuments();
  const totalQuestions = await Question.find({ createdBy: userId }).countDocuments();
  const totalAnswers = await Answer.find({ createdBy: userId }).countDocuments();
  const totalArticles = await ArticleModel.find({ author: userId }).countDocuments();

  // Calculate user's rank based on total points
  const userRank = await User.countDocuments({
    totalPoints: { $gt: user.totalPoints }
  }) + 1;

  user.counts = {
    totalPosts,
    totalQuestions,
    totalAnswers,
    totalArticles
  };

  // Add rank to user object
  user.rank = userRank;

  res.status(StatusCodes.OK).json(user);
};

export const changeUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (req.file) {
      // Delete old avatar file if it exists
      if (user.avatar) {
        const oldAvatarPath = user.avatar.replace(`${process.env.BACKEND_URL}/public/uploads/`, '');
        await deleteFile(oldAvatarPath);
      }

      // Set new avatar path
      const filepath = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
      user.avatar = filepath;
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    await user.save();
    res.status(StatusCodes.OK).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    // If something goes wrong and we uploaded a file, clean it up
    if (req.file) {
      await deleteFile(req.file.filename);
    }
    throw error;
  }
};

export const followOrUnfollowUser = async (req, res) => {
  try {
    const { id: targetUserId } = req.params;
    const currentUserId = req.user.userId;

    // Prevent self-following
    if (targetUserId === currentUserId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "You cannot follow yourself"
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "User not found"
      });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

      const notification = await  Notification.create({ userId: targetUserId,
         createdBy: currentUserId,
         type: 'follow',
         message: `${currentUser.name} stopped following you` });

         const populatedNotification = await Notification.findById(notification._id)
          .populate("createdBy", "_id name avatar");
io.to(targetUserId).emit('notification', populatedNotification);

    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      const notification = await  Notification.create({ userId: targetUserId,
         createdBy: currentUserId,
         type: 'follow',
         message: `${currentUser.name} started following you` });

         const populatedNotification = await Notification.findById(notification._id)
          .populate("createdBy", "_id name avatar");
io.to(targetUserId).emit('notification', populatedNotification);

    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(StatusCodes.OK).json({
      success: true,
      isFollowing: !isFollowing,
      followerCount: targetUser.followers.length,
      followingCount: targetUser.following.length
    });
  } catch (error) {
    console.error('Follow/Unfollow Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error processing follow/unfollow request"
    });
  }
};

export const getAllFollowers = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "User not found"
      });
    }

    const followers = await User.find(
      { _id: { $in: user.followers } },
      "name email avatar followers following"
    );

    const followersWithCounts = followers.map((follower) => ({
      _id: follower._id,
      name: follower.name,
      email: follower.email,
      avatar: follower.avatar,
      totalFollowers: follower.followers.length,
      totalFollowing: follower.following.length,
      isFollowing: follower.followers.includes(userId)
    }));

    res.status(StatusCodes.OK).json({
      success: true,
      followers: followersWithCounts
    });
  } catch (error) {
    console.error('Get Followers Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching followers"
    });
  }
};

export const getAllFollowing = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "User not found"
      });
    }

    const following = await User.find(
      { _id: { $in: user.following } },
      "name email avatar followers following"
    );

    const followingWithCounts = following.map((followed) => ({
      _id: followed._id,
      name: followed.name,
      email: followed.email,
      avatar: followed.avatar,
      totalFollowers: followed.followers.length,
      totalFollowing: followed.following.length,
      isFollowing: followed.followers.includes(userId)
    }));

    res.status(StatusCodes.OK).json({
      success: true,
      following: followingWithCounts
    });
  } catch (error) {
    console.error('Get Following Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching following users"
    });
  }
};

export const requestContributor = async (req, res) => {
  const { userId } = req.user;
  const { key } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found." });
    }

    // Check if user is already a contributor
    if (user.role === "contributor") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "You are already a contributor." });
    }

    // Verify if the provided key matches user's contributor key
    if (!user.contributerKey || user.contributerKey !== key) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Invalid contributor key. Please check your key and try again." });
    }

    // Update user role to contributor
    user.role = "contributor";
    user.contributerKey = null;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: "Congratulations! You are now a contributor." });
  } catch (error) {
    console.error('Error in requestContributor:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

export const verifyContributor = async (req, res) => {
  const { fullname,  message } = req.body;
  const { userId , email} = req.user;

  try {
    // Check if user already has any request in the system
    const existingRequest = await RequestContribute.findOne({ userId });

    if (existingRequest) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "You have already submitted a request. You cannot submit multiple requests."
      });
    }

    // If no existing request, create a new one
    const request = {
      fullname,
      email,
      message,
      userId,
      status: 'pending'
    };

    const requestContribute = new RequestContribute(request);
    await requestContribute.save();

    res.status(StatusCodes.OK).json({
      msg: "Your request has been submitted successfully. We will review it and get back to you soon."
    });

  } catch (error) {
    console.error('Error in verifyContributor:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

export const getAllContributorsRequests = async (req, res) => {
  if(req.user.role !== "admin") {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "You are not authorized to perform this action." });
  }
  try {
    const requests = await RequestContribute.find();
    res.status(StatusCodes.OK).json({ requests });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
}
export const deleteContributorsRequest = async (req, res) => {
  const { id : requestId } = req.params;
  if(req.user.role !== "admin") {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "You are not authorized to perform this action." });
  }
  try {
    await RequestContribute.findByIdAndDelete(requestId);
    res.status(StatusCodes.OK).json({ msg: "Request deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
}
export const AcceptContributorsRequest = async (req, res) => {
  const { id: requestId } = req.params;

  if (req.user.role !== "admin") {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "You are not authorized to perform this action." });
  }

  try {
    // Find the request by its _id
    const request = await RequestContribute.findById(requestId);
    if (!request) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Contributor request not found" });
    }

    // Generate contributor key
    const contributerKey = Math.floor(Math.random() * 1000000000).toString();

    // Update user with contributor key
    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { contributerKey },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    // Send email with contributor key
    await sendContributorKeyEmail({
      name: request.fullname,
      email: request.email,
      contributerKey
    });

    // Update request status to accepted
    request.status = 'accepted';
    await request.save();

    res.status(StatusCodes.OK).json({
      msg: "Request accepted successfully and email sent to contributor"
    });

  } catch (error) {
    console.error('Error accepting contributor request:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

export const  getAllContributors = async (req, res) => {
  try {
    const contributors = await User.find({ role: "contributor" }).select(
      "-password -__v -contributerKey"
    );
    res.status(StatusCodes.OK).json({ contributors });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

export const  getMostLikedContent = async (req, res) => {
  try {
    // Get 4 most liked articles (based on views)
    const mostLikedArticles = await ArticleModel.find({
      deleted: false,
      status: "published"
    })
      .sort({ views: -1 })
      .limit(4)
      .populate('author', 'name avatar _id')
      .select('title pdfPath timestamp views');

    // Get 3 most liked posts
    const mostLikedPosts = await Post.find({ deleted: false })
      .sort({ likes: -1 })
      .limit(3)
      .populate('createdBy', 'name avatar _id')
      .populate('comments')
      .select('description imageUrl datePublished likes comments');

    // Transform posts to include total comments
    const transformedPosts = mostLikedPosts.map(post => ({
      _id: post._id,
      description: post.description,
      imageUrl: post.imageUrl,
      datePublished: post.datePublished,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      author: {
        _id: post.createdBy._id,
        name: post.createdBy.name,
        avatar: post.createdBy.avatar
      }
    }));

    // Get 3 questions with most answers and their most liked answer
    const questionsWithMostAnswers = await Question.aggregate([
      // Match questions that have at least one answer
      {
        $match: {
          answers: { $exists: true, $not: { $size: 0 } }
        }
      },
      // Add answer count field
      {
        $addFields: {
          answerCount: { $size: "$answers" }
        }
      },
      // Sort by answer count descending
      {
        $sort: { answerCount: -1 }
      },
      // Get top 3 questions
      {
        $limit: 3
      },
      // Lookup answers for these questions
      {
        $lookup: {
          from: 'answers',
          localField: 'answers',
          foreignField: '_id',
          as: 'answersData'
        }
      },
      // Lookup question author details
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'authorData'
        }
      },
      // Find the most liked answer
      {
        $addFields: {
          mostLikedAnswer: {
            $reduce: {
              input: '$answersData',
              initialValue: null,
              in: {
                $cond: {
                  if: {
                    $or: [
                      { $eq: ['$$value', null] },
                      { $gt: [{ $size: { $ifNull: ['$$this.likes', []] } }, { $size: { $ifNull: ['$$value.likes', []] } }] }
                    ]
                  },
                  then: '$$this',
                  else: '$$value'
                }
              }
            }
          }
        }
      },
      // Lookup author of the most liked answer
      {
        $lookup: {
          from: 'users',
          localField: 'mostLikedAnswer.createdBy',
          foreignField: '_id',
          as: 'answerAuthorData'
        }
      },
      // Lookup comments for the most liked answer
      {
        $lookup: {
          from: 'qacomments',
          let: { answerId: '$mostLikedAnswer._id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$answeredTo', '$$answerId'] }
              }
            }
          ],
          as: 'answerComments'
        }
      },
      // Project final structure
      {
        $project: {
          _id: 1,
          questionText: 1,
          context: 1,
          tags: 1,
          answerCount: 1,
          createdAt: 1,
          author: {
            _id: { $arrayElemAt: ['$authorData._id', 0] },
            name: { $arrayElemAt: ['$authorData.name', 0] },
            avatar: { $arrayElemAt: ['$authorData.avatar', 0] }
          },
          mostLikedAnswer: {
            $cond: {
              if: { $gt: [{ $size: '$answersData' }, 0] },
              then: {
                _id: '$mostLikedAnswer._id',
                context: '$mostLikedAnswer.context',
                createdAt: '$mostLikedAnswer.createdAt',
                likesCount: { $size: { $ifNull: ['$mostLikedAnswer.likes', []] } },
                commentsCount: { $size: '$answerComments' },
                author: {
                  _id: { $arrayElemAt: ['$answerAuthorData._id', 0] },
                  name: { $arrayElemAt: ['$answerAuthorData.name', 0] },
                  avatar: { $arrayElemAt: ['$answerAuthorData.avatar', 0] }
                }
              },
              else: null
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        mostLikedArticles,
        mostLikedPosts: transformedPosts,
        questionsWithMostAnswers
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching most liked content',
      error: error.message
    });
  }
};

export const userSuggestions = async (req, res) => {
    try {
        const suggestions = await UserSuggestion.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            suggestions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching suggestions',
            error: error.message
        });
    }
};

export const createSuggestion = async (req, res) => {
    const { message } = req.body;
    const { userId } = req.user;

    try {
        const suggestion = await UserSuggestion.create({
            user: userId,
            message
        });

        await suggestion.populate('user', 'name email');

        res.status(201).json({
            success: true,
            message: 'Suggestion submitted successfully',
            suggestion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting suggestion',
            error: error.message
        });
    }
};

export const deleteSuggestion = async (req, res) => {
    const { suggestionId } = req.params;

    try {
        const suggestion = await UserSuggestion.findById(suggestionId);

        if (!suggestion) {
            return res.status(404).json({
                success: false,
                message: 'Suggestion not found'
            });
        }

        await suggestion.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Suggestion deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting suggestion',
            error: error.message
        });
    }
};

export const updateSuggestionStatus = async (req, res) => {
    const { suggestionId } = req.params;
    const { status } = req.body;

    try {
        const suggestion = await UserSuggestion.findById(suggestionId);

        if (!suggestion) {
            return res.status(404).json({
                success: false,
                message: 'Suggestion not found'
            });
        }

        if (!['pending', 'reviewed', 'implemented'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        suggestion.status = status;
        await suggestion.save();

        res.status(200).json({
            success: true,
            message: 'Suggestion status updated successfully',
            suggestion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating suggestion status',
            error: error.message
        });
    }
};
export const getUserAchievementsById = async (req, res) => {
  try {
    const { id: userId } = req.params;

    // Find the user with specific fields
    const user = await User.findById(userId).select(
      "name email avatar _id role totalPoints badges postCount answerCount questionCount commentCount likeCount streakCount longestStreak"
    );

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found"
      });
    }

    // Calculate user's progress and badges
    const progress = getUserProgress(user);

    // Calculate user's rank
    const userRank = await User.countDocuments({
      totalPoints: { $gt: user.totalPoints }
    }) + 1;

    // Define streak milestones
    const streakMilestones = [3, 7, 14, 30, 60, 90, 180, 365];

    // Calculate streak progress
    const streakProgress = {
      current: user.streakCount || 0,
      longest: user.longestStreak || 0,
      lastVisit: user.lastVisitDate,
      nextMilestone: streakMilestones.find(milestone => milestone > (user.streakCount || 0)) || streakMilestones[streakMilestones.length - 1],
      milestones: streakMilestones.map(milestone => ({
        days: milestone,
        achieved: (user.streakCount || 0) >= milestone,
        badge: `${milestone}-Day Streak`
      }))
    };

    // Respond with user achievements
    res.status(StatusCodes.OK).json({
      user: {
        name: user.name,
        avatar: user.avatar,
        _id: user._id,
        role: user.role,
        totalPoints: user.totalPoints,
        rank: userRank,
        streakCount: user.streakCount || 0,
        longestStreak: user.longestStreak || 0
      },
      progress,
      streakProgress
    });
  } catch (error) {
    console.error("Error in getUserAchievementsById:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while fetching user achievements"
    });
  }
};

export const getUserGamification = async (req, res) => {
  try {
    // Find the logged-in user with specific fields
    const user = await User.findById(req.user.userId).select(
      "name email avatar _id role totalPoints badges postCount answerCount questionCount commentCount likeCount streakCount longestStreak"
    );

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found"
      });
    }

    // Calculate user's progress and badges
    const progress = getUserProgress(user);

    // Calculate user's rank
    const userRank = await User.countDocuments({
      totalPoints: { $gt: user.totalPoints }
    }) + 1;

    // Retrieve top 20 users
    const topUsers = await User.aggregate([
      {
        $project: {
          name: 1,
          email: 1,
          avatar: 1,
          _id: 1,
          totalPoints: 1,
          badges: 1,
          postCount: 1,
          answerCount: 1,
          questionCount: 1,
          commentCount: 1,
          role: 1,
          streakCount: 1,
          longestStreak: 1
        }
      },
      {
        $sort: { totalPoints: -1 }
      },
      {
        $limit: 20
      }
    ]);

    // Format top users with rank and point breakdown
    const formattedTopUsers = topUsers.map((topUser, index) => ({
      ...topUser,
      rank: index + 1,
      pointBreakdown: {
        posts: topUser.postCount * 10,
        answers: topUser.answerCount * 15,
        questions: topUser.questionCount * 5,
        comments: topUser.commentCount * 3
      }
    }));

    // Respond with user details, progress, rank, and top users
    res.status(StatusCodes.OK).json({
      user: {
        ...user.toObject(),
        rank: userRank
      },
      progress,
      topUsers: formattedTopUsers
    });
  } catch (error) {
    console.error("Error in getUserGamification:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while fetching user gamification details"
    });
  }
};

// Get anonymous posts created by the logged-in user
export const getAnonymousPosts = async (req, res) => {
  try {
    const { userId } = req.user;

    // Find posts where the real creator is the logged-in user and isAnonymous is true
    const anonymousPosts = await Post.aggregate([
      {
        $match: {
          realCreator: new mongoose.Types.ObjectId(userId),
          isAnonymous: true,
          deleted: { $ne: true }
        }
      },
      {
        $addFields: {
          username: "Anonymous",
          userAvatar: null,
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $size: { $ifNull: ["$comments", []] } },
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      posts: anonymousPosts
    });
  } catch (error) {
    console.error('Error fetching anonymous posts:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching anonymous posts"
    });
  }
};

// Get anonymous stories created by the logged-in user
export const getAnonymousStories = async (req, res) => {
  try {
    const { userId } = req.user;

    // Find stories where the real creator is the logged-in user and isAnonymous is true
    const anonymousStories = await PersonalStory.aggregate([
      {
        $match: {
          realCreator: new mongoose.Types.ObjectId(userId),
          isAnonymous: true,
          deleted: { $ne: true }
        }
      },
      {
        $addFields: {
          authorName: "Anonymous",
          authorAvatar: null,
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $size: { $ifNull: ["$comments", []] } },
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      stories: anonymousStories
    });
  } catch (error) {
    console.error('Error fetching anonymous stories:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching anonymous stories"
    });
  }
};

// Get anonymous questions created by the logged-in user
export const getAnonymousQuestions = async (req, res) => {
  try {
    const { userId } = req.user;

    // Find questions where the real creator is the logged-in user and isAnonymous is true
    const anonymousQuestions = await Question.aggregate([
      {
        $match: {
          realCreator: new mongoose.Types.ObjectId(userId),
          isAnonymous: true,
          deleted: { $ne: true }
        }
      },
      {
        $addFields: {
          authorName: "Anonymous",
          authorAvatar: null,
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalAnswers: { $size: { $ifNull: ["$answers", []] } },
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      questions: anonymousQuestions
    });
  } catch (error) {
    console.error('Error fetching anonymous questions:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching anonymous questions"
    });
  }
};

// Get anonymous answers created by the logged-in user
export const getAnonymousAnswers = async (req, res) => {
  try {
    const { userId } = req.user;

    // Find answers where the real creator is the logged-in user and isAnonymous is true
    const anonymousAnswers = await Answer.aggregate([
      {
        $match: {
          realCreator: new mongoose.Types.ObjectId(userId),
          isAnonymous: true,
          deleted: { $ne: true }
        }
      },
      {
        $addFields: {
          authorName: "Anonymous",
          authorAvatar: null,
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $size: { $ifNull: ["$comments", []] } },
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      answers: anonymousAnswers
    });
  } catch (error) {
    console.error('Error fetching anonymous answers:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching anonymous answers"
    });
  }
};

export const updateAvatarCustomization = async (req, res) => {
    try {
        const { avatarFrame, avatarAccessories } = req.body;
        const userId = req.user._id;

        // Get user's current points
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate frame selection
        const availableFrames = [
            { id: 'default', minPoints: 0 },
            { id: 'bronze', minPoints: 50 },
            { id: 'silver', minPoints: 300 },
            { id: 'gold', minPoints: 1200 },
            { id: 'diamond', minPoints: 2000 },
            { id: 'elite', minPoints: 5000 }
        ];

        const selectedFrame = availableFrames.find(f => f.id === avatarFrame);
        if (!selectedFrame || user.currentPoints < selectedFrame.minPoints) {
            return res.status(400).json({ message: "Insufficient points for selected frame" });
        }

        // Validate accessory selection
        const availableAccessories = [
            { id: 'star', minPoints: 100 },
            { id: 'verified', minPoints: 500 },
            { id: 'crown', minPoints: 1500 },
            { id: 'gem', minPoints: 2500 }
        ];

        const selectedAccessories = avatarAccessories || [];
        const invalidAccessories = selectedAccessories.filter(accessory => {
            const accessoryData = availableAccessories.find(a => a.id === accessory);
            return !accessoryData || user.currentPoints < accessoryData.minPoints;
        });

        if (invalidAccessories.length > 0) {
            return res.status(400).json({ 
                message: "Insufficient points for some accessories",
                invalidAccessories
            });
        }

        // Update user's avatar customization
        await User.findByIdAndUpdate(userId, {
            avatarFrame,
            avatarAccessories
        });

        res.json({ message: "Avatar customization updated successfully" });
    } catch (error) {
        console.error("Error updating avatar customization:", error);
        res.status(500).json({ message: "Server error" });
    }
};