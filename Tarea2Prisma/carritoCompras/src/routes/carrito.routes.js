import { Router } from "express";
import { calcularTotal, aplicarDescuento } from "../controllers/carrito.controller.js";
import { validarDescuento } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/total", calcularTotal);
router.post("/aplicar-descuento", validarDescuento, aplicarDescuento);

export default router;





