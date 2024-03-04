import mongoose from "mongoose";

function mongodbConnection() {
  // Connect to MongoDB
  const { MONGODB_CONNECTION } = process.env;
  const options = {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
  };

  mongoose
    .connect(MONGODB_CONNECTION as string,options)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}
export default mongodbConnection;
