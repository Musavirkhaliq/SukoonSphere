import User from "../models/userModel.js";
import mongoose from "mongoose";
export const updateUserPoints = async (userId, action) => {
    const pointValues = {
      post: 10,
      deletePost: -10,
      question: 5,
      deleteQuestion: -5,
      answer: 15,
      deleteAnswer: -15,
      comment: 3,
      deleteComment: -3,
      like: 2,
      unlike: -2
    };
    
    if (!pointValues[action]) {
        throw new Error("Invalid action");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const pointsChange = pointValues[action];

    // Update current points with protection against going negative
    user.currentPoints = Math.max(0, user.currentPoints + pointsChange);

    // Update total points for all changes
    user.totalPoints += pointsChange;

    // Ensure totalPoints doesn't go negative (optional)
    user.totalPoints = Math.max(0, user.totalPoints);

    await user.save();

    return {
        currentPoints: user.currentPoints,
        totalPoints: user.totalPoints,
        message: `Points updated for action: ${action}`
    };
};

  export const awardBadges = async (userId, action) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const badgeMilestones = {
        post: { 
            first: "Trailblazer - First Post", 
            milestones: [10, 25, 50, 100, 200, 500], 
            milestoneBadges: ["Rising Writer - 10 Posts", "Storyteller - 25 Posts", "Content Creator - 50 Posts", "Master Blogger - 100 Posts", "Elite Contributor - 200 Posts", "Legendary Writer - 500 Posts"] 
        },
        answer: { 
            first: "Helper - First Answer", 
            milestones: [10, 25, 50, 100, 250, 500], 
            milestoneBadges: ["Problem Solver - 10 Answers", "Knowledge Giver - 25 Answers", "Community Expert - 50 Answers", "Wisdom Seeker - 100 Answers", "Elite Mentor - 250 Answers", "Grandmaster - 500 Answers"] 
        },
        question: { 
            first: "Curious Mind - First Question", 
            milestones: [5, 15, 30, 50, 100, 250], 
            milestoneBadges: ["Explorer - 5 Questions", "Deep Thinker - 15 Questions", "Inquisitive Mind - 30 Questions", "Philosopher - 50 Questions", "Seeker of Truth - 100 Questions", "Visionary - 250 Questions"] 
        },
        comment: { 
            first: "Engager - First Comment", 
            milestones: [20, 50, 100, 200, 500], 
            milestoneBadges: ["Conversationalist - 20 Comments", "Discussion Starter - 50 Comments", "Debater - 100 Comments", "Community Voice - 200 Comments", "Ultimate Commentator - 500 Comments"] 
        },
        like: { 
            first: "Supporter - First Like Given", 
            milestones: [50, 100, 250, 500, 1000], 
            milestoneBadges: ["Encourager - 50 Likes", "Kind Soul - 100 Likes", "Super Supporter - 250 Likes", "Community Hero - 500 Likes", "Champion of Kindness - 1000 Likes"] 
        }
    };

    if (!badgeMilestones[action]) {
        throw new Error("Invalid action type");
    }

    const { first, milestones, milestoneBadges } = badgeMilestones[action];
    const countField = `${action}Count`;

    // Initialize count if undefined, then increment
    user[countField] = (user[countField] || 0) + 1;

    let earnedBadges = [];

    // First-time badge
    if (user[countField] === 1 && !user.badges.includes(first)) {
        user.badges.push(first);
        earnedBadges.push(first);
    }

    // Milestone badges
    milestones.forEach((milestone, index) => {
        if (user[countField] === milestone && !user.badges.includes(milestoneBadges[index])) {
            user.badges.push(milestoneBadges[index]);
            earnedBadges.push(milestoneBadges[index]);
        }
    });

    await user.save();
    return earnedBadges;
};


  export const getUserProgress = (user) => {
    const badgeMilestones = {
        post: { 
          milestones: [10, 25, 50, 100, 200, 500], 
          milestoneBadges: ["Rising Writer - 10 Posts", "Storyteller - 25 Posts", "Content Creator - 50 Posts", "Master Blogger - 100 Posts", "Elite Contributor - 200 Posts", "Legendary Writer - 500 Posts"] 
        },
        answer: { 
          milestones: [10, 25, 50, 100, 250, 500], 
          milestoneBadges: ["Problem Solver - 10 Answers", "Knowledge Giver - 25 Answers", "Community Expert - 50 Answers", "Wisdom Seeker - 100 Answers", "Elite Mentor - 250 Answers", "Grandmaster - 500 Answers"] 
        },
        question: { 
          milestones: [5, 15, 30, 50, 100, 250], 
          milestoneBadges: ["Explorer - 5 Questions", "Deep Thinker - 15 Questions", "Inquisitive Mind - 30 Questions", "Philosopher - 50 Questions", "Seeker of Truth - 100 Questions", "Visionary - 250 Questions"] 
        },
        comment: { 
          milestones: [20, 50, 100, 200, 500], 
          milestoneBadges: ["Conversationalist - 20 Comments", "Discussion Starter - 50 Comments", "Debater - 100 Comments", "Community Voice - 200 Comments", "Ultimate Commentator - 500 Comments"] 
        },
        like: { 
          milestones: [50, 100, 250, 500, 1000], 
          milestoneBadges: ["Encourager - 50 Likes", "Kind Soul - 100 Likes", "Super Supporter - 250 Likes", "Community Hero - 500 Likes", "Champion of Kindness - 1000 Likes"] 
        }
      };
  
    let completed = [...user.badges]; // Start with all badges from user's profile
  
    let pending = [];
  
    Object.keys(badgeMilestones).forEach((action) => {
      const { milestones, milestoneBadges } = badgeMilestones[action];
      const countField = `${action}Count`;
  
      milestones.forEach((milestone, index) => {
        const badgeToCheck = milestoneBadges[index];
        if (user[countField] >= milestone && !completed.includes(badgeToCheck)) {
          completed.push(badgeToCheck);
        } else if (user[countField] < milestone) {
          pending.push({
            task: action,
            nextMilestone: milestone,
            badge: badgeToCheck,
            currentProgress: user[countField],
            remaining: milestone - user[countField]
          });
        }
      });
    });
  
    return { completed, pending };
};

export const updateUserStreak = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time from the date
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }



        if (!user.lastVisitDate) {
            // First-time visit
            user.streakCount = 1;
            user.longestStreak = 1;
        } else {
            const lastVisit = new Date(user.lastVisitDate);
            lastVisit.setHours(0, 0, 0, 0);
            
            const diffDays = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));
            

            if (diffDays === 1) {
                // Consecutive day visit
                user.streakCount += 1;
                user.longestStreak = Math.max(user.longestStreak || 0, user.streakCount);
            } else if (diffDays > 1) {
                // Missed a day
                user.streakCount = 1;
            } else if (diffDays === 0) {
                // Visited today already
                return {
                    streakCount: user.streakCount,
                    longestStreak: user.longestStreak
                };
            }
        }

        // Always update last visit date
        user.lastVisitDate = today;

        // Validate and save
        await user.save();

        return {
            streakCount: user.streakCount,
            longestStreak: user.longestStreak
        };
    } catch (error) {
        throw error;
    }
};
