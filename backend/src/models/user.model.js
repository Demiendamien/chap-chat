import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

// isAdmin: { type: Boolean, default: false },
// coverPic: { type: String, default: "" },
// followers: { type: Array, default: [] },
// following: { type: Array, default: [] },
// savedPosts: { type: Array, default: [] },
// desc: { type: String, max: 50 },
// city: { type: String, max: 50 },
// from: { type: String, max: 50 },
