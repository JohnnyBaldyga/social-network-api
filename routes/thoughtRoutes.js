const express = require("express");
const Thought = require("./models/thought");
const User = require("./models/user");

const router = express.Router();

// POST /api/thoughts
router.post("/", async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    // Add thought _id to the user's thoughts array
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: thought._id },
    });
    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/thoughts/:thoughtId
router.put("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/thoughts/:thoughtId
router.delete("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    await User.findByIdAndUpdate(thought.userId, {
      $pull: { thoughts: thought._id },
    });
    res.json({ message: "Thought deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
