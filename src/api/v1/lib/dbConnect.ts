import mongoose from "mongoose";

function mongodbConnection() {
  // Connect to MongoDB
  mongoose
    .connect("mongodb://localhost/mydatabase")
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}
export default mongodbConnection;
