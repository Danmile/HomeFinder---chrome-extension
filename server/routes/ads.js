import express from "express";
import {
  submitAd,
  getAdsList,
  removeAd,
} from "../controllers/adsController.js";

const router = express.Router();

router.post("/submit", submitAd);
router.get("/ads", getAdsList);
router.delete("/remove", removeAd);

export default router;
