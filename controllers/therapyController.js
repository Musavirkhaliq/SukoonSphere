import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import TherapySession from "../models/therapy/therapySessionModel.js";
import TherapyAssessment from "../models/therapy/therapyAssessmentModel.js";
dotenv.config();

// Initialize the Google Generative AI with API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
console.log('Initializing Gemini API with key:', apiKey ? 'Key exists' : 'Key missing');

const genAI = new GoogleGenerativeAI(apiKey);

// Get the generative model (Gemini-1.0-pro is more stable for chat)
// Note: If you have access to gemini-1.5-pro, that would be even better
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Maximum number of messages to include for context
const MAX_CONTEXT_MESSAGES = 15;

// SukoonAI system prompt
const THERAPY_SYSTEM_PROMPT = `You are SukoonAI, an advanced AI companion for self-discovery and personal growth. Your tagline is "Where you discover yourself, we help you." You guide users on a journey of self-exploration, helping them understand themselves better and achieve personal growth. Follow this structured approach:

1. WARM INTRODUCTION: Begin with a warm, personalized greeting that establishes a connection and creates a safe space for exploration.

2. SELF-REFLECTION: Guide users through thoughtful self-reflection exercises that help them discover their values, strengths, patterns, and areas for growth.

3. PERSONALIZED QUESTIONING: Ask insightful, open-ended questions that encourage deeper self-awareness and exploration of their unique experiences.

4. ANALYSIS & INSIGHTS: Offer thoughtful observations based on their responses, drawing from evidence-based approaches (positive psychology, mindfulness, CBT, ACT) to help them gain new perspectives.

5. PERSONALIZED GROWTH PLAN: Co-create practical, achievable steps that align with their values and goals for continued self-discovery and development.

6. PROGRESS TRACKING: Help users recognize patterns, celebrate growth, and identify opportunities for further exploration across sessions.

7. CONTINUOUS ENCOURAGEMENT: Provide positive reinforcement, normalize challenges as part of the growth process, and maintain an optimistic yet realistic outlook.

IMPORTANT GUIDELINES:
- Focus on self-discovery and growth rather than clinical therapy
- Maintain a warm, supportive, and curious tone throughout all interactions
- Use evidence-based approaches while respecting individual differences
- Emphasize the user's innate wisdom and capacity for self-understanding
- For crisis situations, compassionately direct users to appropriate emergency resources
- Protect user privacy and maintain confidentiality
- Suggest professional support when appropriate

Your goal is to create an empowering journey of self-discovery where users gain deeper insights about themselves, develop practical strategies for growth, and feel supported throughout their personal evolution.`;

// Function to handle therapy messages
export const handleTherapyMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user?._id || req.user?.userId;

    console.log('Therapy message request:', { message, sessionId });
    console.log('User from request:', req.user);
    console.log('Extracted userId:', userId);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // For therapy, we require authentication
    if (!userId) {
      return res.status(401).json({ error: "Authentication required for therapy sessions" });
    }

    // Validate sessionId
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    let session;

    try {
      // Find the specific session
      session = await TherapySession.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        return res.status(404).json({ error: "Therapy session not found" });
      }

      // Check if session is active
      if (session.status !== "active") {
        return res.status(400).json({ error: "Cannot send messages to a completed session" });
      }

      console.log('Found session:', {
        id: session._id,
        userId: session.userId,
        status: session.status,
        messageCount: session.messages?.length
      });
    } catch (error) {
      console.error('Error finding session:', error);
      return res.status(500).json({ error: "Error retrieving therapy session" });
    }

    // Get recent messages for context
    const chatHistory = session.getRecentMessages(MAX_CONTEXT_MESSAGES);

    // For Gemini API, we'll use a simpler approach without chat history
    // This avoids issues with the history format and makes the API more reliable
    console.log('Using direct prompt approach instead of chat history');

    // We'll create a prompt that includes the relevant context from previous messages
    let contextPrompt = "";

    if (chatHistory.length > 0) {
      contextPrompt = "Previous conversation:\n\n";
      chatHistory.forEach(msg => {
        const role = msg.sender === "user" ? "User" : "Therapist";
        contextPrompt += `${role}: ${msg.text}\n\n`;
      });
      contextPrompt += "\nContinue the conversation as the therapist. The user's latest message is: " + message;
    } else {
      // If there's no history, just use the message directly with the system prompt
      contextPrompt = message;
    }

    console.log('Using context prompt approach with length:', contextPrompt.length);

    try {
      // Instead of using chat history, we'll use a single prompt with the system instruction
      // and the context from previous messages
      console.log('Creating combined prompt with system instruction and context...');

      // Combine system prompt with context
      const fullPrompt = `${THERAPY_SYSTEM_PROMPT}\n\n${contextPrompt}`;

      // Use the generateContent method instead of chat
      console.log('Generating content with Gemini API...');
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });

      const response = result.response;
      const responseText = response.text();
      console.log('Received response from Gemini API:', responseText.substring(0, 100) + '...');

      // Add user message to the session
      console.log('Adding user message to session...');
      // Instead of using the model method, directly update the document
      session.messages.push({
        sender: "user",
        text: message,
        timestamp: new Date()
      });

      // Add therapist response to the session
      console.log('Adding therapist response to session...');
      session.messages.push({
        sender: "therapist",
        text: responseText,
        timestamp: new Date()
      });

      // Update the lastUpdated timestamp
      session.lastUpdated = new Date();

      // Save the session
      await session.save();

      // Return the response
      console.log('Sending response to client...');
      return res.status(200).json({
        response: responseText,
        sessionId: session._id,
        sessionNumber: session.sessionNumber
      });
    } catch (error) {
      console.error('Error in Gemini API communication:', error);
      console.error('Error details:', error.stack);

      // Log more details about the error
      if (error.response) {
        console.error('API response error:', error.response);
      }

      // Handle specific Gemini API errors
      if (error.message?.includes('API key')) {
        return res.status(401).json({ error: 'Invalid Gemini API key. Please check your configuration.' });
      }

      if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        return res.status(429).json({ error: 'Gemini API rate limit exceeded. Please try again later.' });
      }

      if (error.message?.includes('not iterable')) {
        console.error('Received "not iterable" error. Message format:', typeof message, message);
        console.error('Chat history format:', JSON.stringify(formattedHistory));
        return res.status(500).json({ error: 'Error with message format: ' + error.message });
      }

      return res.status(500).json({ error: 'Error communicating with the AI model: ' + error.message });
    }
  } catch (error) {
    console.error("Therapy chatbot error:", error);

    // Handle specific API errors
    if (error.message?.includes("API key")) {
      return res.status(401).json({ error: "Invalid API key. Please check your configuration." });
    }

    // Handle rate limiting
    if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }

    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

// Function to get therapy session history
export const getTherapySessions = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    console.log('Get therapy sessions - User:', req.user);
    console.log('Get therapy sessions - UserId:', userId);

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Find all sessions for the user, sorted by session number
    const sessions = await TherapySession.find({
      userId
    }).sort({ sessionNumber: -1 });

    return res.status(200).json({
      sessions: sessions.map(session => ({
        _id: session._id,
        sessionNumber: session.sessionNumber,
        title: session.title,
        status: session.status,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        lastUpdated: session.lastUpdated,
        messageCount: session.messages.length,
        summary: session.summary,
        insights: session.insights,
        recommendations: session.recommendations
      }))
    });
  } catch (error) {
    console.error("Error fetching therapy sessions:", error);
    return res.status(500).json({ error: "Failed to retrieve therapy sessions" });
  }
};

// Function to get a specific therapy session
export const getTherapySession = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    const { sessionId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Find the specific session
    const session = await TherapySession.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ error: "Therapy session not found" });
    }

    return res.status(200).json({
      session
    });
  } catch (error) {
    console.error("Error fetching therapy session:", error);
    return res.status(500).json({ error: "Failed to retrieve therapy session" });
  }
};

// Function to start a new therapy session
export const startNewTherapySession = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    console.log('Start new therapy session - User:', req.user);
    console.log('Start new therapy session - UserId:', userId);

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Find the highest session number for this user
    const lastSession = await TherapySession.findOne({ userId }).sort({ sessionNumber: -1 });
    const sessionNumber = lastSession ? lastSession.sessionNumber + 1 : 1;

    // Mark any active sessions as completed
    await TherapySession.updateMany(
      { userId, status: "active" },
      { status: "completed", endedAt: new Date() }
    );

    // Create a new session
    const newSession = await TherapySession.create({
      userId,
      sessionNumber,
      title: `Therapy Session #${sessionNumber}`,
      messages: [],
    });

    // Add initial SukoonAI welcome message
    const welcomeMessage = `Welcome to SukoonAI session #${sessionNumber}. I'm your AI companion for self-discovery and personal growth. Where you discover yourself, we help you.

How are you feeling today? We can begin our journey of self-exploration by discussing what's on your mind, or I can guide you through some reflective exercises to help you gain deeper insights about yourself.`;

    // Add the message directly to the messages array
    newSession.messages.push({
      sender: "therapist",
      text: welcomeMessage,
      timestamp: new Date()
    });

    // Update the lastUpdated timestamp
    newSession.lastUpdated = new Date();

    // Save the session
    await newSession.save();

    return res.status(201).json({
      message: "New therapy session started",
      sessionId: newSession._id,
      sessionNumber: newSession.sessionNumber,
      welcomeMessage
    });
  } catch (error) {
    console.error("Error starting new therapy session:", error);
    return res.status(500).json({ error: "Failed to start new therapy session" });
  }
};

// Function to complete a therapy session
export const completeTherapySession = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    const { sessionId } = req.params;
    const { moodAfter, feedback } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Find the session
    const session = await TherapySession.findOne({
      _id: sessionId,
      userId,
      status: "active"
    });

    if (!session) {
      return res.status(404).json({ error: "Active therapy session not found" });
    }

    // Get all messages for context
    const sessionMessages = session.messages || [];

    // Create a context string from all messages
    let conversationContext = "";

    if (sessionMessages.length > 0) {
      conversationContext = "Full conversation:\n\n";
      sessionMessages.forEach(msg => {
        const role = msg.sender === "user" ? "User" : "Therapist";
        conversationContext += `${role}: ${msg.text}\n\n`;
      });
    } else {
      console.log('No messages found in session for summary generation');
      conversationContext = "No conversation history available.";
    }

    // Generate a summary using Gemini
    const summaryPrompt = `Please analyze this therapy conversation and provide:
1. A brief summary of the key points discussed
2. 3-5 key insights about the client's situation
3. 2-3 specific recommendations for the client

Format your response as:
SUMMARY: [brief summary]
INSIGHTS: [numbered list of insights]
RECOMMENDATIONS: [numbered list of recommendations]`;

    // Initialize summary variables
    let summary = "";
    const insights = [];
    const recommendations = [];
    let summaryText = "";

    try {
      console.log('Generating summary with Gemini API...');

      // Combine the conversation context with the summary prompt
      const fullSummaryPrompt = `${THERAPY_SYSTEM_PROMPT}\n\n${conversationContext}\n\n${summaryPrompt}`;

      // Use generateContent instead of chat
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullSummaryPrompt }] }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.4,  // Lower temperature for more focused summary
          topP: 0.8,
          topK: 40,
        },
      });

      summaryText = result.response.text();
      console.log('Received summary from Gemini API:', summaryText.substring(0, 100) + '...');
    } catch (error) {
      console.error('Error generating summary with Gemini API:', error);
      console.error('Error details:', error.stack);

      // Log more details about the error
      if (error.response) {
        console.error('API response error:', error.response);
      }

      if (error.message?.includes('not iterable')) {
        console.error('Received "not iterable" error. Summary prompt format:', typeof summaryPrompt, summaryPrompt);
        console.error('Chat history format for summary:', JSON.stringify(allMessages));
      }

      // Continue with the session completion even if summary generation fails
      await session.completeSession(moodAfter);

      return res.status(200).json({
        message: "Therapy session completed successfully without summary",
        sessionId: session._id,
        summary: "Summary generation failed: " + error.message,
        insights: [],
        recommendations: []
      });
    }

    const summaryMatch = summaryText.match(/SUMMARY:(.*?)(?=INSIGHTS:|$)/s);
    if (summaryMatch && summaryMatch[1]) {
      summary = summaryMatch[1].trim();
    }

    const insightsMatch = summaryText.match(/INSIGHTS:(.*?)(?=RECOMMENDATIONS:|$)/s);
    if (insightsMatch && insightsMatch[1]) {
      const insightsText = insightsMatch[1].trim();
      const insightItems = insightsText.split(/\d+\.\s+/).filter(item => item.trim().length > 0);
      insights.push(...insightItems);
    }

    const recommendationsMatch = summaryText.match(/RECOMMENDATIONS:(.*?)$/s);
    if (recommendationsMatch && recommendationsMatch[1]) {
      const recommendationsText = recommendationsMatch[1].trim();
      const recommendationItems = recommendationsText.split(/\d+\.\s+/).filter(item => item.trim().length > 0);
      recommendations.push(...recommendationItems);
    }

    // Update the session with summary and complete it
    await session.updateSummary(summary, insights, recommendations);

    // If feedback is provided, add it as a user message
    if (feedback) {
      // Add the feedback message directly
      session.messages.push({
        sender: "user",
        text: `Session feedback: ${feedback}`,
        timestamp: new Date()
      });
    }

    // Complete the session
    session.status = "completed";
    session.endedAt = new Date();
    if (moodAfter) {
      if (!session.mood) {
        session.mood = {};
      }
      session.mood.after = moodAfter;
    }
    session.lastUpdated = new Date();
    await session.save();

    return res.status(200).json({
      message: "Therapy session completed successfully",
      sessionId: session._id,
      summary,
      insights,
      recommendations
    });
  } catch (error) {
    console.error("Error completing therapy session:", error);
    return res.status(500).json({ error: "Failed to complete therapy session" });
  }
};

// Function to get assessment questions
export const getAssessmentQuestions = async (req, res) => {
  try {
    const { type = "initial" } = req.query;

    // Find an active assessment of the specified type
    const assessment = await TherapyAssessment.findOne({
      type,
      isActive: true
    });

    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    return res.status(200).json({
      assessment: {
        _id: assessment._id,
        name: assessment.name,
        description: assessment.description,
        type: assessment.type,
        categories: assessment.categories,
        questions: assessment.questions
      }
    });
  } catch (error) {
    console.error("Error fetching assessment questions:", error);
    return res.status(500).json({ error: "Failed to retrieve assessment questions" });
  }
};

// Function to submit assessment responses
export const submitAssessmentResponses = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    const { sessionId, responses } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!sessionId || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: "Session ID and responses array are required" });
    }

    // Find the session
    const session = await TherapySession.findOne({
      _id: sessionId,
      userId,
      status: "active"
    });

    if (!session) {
      return res.status(404).json({ error: "Active therapy session not found" });
    }

    // Add each assessment response to the session
    for (const response of responses) {
      const { questionId, question, answer, score, category } = response;
      await session.addAssessmentResponse(questionId, question, answer, score, category);
    }

    // Generate a message about the assessment completion
    const assessmentMessage = "Thank you for completing the assessment. This helps me understand your situation better. Let's discuss your responses and explore how I can support you.";

    // Add the message directly
    session.messages.push({
      sender: "therapist",
      text: assessmentMessage,
      messageType: "assessment",
      timestamp: new Date()
    });

    // Update the lastUpdated timestamp
    session.lastUpdated = new Date();
    await session.save();

    return res.status(200).json({
      message: "Assessment responses saved successfully",
      sessionId: session._id,
      responseMessage: assessmentMessage
    });
  } catch (error) {
    console.error("Error submitting assessment responses:", error);
    return res.status(500).json({ error: "Failed to submit assessment responses" });
  }
};

// Function to create an action plan
export const createActionPlan = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    const { sessionId, title, description, tasks } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!sessionId || !title || !description) {
      return res.status(400).json({ error: "Session ID, title, and description are required" });
    }

    // Find the session
    const session = await TherapySession.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ error: "Therapy session not found" });
    }

    // Add the action plan to the session directly
    if (!session.actionPlans) {
      session.actionPlans = [];
    }

    // Create the action plan
    const newActionPlan = {
      title,
      description,
      tasks: tasks || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add it to the session
    session.actionPlans.push(newActionPlan);

    // Add a message about the action plan
    const actionPlanMessage = `I've created an action plan titled "${title}" for you. This plan includes specific steps to help you address the challenges we've discussed. You can view and track your progress on this plan in your therapy dashboard.`;

    // Add the message directly
    session.messages.push({
      sender: "therapist",
      text: actionPlanMessage,
      messageType: "action_plan",
      timestamp: new Date()
    });

    // Update the lastUpdated timestamp
    session.lastUpdated = new Date();
    await session.save();

    return res.status(201).json({
      message: "Action plan created successfully",
      sessionId: session._id,
      responseMessage: actionPlanMessage
    });
  } catch (error) {
    console.error("Error creating action plan:", error);
    return res.status(500).json({ error: "Failed to create action plan" });
  }
};

// Function to update action plan task status
export const updateActionPlanTask = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    const { sessionId, actionPlanIndex, taskIndex, completed } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (sessionId === undefined || actionPlanIndex === undefined || taskIndex === undefined || completed === undefined) {
      return res.status(400).json({ error: "Session ID, action plan index, task index, and completed status are required" });
    }

    // Find the session
    const session = await TherapySession.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ error: "Therapy session not found" });
    }

    // Check if action plan exists
    if (!session.actionPlans[actionPlanIndex]) {
      return res.status(404).json({ error: "Action plan not found" });
    }

    // Check if task exists
    if (!session.actionPlans[actionPlanIndex].tasks[taskIndex]) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update the task status
    session.actionPlans[actionPlanIndex].tasks[taskIndex].completed = completed;
    session.actionPlans[actionPlanIndex].updatedAt = new Date();
    session.markModified('actionPlans');
    await session.save();

    return res.status(200).json({
      message: "Task status updated successfully",
      sessionId: session._id,
      actionPlanIndex,
      taskIndex,
      completed
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    return res.status(500).json({ error: "Failed to update task status" });
  }
};

// Function to initialize assessment data
// Note: This doesn't require authentication, so we don't use the req parameter
export const initializeAssessmentData = async (_, res) => {
  try {
    // Check if assessment data already exists
    const existingAssessment = await TherapyAssessment.findOne();

    if (existingAssessment) {
      return res.status(200).json({ message: "Assessment data already initialized" });
    }

    // Create initial assessment
    const initialAssessment = {
      name: "Initial Mental Health Assessment",
      description: "This assessment helps us understand your current mental health state and establish a baseline for therapy.",
      type: "initial",
      categories: [
        {
          name: "Mood",
          description: "Questions about your current emotional state",
          order: 1
        },
        {
          name: "Anxiety",
          description: "Questions about worry and anxiety symptoms",
          order: 2
        },
        {
          name: "Sleep",
          description: "Questions about your sleep patterns",
          order: 3
        },
        {
          name: "Social",
          description: "Questions about your social connections",
          order: 4
        },
        {
          name: "Self-Care",
          description: "Questions about your self-care habits",
          order: 5
        }
      ],
      questions: [
        {
          questionId: "mood-1",
          text: "Over the past two weeks, how would you rate your overall mood?",
          type: "scale",
          options: [
            { value: "1", label: "Very poor", score: 1 },
            { value: "2", label: "Poor", score: 2 },
            { value: "3", label: "Fair", score: 3 },
            { value: "4", label: "Good", score: 4 },
            { value: "5", label: "Very good", score: 5 }
          ],
          category: "Mood",
          order: 1
        },
        {
          questionId: "mood-2",
          text: "How often have you felt down, depressed, or hopeless in the past two weeks?",
          type: "multiple_choice",
          options: [
            { value: "never", label: "Not at all", score: 4 },
            { value: "several", label: "Several days", score: 3 },
            { value: "more_than_half", label: "More than half the days", score: 2 },
            { value: "nearly_every_day", label: "Nearly every day", score: 1 }
          ],
          category: "Mood",
          order: 2
        },
        {
          questionId: "mood-3",
          text: "How often have you had little interest or pleasure in doing things you usually enjoy?",
          type: "multiple_choice",
          options: [
            { value: "never", label: "Not at all", score: 4 },
            { value: "several", label: "Several days", score: 3 },
            { value: "more_than_half", label: "More than half the days", score: 2 },
            { value: "nearly_every_day", label: "Nearly every day", score: 1 }
          ],
          category: "Mood",
          order: 3
        },
        {
          questionId: "anxiety-1",
          text: "How often have you been bothered by feeling nervous, anxious, or on edge?",
          type: "multiple_choice",
          options: [
            { value: "never", label: "Not at all", score: 4 },
            { value: "several", label: "Several days", score: 3 },
            { value: "more_than_half", label: "More than half the days", score: 2 },
            { value: "nearly_every_day", label: "Nearly every day", score: 1 }
          ],
          category: "Anxiety",
          order: 1
        },
        {
          questionId: "anxiety-2",
          text: "How often have you been bothered by not being able to stop or control worrying?",
          type: "multiple_choice",
          options: [
            { value: "never", label: "Not at all", score: 4 },
            { value: "several", label: "Several days", score: 3 },
            { value: "more_than_half", label: "More than half the days", score: 2 },
            { value: "nearly_every_day", label: "Nearly every day", score: 1 }
          ],
          category: "Anxiety",
          order: 2
        },
        {
          questionId: "sleep-1",
          text: "How would you rate your sleep quality over the past two weeks?",
          type: "scale",
          options: [
            { value: "1", label: "Very poor", score: 1 },
            { value: "2", label: "Poor", score: 2 },
            { value: "3", label: "Fair", score: 3 },
            { value: "4", label: "Good", score: 4 },
            { value: "5", label: "Very good", score: 5 }
          ],
          category: "Sleep",
          order: 1
        },
        {
          questionId: "sleep-2",
          text: "How often have you had trouble falling asleep, staying asleep, or sleeping too much?",
          type: "multiple_choice",
          options: [
            { value: "never", label: "Not at all", score: 4 },
            { value: "several", label: "Several days", score: 3 },
            { value: "more_than_half", label: "More than half the days", score: 2 },
            { value: "nearly_every_day", label: "Nearly every day", score: 1 }
          ],
          category: "Sleep",
          order: 2
        },
        {
          questionId: "social-1",
          text: "How satisfied are you with your social connections and relationships?",
          type: "scale",
          options: [
            { value: "1", label: "Very dissatisfied", score: 1 },
            { value: "2", label: "Dissatisfied", score: 2 },
            { value: "3", label: "Neutral", score: 3 },
            { value: "4", label: "Satisfied", score: 4 },
            { value: "5", label: "Very satisfied", score: 5 }
          ],
          category: "Social",
          order: 1
        },
        {
          questionId: "social-2",
          text: "How often do you feel lonely or isolated?",
          type: "multiple_choice",
          options: [
            { value: "never", label: "Never", score: 5 },
            { value: "rarely", label: "Rarely", score: 4 },
            { value: "sometimes", label: "Sometimes", score: 3 },
            { value: "often", label: "Often", score: 2 },
            { value: "always", label: "Always", score: 1 }
          ],
          category: "Social",
          order: 2
        },
        {
          questionId: "self-care-1",
          text: "How would you rate your self-care habits (exercise, nutrition, relaxation)?",
          type: "scale",
          options: [
            { value: "1", label: "Very poor", score: 1 },
            { value: "2", label: "Poor", score: 2 },
            { value: "3", label: "Fair", score: 3 },
            { value: "4", label: "Good", score: 4 },
            { value: "5", label: "Very good", score: 5 }
          ],
          category: "Self-Care",
          order: 1
        },
        {
          questionId: "self-care-2",
          text: "What self-care activities do you currently practice?",
          type: "open_ended",
          options: [],
          category: "Self-Care",
          order: 2
        },
        {
          questionId: "open-1",
          text: "What specific concerns or challenges would you like to address in therapy?",
          type: "open_ended",
          options: [],
          category: "Mood",
          order: 4
        },
        {
          questionId: "open-2",
          text: "What are your goals for therapy? What would you like to achieve?",
          type: "open_ended",
          options: [],
          category: "Mood",
          order: 5
        }
      ]
    };

    await TherapyAssessment.create(initialAssessment);

    // Create progress assessment
    const progressAssessment = {
      name: "Progress Check-In",
      description: "This assessment helps us track your progress and adjust our approach as needed.",
      type: "progress",
      categories: [
        {
          name: "Progress",
          description: "Questions about your progress since the last session",
          order: 1
        },
        {
          name: "Current State",
          description: "Questions about your current mental state",
          order: 2
        },
        {
          name: "Goals",
          description: "Questions about your therapy goals",
          order: 3
        }
      ],
      questions: [
        {
          questionId: "journey-1",
          text: "Since our last conversation, have you had any new insights about yourself?",
          type: "open_ended",
          options: [],
          category: "Journey Progress",
          order: 1
        },
        {
          questionId: "journey-2",
          text: "How would you describe your self-discovery journey since we last spoke?",
          type: "multiple_choice",
          options: [
            { value: "deepening", label: "Deepening - I'm gaining more clarity", score: 0 },
            { value: "challenging", label: "Challenging - I'm working through difficult realizations", score: 0 },
            { value: "surprising", label: "Surprising - I've discovered unexpected things", score: 0 },
            { value: "stalled", label: "Stalled - I feel stuck or uncertain", score: 0 },
            { value: "integrating", label: "Integrating - I'm applying what I've learned", score: 0 },
            { value: "other", label: "Other (please describe in our conversation)", score: 0 }
          ],
          category: "Journey Progress",
          order: 2
        },
        {
          questionId: "exploration-1",
          text: "What would you like to explore in our conversation today?",
          type: "multiple_choice",
          options: [
            { value: "patterns", label: "Understanding patterns in my life", score: 0 },
            { value: "decisions", label: "Clarity on a decision I'm facing", score: 0 },
            { value: "emotions", label: "Processing specific emotions", score: 0 },
            { value: "relationships", label: "Exploring relationship dynamics", score: 0 },
            { value: "purpose", label: "Finding meaning or purpose", score: 0 },
            { value: "balance", label: "Creating better balance in my life", score: 0 },
            { value: "other", label: "Something else (I'll share in our conversation)", score: 0 }
          ],
          category: "Current Exploration",
          order: 1
        },
        {
          questionId: "exploration-2",
          text: "How are you feeling about our conversation today?",
          type: "multiple_choice",
          options: [
            { value: "curious", label: "Curious and open", score: 0 },
            { value: "hopeful", label: "Hopeful for insights", score: 0 },
            { value: "uncertain", label: "Uncertain but willing", score: 0 },
            { value: "hesitant", label: "Somewhat hesitant", score: 0 },
            { value: "eager", label: "Eager to dive deep", score: 0 }
          ],
          category: "Current Exploration",
          order: 2
        },
        {
          questionId: "insights-1",
          text: "Have you noticed any patterns in your thoughts, feelings, or behaviors recently?",
          type: "open_ended",
          options: [],
          category: "Insights & Patterns",
          order: 1
        },
        {
          questionId: "insights-2",
          text: "What's one thing you've learned about yourself that you'd like to explore further?",
          type: "open_ended",
          options: [],
          category: "Insights & Patterns",
          order: 2
        }
      ]
    };

    await TherapyAssessment.create(progressAssessment);

    return res.status(201).json({ message: "Assessment data initialized successfully" });
  } catch (error) {
    console.error("Error initializing assessment data:", error);
    return res.status(500).json({ error: "Failed to initialize assessment data" });
  }
};
