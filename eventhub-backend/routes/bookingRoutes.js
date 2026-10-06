const router = require("express").Router();

const Booking = require("../models/Booking");

// =========================
// GET ALL BOOKINGS
// =========================
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);

    res.status(500).json({
      message: "Failed to get bookings",
    });
  }
});

// =========================
// GET BOOKINGS BY USER EMAIL
// =========================
router.get("/user/:email", async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerEmail: req.params.email,
    }).sort({
      createdAt: -1,
    });

    res.json(bookings);
  } catch (err) {
    console.error("Get user bookings error:", err);

    res.status(500).json({
      message: "Failed to get user bookings",
    });
  }
});

// =========================
// GET BOOKING BY BOOKING ID
// =========================
// Example:
// /api/bookings/booking-id/BK1759741234567
router.get("/booking-id/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (err) {
    console.error("Get booking by bookingId error:", err);

    res.status(500).json({
      message: "Failed to get booking",
    });
  }
});

// =========================
// GET SINGLE BOOKING BY MONGODB _id
// =========================
// Example:
// /api/bookings/68e3xxxxxxxx
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (err) {
    console.error("Get booking error:", err);

    res.status(400).json({
      message: "Invalid booking ID",
    });
  }
});

// =========================
// CREATE BOOKING
// =========================
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});

// =========================
// UPDATE BOOKING
// =========================
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (err) {
    console.error("Update booking error:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});

// =========================
// DELETE BOOKING
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (err) {
    console.error("Delete booking error:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
