import app from "./app";

// Start the server
const { port } = process.env;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
