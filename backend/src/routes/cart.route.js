import { Router } from "express";
import { protectRoute } from "../dingleware/auth.dingleware.js";
import { getCart } from "../controlleurs/cart.controlleur.js";
import { addToCart } from "../controlleurs/cart.controlleur.js";
import { updateCartItem } from "../controlleurs/cart.controlleur.js";
import { removeFromCart } from "../controlleurs/cart.controlleur.js";
import { clearCart } from "../controlleurs/cart.controlleur.js";

const router = Router();

router.use(protectRoute);

// les routes de cart

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeFromCart);
router.delete("/", clearCart);


export default router;