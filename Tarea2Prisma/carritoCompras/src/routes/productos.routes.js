import { Router } from "express";
import {
    listarProductos,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto
} from "../controllers/productos.controller.js";
import { validarProducto, validarCantidad } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/", listarProductos);
router.post("/", validarProducto, agregarProducto);
router.put("/:id", validarCantidad, actualizarCantidad);
router.delete("/:id", eliminarProducto);

export default router;











