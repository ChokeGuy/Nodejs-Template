import app from "./app";

// Start the server
const port = process.env.PORT;
app.listen(port || 3000, () => {
  console.log(`Server is running on port ${port || 3000}`);
});
