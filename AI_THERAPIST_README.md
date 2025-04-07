# AI Therapist Feature

This document provides instructions for setting up and using the AI Therapist feature in SukoonSphere.

## Overview

The AI Therapist is a chatbot that uses Google's Gemini API to provide therapy-like conversations, track sessions, and offer structured assessments. It's designed to help users explore their mental health concerns in a supportive environment.

## Setup Instructions

### 1. Get a Gemini API Key

1. Go to the [Google AI Studio](https://ai.google.dev/) and sign in with your Google account
2. Navigate to the API keys section
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

1. Add your Gemini API key to the `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### 3. Initialize Assessment Data

After starting the server for the first time, you need to initialize the assessment data:

```
POST /api/v1/therapy/admin/initialize-assessments
```

This will create the initial assessment questions and categories in the database.

## Features

### 1. Therapy Sessions

- Users can start new therapy sessions
- Sessions are saved in the database
- Users can view their past sessions
- Sessions can be completed with feedback

### 2. Structured Assessments

- Initial assessment for new users
- Progress assessments during therapy
- Multiple question types (scale, multiple choice, open-ended)
- Category-based organization

### 3. AI Therapist Interaction

- Natural conversation with the AI therapist
- Context-aware responses using session history
- Specialized system prompt for therapeutic guidance

### 4. Action Plans

- AI-generated action plans with tasks
- Task completion tracking
- Progress monitoring

### 5. Session Insights

- AI-generated session summaries
- Key insights from the conversation
- Personalized recommendations

## API Endpoints

### Message Handling
- `POST /api/v1/therapy/message` - Send a message to the AI therapist

### Session Management
- `GET /api/v1/therapy/sessions` - Get all therapy sessions for the user
- `GET /api/v1/therapy/sessions/:sessionId` - Get a specific therapy session
- `POST /api/v1/therapy/sessions/new` - Start a new therapy session
- `POST /api/v1/therapy/sessions/:sessionId/complete` - Complete a therapy session

### Assessments
- `GET /api/v1/therapy/assessments` - Get assessment questions
- `POST /api/v1/therapy/assessments/submit` - Submit assessment responses

### Action Plans
- `POST /api/v1/therapy/action-plans` - Create an action plan
- `PATCH /api/v1/therapy/action-plans/tasks` - Update action plan task status

### Admin Routes
- `POST /api/v1/therapy/admin/initialize-assessments` - Initialize assessment data

## Usage

1. Navigate to `/therapy` in the application
2. Start a new therapy session or continue an existing one
3. Complete the initial assessment (for new sessions)
4. Chat with the AI therapist
5. View insights and action plans in the respective tabs
6. Complete the session when finished

## Customization

You can customize the AI therapist's behavior by modifying the system prompt in `controllers/therapyController.js`:

```javascript
const THERAPY_SYSTEM_PROMPT = `You are an AI therapist named SukoonAI, designed to provide supportive, evidence-based mental health advice with empathy and professionalism. Follow these guidelines:

// ... existing prompt ...
`;
```

## Limitations

- The AI therapist is not a replacement for a human therapist
- It should not be used for crisis situations
- The quality of responses depends on the Gemini API
- The AI may not always understand complex emotional contexts

## Troubleshooting

### API Key Issues
- Ensure your Gemini API key is valid and has not expired
- Check that the key is correctly set in the `.env` file

### Rate Limiting
- The Gemini API has rate limits that may affect the AI therapist's availability
- Consider implementing a fallback mechanism for high traffic periods

### Database Issues
- Ensure MongoDB is running and accessible
- Check that the therapy session and assessment models are properly defined
