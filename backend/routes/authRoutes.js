const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate token for auto-login
    const token = jwt.sign({ id: user._id }, "secret");

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  let user = await User.findOne({ email: identifier });

  // Auto-create demo accounts if they don't exist
  const demoAccounts = ["admin@demo.com", "employee@demo.com", "superadmin@demo.com"];
  if (!user && demoAccounts.includes(identifier)) {
    const hashedPassword = await bcrypt.hash(password, 10);
    let name = "Demo User";
    if (identifier.includes("admin")) name = "Admin Demo";
    if (identifier.includes("employee")) name = "Employee Demo";
    if (identifier.includes("superadmin")) name = "Superadmin Demo";
    
    user = new User({
      name,
      email: identifier,
      password: hashedPassword,
    });
    await user.save();
  }

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ id: user._id }, "secret");

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = router;