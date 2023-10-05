import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: String,
  reference: String,
  tipe: String,
});

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  password: String,
  cart: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
      },
    ],
    default: [],
  },
  img: String,
  role: {
    type: String,
    default: "user",
  },
  documents: [documentSchema],
  last_connection: {
    type: Date,
    default: Date.now,
  },
});

export const userModel = mongoose.model("users", userSchema);
