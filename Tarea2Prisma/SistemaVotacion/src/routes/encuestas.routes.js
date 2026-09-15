import { Router } from "express";
import {
    crearEncuesta,
    listarEncuestas,
    votar,
    obtenerResultados,
    eliminarEncuesta
} from "../controllers/encuestas.controller.js";
import { validarEncuesta } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.post("/", validarEncuesta, crearEncuesta);
router.get("/", listarEncuestas);
router.post("/:id/votar", votar);
router.get("/:id/resultados", obtenerResultados);
router.delete("/:id", eliminarEncuesta);

export default router;