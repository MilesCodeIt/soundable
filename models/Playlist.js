import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  /** string[] of people ID. */
  owners: {
    type: [String],
    default: []
  }
});

export default mongoose.models.PlaylistSchema || mongoose.model("Playlist", PlaylistSchema);