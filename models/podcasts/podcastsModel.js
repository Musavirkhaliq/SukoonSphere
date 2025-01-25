import mongoose from "mongoose";
const PodcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    episodeNo:{
      type: Number,
    },
    type: {
      type: String,
      enum: ['single', 'playlist'],
      default: 'single'
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Podcast", PodcastSchema);

const podcastPlaylistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  episodes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Podcast',
      required: true,
    },
  ],
},
{
  timestamps: true,   
}
);
export const PodcastPlaylist = mongoose.model("PodcastPlaylist", podcastPlaylistSchema);