import mongoose from "mongoose";

function mongodbConnection() {
  // Connect to MongoDB
  const { MONGODB_CONNECTION } = process.env;

  mongoose
    .connect(MONGODB_CONNECTION as string)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}
export default mongodbConnection;
