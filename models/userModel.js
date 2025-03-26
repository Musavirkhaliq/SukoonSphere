import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "contributor", "admin"],
    default: "user",
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
  avatar: String,
  avatarPublicId: String,
  phone: String,
  location: String,
  contributerKey: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answers",
    },
  ],
  counts: {
    totalPosts: Number,
    totalQuestions: Number,
    totalAnswers: Number,
    totalArticles: Number,
  },
  // gamification
  // points
  currentPoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  // badges
  badges: { type: [String], default: [] }, 
  postCount: { type: Number, default: 0 },
  answerCount: { type: Number, default: 0 },
  questionCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  // streak
  streakCount: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastVisitDate: { type: Date, default: null },
});

export default mongoose.model("User", userSchema);
