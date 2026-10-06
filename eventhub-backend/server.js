require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

app.get("/", (req, res) => {
  res.send("Backend chal raha hai!");
});

// Events ni API ahi jodi chhe
app.use("/api/events", require("./routes/eventRoutes"));

app.use("/api/bookings", require("./routes/bookingRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server chal raha hai on port " + PORT);
});
