import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  playlists: {
    type: [String],
    default: []
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);