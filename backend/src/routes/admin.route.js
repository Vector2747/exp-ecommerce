import { Router } from "express";
import { createProduct} from "../controlleurs/admin.controller.js";
import { getAllProducts } from "../controlleurs/admin.controller.js";
import { updateProduct } from "../controlleurs/admin.controller.js";
import { protectRoute } from "../dingleware/auth.dingleware.js";
import { adminOnly } from "../dingleware/auth.dingleware.js";
import { upload } from "../dingleware/multer.dingleware.js";
import { getAllOrders } from "../controlleurs/admin.controller.js";
import { updateOrderStatus } from "../controlleurs/admin.controller.js";
import { getAllClients } from "../controlleurs/admin.controller.js";
import { getDashboardStatus } from "../controlleurs/admin.controller.js";

const router = Router();

// optimisation : c'est juste pour pas reecrire protectRoute, adminOnly a chaque fois
router.use(protectRoute, adminOnly);

router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("images", 3), updateProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

router.get("/clients", getAllClients);
router.get("/status", getDashboardStatus);

// put: update tout 
// patch: update qu'un seul chose ou une partie de la ressource, c'est plus flexible que put

export default router