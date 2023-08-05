import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  role: {
    type: String,
    enum: ["admin", "usuario"],
    default: "usuario",
  },
  githubId: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
});

const userModel = mongoose.model("sessions", userSchema);

export default userModel;