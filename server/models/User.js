import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    phoneNumber: { type: Number, min: 9, max: 9 },
    companies: Array,
    role: {
      type: String,
      role: ["user", "admin", "superadmin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
