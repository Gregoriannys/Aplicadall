import { Router } from "express";
import {
    crearHabito,
    listarHabitos,
    registrarHabito,
    obtenerEstadisticas,
    eliminarHabito
} from "../controllers/habitos.controller.js";
import { validarHabito } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.post("/", validarHabito, crearHabito);
router.get("/", listarHabitos);
router.post("/:id/registrar", registrarHabito);
router.get("/:id/estadisticas", obtenerEstadisticas);
router.delete("/:id", eliminarHabito);

export default router;