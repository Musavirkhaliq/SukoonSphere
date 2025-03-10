import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http"; // Import http for Socket.IO
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import cors from "cors";
import { Server } from "socket.io"; // Import Socket.IO

// Routers
import AuthRouter from "./routes/authRouter.js";
import PostRouter from "./routes/postRouter.js";
import UserRouter from "./routes/userRouter.js";
import QaSectionRouter from "./routes/qaRouter.js";
import ArticleRouter from "./routes/articleRouter.js";
import VideoRouter from "./routes/videoRouter.js";
import PodcastRouter from "./routes/podcastRouter.js";
import GalleryRouter from "./routes/galleryRouter.js";
import NotificationRouter from "./routes/notificationRouter.js"; 
import MessageRouter from "./routes/messageRouter.js";
import ChatRouter from "./routes/chatRouter.js";
import PrescriptionRouter from "./routes/prescriptionRouter.js";

// models
import Notification from "./models/notifications/postNotificationModel.js";

// Public
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Middleware
import errorHandlerMiddleware from "./middleware/errorhandlerMiddleware.js";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Initialize Express App
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app); // Create server instance
const io = new Server(server, {
  cors: {
    origin: "https://www.sukoonsphere.org", // Allow your front-end origin
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials if needed
  },
});

// Middleware Setup
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({
  origin: "https://www.sukoonsphere.org",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  pingInterval: 25000, // Send ping every 25s
  pingTimeout: 60000,  // Disconnect if no response in 60s

}));

// API Routes
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/qa-section", QaSectionRouter);
app.use("/api/v1/articles", ArticleRouter);
app.use("/api/v1/gallery", GalleryRouter);
app.use("/api/v1/videos", VideoRouter);
app.use("/api/v1/podcasts", PodcastRouter);
app.use("/api/v1/notifications", NotificationRouter); 
app.use("/api/v1/messages", MessageRouter);
app.use("/api/v1/chats", ChatRouter);
app.use("/api/v1/prescriptions", PrescriptionRouter);

// Serve Static Files
app.use("/public", express.static(path.resolve(__dirname, "./public")));

// Fallback Route
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

// Not Found Handler
app.use("*", (req, res) => {
  res.status(404).json({ msg: "route not found " });
});

// Error Handling Middleware
app.use(errorHandlerMiddleware);

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room based on user ID
  socket.on('join', async (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);

  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});

// Start Server
const PORT = process.env.PORT || 5100; // Default to 5100 if PORT is not set
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
})();

export { io }; // Export the io instance for use in controllers