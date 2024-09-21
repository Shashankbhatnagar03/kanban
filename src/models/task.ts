import { model, models, Schema, Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: "ToDo" | "In_Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: Date;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema: Schema = new Schema<ITask>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["ToDo", "In_Progress", "Completed"],
      default: "ToDo",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

// const Task = model<ITask>("Task", taskSchema);

export default models.Task || model("Task", taskSchema);
// export default Task;
