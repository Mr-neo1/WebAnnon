// backend/models/peerModel.js
const mongoose = require("mongoose");

const waitingPeerSchema = new mongoose.Schema({
  socketId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create an index on createdAt for FIFO retrieval
waitingPeerSchema.index({ createdAt: 1 });

const WaitingPeer = mongoose.model("WaitingPeer", waitingPeerSchema);

module.exports = {
  addPeer: async (socketId) => {
    const peer = new WaitingPeer({ socketId });
    await peer.save();
  },
  popPeer: async () => {
    // Find and remove the earliest added waiting peer (FIFO)
    const peer = await WaitingPeer.findOneAndDelete({}, { sort: { createdAt: 1 } });
    return peer ? peer.socketId : null;
  },
  removePeer: async (socketId) => {
    await WaitingPeer.deleteMany({ socketId });
  },
};
