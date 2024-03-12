import mongoose, { Schema, Document } from "mongoose";
import Role from "../constants/Role";
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);
// Define the user schema
interface UserType extends Document {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address?: string;
  birthday: Date;
  avatar: string;
  role: Role; // Add the role property
}

const userSchema = new Schema<UserType>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // Make phoneNumber field unique
      match: /^(\+?84|0)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}$/,
    },
    address: { type: String, required: false },
    birthday: {
      type: Date,
      min: new Date("1927-09-28"),
      max: new Date(),
      required: true,
    },
    avatar: { type: String, default: "" }, // Add the avatar property
    role: { type: String, enum: Object.values(Role), required: true }, // Define the role property with enum validation
  },
  {
    timestamps: true,
  }
);

// Create and export the user model
const User = mongoose.model<UserType>("User", userSchema);
export default User;
