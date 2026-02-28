import { Router } from "express";
import { addAddress } from "../controlleurs/user.controlleur.js";
import { protectRoute } from "../dingleware/auth.dingleware.js";
import { getAddresses } from "../controlleurs/user.controlleur.js";
import { updateAddress } from "../controlleurs/user.controlleur.js";
import { deleteAddress } from "../controlleurs/user.controlleur.js";
import { addToWishlist } from "../controlleurs/user.controlleur.js";
import { getWishlist } from "../controlleurs/user.controlleur.js";
import { deleteWishlist } from "../controlleurs/user.controlleur.js";

const router = Router();

router.use(protectRoute)

// les routes d'addresses
router.post("/addresses", addAddress);
router.get("/addresses", getAddresses);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

// les routes de wishlist

router.post("/wishlist", addToWishlist);
router.get("/wishlist", getWishlist);
router.delete("/wishlist/:productId", deleteWishlist);

export default router;