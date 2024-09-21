"use client";

import React, { useEffect, useState } from "react";
import { DropResult, DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import { ITask } from "@/models/task";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import Modal from "./ui/Modal";

export const Board = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isCreate, setIsCreate] = useState(false);

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/task");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(); // Call the fetch function
  }, []);

  const createTask = async (formData: FormData) => {
    try {
      const jsonData = Object.fromEntries(formData);
      jsonData.status = "ToDo"; // Set default status to "ToDo"

      // Make the API call to create the task
      const response = await axios.post("/api/task", jsonData);

      // Immediately add the new task returned from the server to local state
      setTasks((prevTasks) => [...prevTasks, response.data]);

      setIsCreate(false); // Close modal after creation
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete("/api/task", { data: { id } });
      // Remove the task from the local state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const draggedTask = tasks.find((task) => task._id === draggableId);

    let updatedStatus: "ToDo" | "In_Progress" | "Completed";

    switch (destination.droppableId) {
      case "todo":
        updatedStatus = "ToDo";
        break;
      case "in-progress":
        updatedStatus = "In_Progress";
        break;
      case "completed":
        updatedStatus = "Completed";
        break;
      default:
        updatedStatus = draggedTask!.status; // Fallback to current status
    }

    if (draggedTask === undefined) return;

    try {
      await axios.put("/api/task", {
        id: draggableId,
        title: draggedTask.title,
        description: draggedTask.description,
        status: updatedStatus,
        priority: draggedTask.priority,
        dueDate: draggedTask.dueDate,
      });

      const updatedTasks = tasks.map((task) => {
        if (task._id === draggableId) {
          return { ...task, status: updatedStatus };
        }
        return task;
      });

      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const openModal = () => setIsCreate(true);
  const closeModal = () => setIsCreate(false);

  return (
    <div className="py-10 relative-h-screen">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid md:grid-cols-3 max-md:items-center w-[90%] max-w-[1500px] mx-auto md:gap-5 gap-10">
          <button
            onClick={openModal}
            className="rounded-full hover:bg-red-200 text-black font-bold p-4 absolute right-10 bottom-10"
          >
            <FaPlus />
          </button>
          {isCreate && (
            <Modal
              closeModal={closeModal}
              title="Create Task"
              isCreate={isCreate}
              action={createTask}
              value={""} // Adjust as needed
            />
          )}

          <Column
            title="To Do"
            tasks={tasks.filter((task) => task.status === "ToDo")}
            droppableId="todo"
            onDelete={deleteTask}
          />
          <Column
            title="In Progress"
            tasks={tasks.filter((task) => task.status === "In_Progress")}
            droppableId="in-progress"
            onDelete={deleteTask}
          />
          <Column
            title="Completed"
            tasks={tasks.filter((task) => task.status === "Completed")}
            droppableId="completed"
            onDelete={deleteTask}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
