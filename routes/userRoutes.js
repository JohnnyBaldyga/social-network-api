const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Thought = require("./models/thought");

const app = express();
app.use(express.json());

// API route
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().populate("thoughts").populate("friends");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// PUT /api/users/:userId
app.put("/api/users/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// DELETE /api/users/:userId
app.delete("/api/users/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Optionally, delete associated thoughts here
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
mongoose.connect(
  "mongodb://localhost/social-network-api",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  }
);
