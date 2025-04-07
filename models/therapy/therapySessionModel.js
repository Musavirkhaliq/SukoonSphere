import mongoose from "mongoose";

// Schema for individual messages in a therapy session
const TherapyMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["user", "therapist"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "question", "assessment", "recommendation", "action_plan"],
      default: "text",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }
);

// Schema for assessment responses
const AssessmentResponseSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }
);

// Schema for action plans created during therapy
const ActionPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tasks: [{
      task: String,
      completed: {
        type: Boolean,
        default: false
      },
      dueDate: Date
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  }
);

// Main therapy session schema
const TherapySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      default: "Therapy Session",
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    messages: [TherapyMessageSchema],
    assessments: [AssessmentResponseSchema],
    actionPlans: [ActionPlanSchema],
    summary: {
      type: String,
      default: "",
    },
    insights: [{
      type: String
    }],
    recommendations: [{
      type: String
    }],
    mood: {
      before: {
        type: Number,
        min: 1,
        max: 10,
      },
      after: {
        type: Number,
        min: 1,
        max: 10,
      }
    },
    tags: [{
      type: String
    }],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

// Index for faster queries
TherapySessionSchema.index({ userId: 1, sessionNumber: -1 });
TherapySessionSchema.index({ userId: 1, status: 1 });

// Pre-save hook to update lastUpdated timestamp
TherapySessionSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to find or create a session for a user
TherapySessionSchema.statics.findOrCreateSession = async function (userId) {
  // Find the most recent active session for this user
  let session = await this.findOne({
    userId,
    status: "active"
  }).sort({ sessionNumber: -1 });

  // If no active session exists, create a new one
  if (!session) {
    // Find the highest session number for this user
    const lastSession = await this.findOne({ userId }).sort({ sessionNumber: -1 });
    const sessionNumber = lastSession ? lastSession.sessionNumber + 1 : 1;

    session = await this.create({
      userId,
      sessionNumber,
      title: `Therapy Session #${sessionNumber}`,
      messages: [],
    });
  }

  return session;
};

// Method to add a message to the session
TherapySessionSchema.methods.addMessage = async function (sender, text, messageType = "text") {
  try {
    if (!sender || !text) {
      throw new Error('Sender and text are required for messages');
    }

    // Create a new message with timestamp
    const newMessage = {
      sender,
      text,
      messageType,
      timestamp: new Date()
    };

    // Add the message to the messages array
    this.messages.push(newMessage);
    this.lastUpdated = new Date();

    // Save the session
    await this.save();
    return this;
  } catch (error) {
    console.error('Error adding message to therapy session:', error);
    throw error;
  }
};

// Method to add an assessment response
TherapySessionSchema.methods.addAssessmentResponse = async function (questionId, question, answer, score, category) {
  this.assessments.push({ questionId, question, answer, score, category });
  this.lastUpdated = new Date();
  await this.save();
  return this;
};

// Method to add an action plan
TherapySessionSchema.methods.addActionPlan = async function (title, description, tasks = []) {
  this.actionPlans.push({ title, description, tasks });
  this.lastUpdated = new Date();
  await this.save();
  return this;
};

// Method to update session summary
TherapySessionSchema.methods.updateSummary = async function (summary, insights = [], recommendations = []) {
  this.summary = summary;
  this.insights = insights;
  this.recommendations = recommendations;
  this.lastUpdated = new Date();
  await this.save();
  return this;
};

// Method to complete a session
TherapySessionSchema.methods.completeSession = async function (moodAfter) {
  this.status = "completed";
  this.endedAt = new Date();
  if (moodAfter) {
    this.mood.after = moodAfter;
  }
  this.lastUpdated = new Date();
  await this.save();
  return this;
};

// Method to get recent messages (for context)
TherapySessionSchema.methods.getRecentMessages = function (limit = 10) {
  return this.messages.slice(-limit);
};

const TherapySession = mongoose.model("TherapySession", TherapySessionSchema);

export default TherapySession;
