"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import List from "./List";
import { Board } from "./Board";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [view, setView] = useState("kanban"); // Default view is Kanban
  // const [tasks, setTasks] = useState([]);
  // const { data: session } = useSession();
  const router = useRouter();
  const handleViewChange = (newView: string) => {
    setView(newView);
  };
  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/signin" });
    router.push(data.url);
  };

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       console.log("Fetching tasks..."); // Debugging log
  //       const response = await axios.get("/api/task");
  //       console.log("Fetched Tasks:", response.data); // Log fetched tasks
  //       setTasks(response.data);
  //     } catch (error) {
  //       console.error(
  //         "Error fetching tasks:",
  //         error.response ? error.response.data : error.message
  //       );
  //     }
  //   };

  //   if (session) {
  //     // Ensure session exists before fetching tasks
  //     fetchTasks(); // Fetch tasks when the component mounts
  //   }
  // }, [session]); // Dependency on session

  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <div className="flex space-x-4 mx-auto">
          <Button variant="outline" onClick={() => handleViewChange("kanban")}>
            Kanban View
          </Button>
          <Button variant="outline" onClick={() => handleViewChange("list")}>
            List View
          </Button>
        </div>
        <Button variant="destructive" onClick={handleSignOut}>
          Logout
        </Button>
      </nav>

      {/* Render the selected view */}
      <div>{view === "kanban" ? <Board /> : <List />}</div>
    </div>
  );
};

export default Navbar;
