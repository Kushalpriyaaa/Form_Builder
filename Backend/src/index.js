const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");
const responseRoutes = require("./routes/responseRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

// Mount route groups
app.use("/api/auth", authRoutes);        // FIXED → login URL works
app.use("/api/forms", formRoutes);
app.use("/api/forms", responseRoutes);
app.use("/webhooks/airtable", webhookRoutes);

// Test
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
async function start() {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("No MongoDB URI provided.");
    } else {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ MongoDB Connected");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running at https://form-builder-2-flc8.onrender.com/`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
  }
}

start();
