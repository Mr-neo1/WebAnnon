// backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Anonymous Chat WebSocket Server is Running");
});

module.exports = router;
