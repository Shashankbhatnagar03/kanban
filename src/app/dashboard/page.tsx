"use client";

import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();

  if (session) {
    console.log("User ID:", session.user._id); // Access user ID from session
  }

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Dashboard;
