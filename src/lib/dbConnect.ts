import mongoose from "mongoose";

export async function dbConnect() {
  try {
    // Correctly call mongoose.connect with parentheses
    const con = await mongoose.connect(
      process.env.MONGO_DB_CONNECTION_STRING as string
    );
    return con;
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
}
