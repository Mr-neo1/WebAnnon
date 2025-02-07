// backend/config/server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for testing; restrict in production
    methods: ["GET", "POST"],
  },
});

// Simple HTTP route for testing
app.get("/", (req, res) => {
  res.send("Anonymous Chat WebSocket Server is Running");
});

module.exports = { app, server, io };
