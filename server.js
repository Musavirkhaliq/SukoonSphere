import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import cors from "cors";

//routers
import AuthRouter from "./routes/authRouter.js";
import PostRouter from "./routes/postRouter.js";
import UserRouter from "./routes/userRouter.js";
import QaSectionRouter from "./routes/qaRouter.js";
import ArticleRouter from "./routes/articleRouter.js";
import VideoRouter from "./routes/videoRouter.js";
import PodcastRouter from "./routes/podcastRouter.js";
import GalleryRouter from "./routes/galleryRouter.js";

//public
import path, { dirname } from "path";
import { fileURLToPath } from "url";

//middleware
import errorHandlerMiddleware from "./middleware/errorhandlerMiddleware.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "devlopment") {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors(corsOptions));
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/qa-section", QaSectionRouter);
app.use("/api/v1/articles", ArticleRouter);
app.use("/api/v1/gallery", GalleryRouter);
app.use("/api/v1/videos", VideoRouter);
app.use("/api/v1/podcasts", PodcastRouter);


app.use("/public", express.static(path.resolve(__dirname, "./public")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});
//not founds
app.use("*", (req, res) => {
  res.status(404).json({ msg: "route not found " });
});

//err HANDLING  middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT;
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server listening on ${port}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

// mongoose.connect('mongodb://localhost:27017/sukoonsphere', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log('Connected to local MongoDB - sukoonsphere'))
//   .catch((err) => console.error('MongoDB connection error:', err));
