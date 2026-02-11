import { Router } from "express";
import { protectRoute } from "../dingleware/auth.dingleware.js";
import { getAllProducts } from "../controlleurs/admin.controller.js";
import { getProductById } from "../controlleurs/product.controller.js";

const router = Router();

router.use(protectRoute);

// les routes de produits

router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;