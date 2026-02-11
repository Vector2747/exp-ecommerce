import { Router } from "express";
import { protectRoute } from "../dingleware/auth.dingleware.js";
import { createReview } from "../controlleurs/review.controlleur.js";
import { deleteReview } from "../controlleurs/review.controlleur.js";

const router = Router();

router.use(protectRoute);

// les routes de produits

router.post("/", createReview);
router.delete("/:reviewId", deleteReview);// en vrai on le fait pas

export default router;