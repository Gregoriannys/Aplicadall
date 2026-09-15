export const validarEncuesta = (req, res, next) => {
    const { pregunta, opciones } = req.body;
    if (!pregunta) {
        return res.status(400).json({ error: "La pregunta es un campo requerido" });
    }
    if (!Array.isArray(opciones) || opciones.length < 2) {
        return res.status(400).json({ error: "Se requieren al menos 2 opciones" });
    }
    next();
};