// backend/controllers/chatController.js
const PeerModel = require("../models/peerModel");

// In-memory mapping for matched peers: key = socket.id, value = matched peer's socket id
const matchedPeers = new Map();

class ChatController {
  static async handleConnection(socket, io) {
    console.log(`User connected: ${socket.id}`);
    
    try {
      // Attempt to pop a waiting peer from the database
      const waitingPeerId = await PeerModel.popPeer();
      if (waitingPeerId && waitingPeerId !== socket.id) {
        // A match is found—store the mapping for message routing.
        matchedPeers.set(socket.id, waitingPeerId);
        matchedPeers.set(waitingPeerId, socket.id);
        
        // Notify both clients about the match.
        io.to(waitingPeerId).emit("match", { initiator: true, peerId: socket.id });
        socket.emit("match", { initiator: false, peerId: waitingPeerId });
      } else {
        // No waiting peer available—add this socket to the waiting list.
        await PeerModel.addPeer(socket.id);
        socket.emit("message", "Waiting for a peer to connect...");
      }
    } catch (error) {
      console.error("Error matching peers:", error);
      socket.emit("message", "An error occurred while searching for a peer.");
    }

    // On disconnect, remove this socket from waiting list and clear any matched mapping.
    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.id}`);
      await PeerModel.removePeer(socket.id);
      const peerId = matchedPeers.get(socket.id);
      if (peerId) {
        matchedPeers.delete(socket.id);
        matchedPeers.delete(peerId);
        io.to(peerId).emit("message", "Your peer has disconnected.");
      }
    });
  }

  static handleChatMessage(socket, io, data) {
    // Forward the chat message to the matched peer, if available.
    const targetSocketId = matchedPeers.get(socket.id);
    if (targetSocketId) {
      io.to(targetSocketId).emit("chatMessage", { message: data.message, from: socket.id });
    } else {
      socket.emit("message", "No matched peer found.");
    }
  }
}

module.exports = ChatController;
