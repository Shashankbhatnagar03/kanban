import { Schema, model, models } from "mongoose";

export interface UserInterface {
  email: string;
  password: string;
  name: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserInterface>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: [true, "Fullname is required"],
      minLength: [3, "fullname must be at least 3 characters"],
      maxLength: [25, "fullname must be at most 25 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// export const User = model<UserInterface>("User", userSchema);

export default models.User || model("User", userSchema);
