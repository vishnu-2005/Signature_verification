//routes/auth.js
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const Accountant = require("../models/Accountant");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const isValid = filetypes.test(path.extname(file.originalname).toLowerCase()) && filetypes.test(file.mimetype);
    cb(null, isValid ? true : new Error("Error: Only images are allowed!"));
  },
});

// Accountant Sign-In
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const accountant = await Accountant.findOne({ username });

  if (!accountant || !(await bcrypt.compare(password, accountant.passwordHash))) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  res.json({ token, username: accountant.username });
});

router.post("/verify-unique-id", async (req, res) => {
  const { uniqueId } = req.body;

  try {
    const user = await User.findOne({ uniqueId });

    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(404).json({ exists: false, message: "User with this unique ID does not exist." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/upload-verification", verifyToken, upload.single("signature"), async (req, res) => {
  const { uniqueId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const user = await User.findOne({ uniqueId });

  if (!user || !user.originalSignature) {
    return res.status(404).json({ message: "Original signature not found for this ID." });
  }

  try {
    // Upload the verification signature to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "verifications", resource_type: "image" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.end(req.file.buffer);
    });

    // Call the Flask API for verification
    const flaskResponse = await axios.post("http://localhost:5001/verify-signature", {
      uploaded_signature_path: uploadResult.secure_url,
      original_signature_path: user.originalSignature,
    });

    const { result, similarity_score } = flaskResponse.data;

    // Delete the uploaded verification signature from Cloudinary
    await cloudinary.uploader.destroy(uploadResult.public_id);

    res.json({
      message: "Verification successful.",
      confidence: similarity_score,
      result: result,
    });
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).json({ message: "Verification failed.", error: error.message });
  }
});

module.exports = router;
