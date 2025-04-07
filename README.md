# SukoonSphere

![SukoonSphere Logo]()

SukoonSphere is an innovative digital platform designed to address critical gaps in mental health awareness, education, and access to care. Through both a website and mobile app, SukoonSphere aims to create a comprehensive and supportive environment where users can access information, connect with professionals, and engage in meaningful discussions about mental health. The platform serves as a hub for individuals seeking support, professionals looking to enhance their skills, and institutions aiming to collaborate with experts.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Deployment](#deployment)
  - [Local Development](#local-development)
  - [Production Deployment](#production-deployment)
  - [Database Management](#database-management)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Contributing](#contributing)
- [Security](#security)
- [Project Objectives](#project-objectives)

## Features

### Core Features

1. **Curated Articles on Mental Health Topics**
   - A diverse collection of articles providing in-depth insights into various mental health issues, treatments, and wellness practices.

2. **Interactive Neuroscience Content**
   - Engaging, educational content that explores the brain's role in mental health, designed to be accessible and informative for all users.

3. **Expert-Institution Matchmaking System**
   - A feature that connects mental health experts with institutions in need of their services, fostering professional collaboration and enhancing care delivery.

4. **Therapist Training Portal**
   - A resource-rich portal offering training and development opportunities for aspiring and current mental health professionals, supporting their ongoing education and skill enhancement.

5. **Resource Directory for Seeking Help**
   - A comprehensive directory of mental health resources, including contact information for therapists, clinics, and support groups, ensuring users can easily find the help they need.

### Community Features

6. **Share a Story**
   - A section where users can share personal experiences with mental health, offering support and connection within the community, and encouraging others to share their own stories.

7. **Create and Share Videos**
   - A platform for users and experts to create and share video content related to mental health, including tips, therapy sessions, meditation guides, and personal experiences.

8. **Podcasts**
   - A dedicated space for hosting and listening to mental health podcasts, featuring expert insights, personal stories, and educational discussions.

9. **Debates and Discussions**
   - An interactive forum where users can engage in debates and discussions on mental health issues, moderated by professionals to ensure a safe and respectful environment.

10. **Write and Publish Articles**
    - A feature that allows users and professionals to write and publish articles on mental health topics, contributing to a diverse and ever-growing knowledge base.

### Support and Engagement

11. **Virtual Support Groups**
    - Facilitated online support groups where individuals facing similar mental health challenges can connect and support each other, guided by professional facilitators.

12. **Mental Health Challenges**
    - Regular challenges that encourage users to engage in positive mental health practices, such as mindfulness, journaling, or exercise, promoting proactive self-care.

13. **Interactive Webinars and Workshops**
    - Live sessions led by mental health experts, covering a wide range of topics and available to both the general public and professionals, enhancing knowledge and skills.

14. **Mental Health Resource Library**
    - A comprehensive library of books, articles, videos, and other resources, categorized by mental health topics, providing users with easy access to reliable information.

15. **Expert Q&A Sessions**
    - Regular live Q&A sessions with mental health professionals, offering users direct access to expert advice and personalized guidance.

16. **Mental Health Journal**
    - A secure, private journal feature where users can track their thoughts, moods, and progress over time, encouraging self-reflection and mental health monitoring.

17. **SukoonAI Chatbot**
    - An AI-powered chatbot that provides supportive, evidence-based mental health advice with empathy, focusing on self-discovery rather than therapy.

18. **Gamification Features**
    - Leaderboards, badges, streaks, and other gamification elements to encourage user engagement and participation.

## Technology Stack

- **Frontend**: React.js, Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Cloud Storage**: Cloudinary
- **AI Integration**: Custom trained model
- **Deployment**: PM2, Nginx

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SukoonSphere.git
   ```

2. Navigate to the repository:
   ```bash
   cd SukoonSphere
   ```

3. Install dependencies for both backend and frontend:
   ```bash
   npm run setup-project
   ```
   This will install dependencies for both the server and client.

### Environment Setup

This project uses environment variables for configuration. Example files are provided:
- `.env.example` in the root directory
- `client/.env.example` in the client directory

To set up your environment:

1. Copy these example files to create your own `.env` files:
   ```bash
   cp .env.example .env
   cp client/.env.example client/.env
   ```

2. Fill in your own values for the variables in both files:

   **Root .env file:**
   ```
   NODE_ENV=production
   PORT=5100
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   COOKIE_SECRET=your_cookie_secret
   JWT_EXPIRES_IN=1d
   BACKEND_URL=your_backend_url
   REQUEST_CONTRIBUTER_SECRET=your_secret
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   GEMINI_API_KEY=your_gemini_api_key
   ```

   **Client .env file:**
   ```
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ```

**IMPORTANT: Never commit `.env` files to version control as they contain sensitive information like API keys and secrets.**


## Deployment

### Local Development

1. Start the development server:
   ```bash
   npm run dev
   ```
   This will start both the backend server and the frontend development server concurrently.

2. The application will be available at:
   - Backend: http://localhost:5100
   - Frontend: http://localhost:5173

### Production Deployment

#### Building the Application

1. Create a production build of the client:
   ```bash
   cd client
   npm run build
   ```

2. Copy the build files to the public directory:
   ```bash
   rsync -a client/dist/ public/
   ```

#### Deploying on a VPS

1. Check running Node.js processes:
   ```bash
   ps aux | grep node
   ```

2. Identify running Node.js processes.

3. Terminate existing processes if necessary:
   ```bash
   sudo kill <process-id>
   ```

4. Clear log file:
   ```bash
   rm nohup.out
   ```

5. (Optional) Restart the server:
   ```bash
   reboot
   ```

6. Launch the Node.js server application in the background:
   ```bash
   nohup node server.js &
   ```

7. Start a preview server for the application on the host machine:
   ```bash
   nohup pnpm preview --host &
   ```

8. Exit terminals:
   ```bash
   exit
   ```

### Database Management

#### Checking MongoDB

1. Connect to MongoDB shell:
   ```bash
   mongosh
   ```

2. Show available databases:
   ```bash
   show dbs
   ```

3. Use a specific database or cluster:
   ```bash
   use <database-name>
   ```

#### Backing Up the Database

1. Create a database dump:
   ```bash
   mongodump --out "." --host localhost --port 27017
   ```

2. Make the backup script executable:
   ```bash
   chmod +x backup.sh
   ```

## Project Structure

```
SukoonSphere/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # Source files
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main application component
│   ├── .env.example        # Example environment variables for client
│   └── package.json        # Frontend dependencies
├── controllers/            # API route controllers
├── middleware/             # Express middleware
├── models/                 # Mongoose data models
├── routes/                 # API routes
├── utils/                  # Utility functions
├── .env.example            # Example environment variables for server
├── .gitignore              # Git ignore file
├── package.json            # Backend dependencies
└── server.js               # Express server entry point
```

## Key Components

### SukoonAI Chatbot

The SukoonAI chatbot is a key feature that provides users with supportive, evidence-based mental health advice. It uses the Gemini API to:
- Maintain context between user sessions
- Automatically respond when the user stops speaking
- Store conversations in the database
- Provide empathetic, evidence-based mental health advice
- Guide users toward self-discovery

### Gamification System

The platform includes a comprehensive gamification system to encourage user engagement:
- Leaderboards showing top users
- Achievement badges for completing activities
- Streak indicators for consistent site visits
- Progress tracking for videos watched and playlists completed
- Points system for various activities

### Media Features

- **Videos**: YouTube-integrated player with progress tracking, reactions, and comments
- **Playlists**: Support for multiple YouTube links with progress tracking
- **Articles**: Interactive content with rich typography and media

## Contributing

We welcome contributions to SukoonSphere! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All sensitive information is stored in environment variables
- JWT authentication is used for secure user sessions
- API keys and secrets are never exposed to the client
- Environment files (.env) are excluded from version control

## Project Objectives

1. **Increase Mental Health Awareness**: Provide accessible, engaging content that educates the public on mental health issues, treatments, and wellness practices.

2. **Create a Safe Space for Dialogue**: Facilitate open conversations between individuals affected by mental health issues and those seeking to understand them better, especially students.

3. **Facilitate Professional Connections**: Connect mental health experts with institutions and individuals in need of their services.

4. **Enhance Professional Skills**: Offer resources and training for current and aspiring mental health professionals.

5. **Reduce Mental Health Stigma**: Encourage open discussions, storytelling, and shared experiences to reduce the stigma associated with mental health.

---

© 2024 SukoonSphere. All rights reserved.