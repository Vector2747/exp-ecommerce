import { Router } from "express";
import { protectRoute } from "../dingleware/auth.dingleware.js";
import { createOrder } from "../controlleurs/order.controlleur.js";
import { getOrders } from "../controlleurs/order.controlleur.js";

const router = Router();

router.use(protectRoute);

// donc une route pour creer et une autre pour recuperer les commandes d'un user
router.post("/", createOrder);
router.get("/", getOrders);

export default router;