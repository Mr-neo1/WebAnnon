// testSocket.js
const io = require("socket.io-client");
const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("Socket.IO connected with id:", socket.id);
});

socket.on("match", (data) => {
  console.log("Matched with peer:", data);
  // Wait a few seconds after matching, then send a chat message.
  setTimeout(() => {
    console.log("Sending chat message...");
    socket.emit("chatMessage", { message: "Hello, peer! How are you?" });
  }, 3000); // Adjust the delay as needed
});

socket.on("chatMessage", (data) => {
  console.log("Received chat message:", data);
});

socket.on("message", (data) => {
  console.log("Received message:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
