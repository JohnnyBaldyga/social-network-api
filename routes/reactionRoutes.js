const express = require("express");
const Thought = require("./models/thought");

const router = express.Router();

// POST /api/thoughts/:thoughtId/reactions
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    thought.reactions.push(req.body);
    await thought.save();
    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/thoughts/:thoughtId/reactions/:reactionId
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    thought.reactions.id(req.params.reactionId).remove();
    await thought.save();
    res.json({ message: "Reaction removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
