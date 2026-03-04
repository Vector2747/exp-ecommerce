import { Router } from "express";
import { protectRoute } from "../dingleware/auth.dingleware.js";
import { createPaymentIntent } from "../controlleurs/payment.controlleur.js";

const router = Router();

router.use(protectRoute)

router.post("/create-intent", createPaymentIntent)