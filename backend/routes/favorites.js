import express from "express";
import Favorite from "../models/Favorite.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Add favorite
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { city, country, region } = req.body;

    const existing = await Favorite.findOne({
      userId: req.user.id,
      city,
    });

    if (existing) {
      return res.status(200).json(existing); // no crash
    }

    const fav = await Favorite.create({
      userId: req.user.id,
      city,
      country,
      region,
    });

    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;