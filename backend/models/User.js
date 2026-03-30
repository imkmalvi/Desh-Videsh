import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    googleId: {
      type: String,
      default: null,
    },

    // ❌ REMOVE THIS if you're using separate favorites collection
    // favorites: Array,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);