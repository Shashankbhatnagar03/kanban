"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./ui/Modal";
import { FaPlus } from "react-icons/fa";

// Define the Task interface
interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High"; // Define possible priority values
  status: "ToDo" | "In_Progress" | "Completed"; // Define possible status values
}

const List: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Specify the type for tasks
  const [sortOrder, setSortOrder] = useState<"low" | "medium" | "high">("low"); // Specify sort order type
  const [isCreate, setIsCreate] = useState(false);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/task");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(); // Fetch tasks when the component mounts
  }, []);

  // Function to sort tasks based on priority
  // Function to sort tasks based on priority
  const sortedTasks = (taskList: Task[]) => {
    const priorityOrder = { Low: 1, Medium: 2, High: 3 };

    // Sort based on selected sortOrder
    return [...taskList].sort((a, b) => {
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];

      // Adjust sorting based on sortOrder state
      if (sortOrder === "low") {
        return aPriority - bPriority;
      } else if (sortOrder === "medium") {
        return bPriority - aPriority; // Reverse order for medium
      } else {
        return bPriority - aPriority; // Reverse order for high
      }
    });
  };

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === "ToDo");
  const inProgressTasks = tasks.filter((task) => task.status === "In_Progress");
  const completedTasks = tasks.filter((task) => task.status === "Completed");
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

  // Handle task deletion
  const deleteTask = async (id: string) => {
    // Specify id type as string
    try {
      await axios.delete("/api/task", { data: { id } });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const openModal = () => setIsCreate(true);
  const closeModal = () => setIsCreate(false);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
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
          // @ts-ignore
          value={""} // Adjust as needed
        />
      )}

      <div className="mb-4">
        <label htmlFor="sort" className="mr-2">
          Sort by Priority:
        </label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "low" | "medium" | "high")
          }
          className="border rounded p-1"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* To Do Column */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">To Do</h3>
          <ul className="list-disc pl-5">
            {sortedTasks(todoTasks).map((task) => (
              <li
                key={task._id}
                className="mb-2 flex justify-between items-center"
              >
                <div>
                  <span className="font-semibold">{task.title}</span> -
                  <span
                    className={`ml-2 ${
                      task.priority === "High"
                        ? "text-red-500"
                        : task.priority === "Medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* In Progress Column */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">In Progress</h3>
          <ul className="list-disc pl-5">
            {sortedTasks(inProgressTasks).map((task) => (
              <li
                key={task._id}
                className="mb-2 flex justify-between items-center"
              >
                <div>
                  <span className="font-semibold">{task.title}</span> -
                  <span
                    className={`ml-2 ${
                      task.priority === "High"
                        ? "text-red-500"
                        : task.priority === "Medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Completed Column */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Completed</h3>
          <ul className="list-disc pl-5">
            {sortedTasks(completedTasks).map((task) => (
              <li
                key={task._id}
                className="mb-2 flex justify-between items-center"
              >
                <div>
                  <span className="font-semibold">{task.title}</span> -
                  <span
                    className={`ml-2 ${
                      task.priority === "High"
                        ? "text-red-500"
                        : task.priority === "Medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default List;
