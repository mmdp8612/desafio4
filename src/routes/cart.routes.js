import { Router } from "express";
import {
    createCart,
    getProductsCart,
    addProductCart
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", createCart);
router.get("/:cid", getProductsCart);
router.post("/:cid/:pid", addProductCart)

export default router;