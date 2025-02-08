// backend/index.js
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const { app, server, io } = require("./config/server");
const ChatController = require("./controllers/chatController");
const chatRoutes = require("./routes/chatRoutes");

// Mount REST routes (optional)
app.use("/api/chat", chatRoutes);

// Setup WebSocket connection handling
io.on("connection", (socket) => {
  // Handle peer matching and connection
  ChatController.handleConnection(socket, io);

  // Listen for chat messages from the client
  socket.on("chatMessage", (data) => {
    ChatController.handleChatMessage(socket, io, data);
  });

  // Optionally, handle additional events (for example, WebRTC signaling)
  socket.on("signal", (data) => {
    const { target, signal } = data;
    io.to(target).emit("signal", { signal, from: socket.id });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
