const express = require("express");
const router = express.Router();
const User = require("../models/User");

// signup
router.post("/signup", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    res.json(user);

  } catch (error) {

    res.status(500).json(error);

  }

});

// login
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json("Invalid credentials");
    }

    res.json(user);

  } catch (error) {

    res.status(500).json(error);

  }

});

module.exports = router;
