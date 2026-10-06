const router = require("express").Router();

const User = require("../models/User");

// =========================
// GET ALL USERS
// =========================
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);

    res.status(500).json({
      message: "Failed to get users",
    });
  }
});

// =========================
// GET USER BY EMAIL
// =========================
router.get("/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email.toLowerCase(),
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);

    res.status(500).json({
      message: "Failed to get user",
    });
  }
});

// =========================
// CREATE USER / SIGNUP
// =========================
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      password,
    });

    res.status(201).json({
      message: "User registered successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Create user error:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});

// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// =========================
// UPDATE USER PROFILE
// =========================
router.put("/:id", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        phone: phone || "",
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("Update user error:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});

// =========================
// DELETE USER
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete user error:", err);

    res.status(400).json({
      message: "Invalid user ID",
    });
  }
});

module.exports = router;
