import { dbConnect } from "@/lib/dbConnect";
import Task from "@/models/task";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await Task.find({ user: session.user._id });

  //   console.log(tasks);
  return NextResponse.json(tasks, { status: 200 });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, status, priority, dueDate } = await req.json();

  // Input validation
  if (!title || !status || !priority) {
    return NextResponse.json(
      { error: "Title, status, and priority are required." },
      { status: 400 }
    );
  }

  try {
    const newTask = new Task({
      title,
      description,
      status: status || "ToDo", // Default to "ToDo" if not provided
      priority: priority || "Low", // Default to 1 if not provided
      dueDate,
      user: session.user._id,
    });

    const task = await newTask.save();

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (err) {
    console.error("Error while creating task:", err); // Log the error for debugging
    // @ts-ignore
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, description, status, priority, dueDate } =
    await req.json();

  // Input validation
  if (!id || !title || !status || !priority) {
    return NextResponse.json(
      { error: "ID, title, status, and priority are required." },
      { status: 400 }
    );
  }

  try {
    const task = await Task.findOne({ _id: id, user: session.user._id });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update fields only if they are provided
    task.title = title;
    task.description = description || task.description; // Keep existing value if not provided
    task.status = status;
    task.priority = priority;
    task.dueDate = dueDate || task.dueDate; // Keep existing value if not provided

    await task.save();

    return NextResponse.json({ success: true, task }, { status: 200 });
  } catch (err) {
    console.error("Error updating task:", err); // Log detailed error
    // @ts-ignore
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  try {
    const task = await Task.findOneAndDelete({
      _id: id,
      user: session.user._id,
    });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (err) {
    // @ts-ignore
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
