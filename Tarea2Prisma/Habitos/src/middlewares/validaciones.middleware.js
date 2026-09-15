export const validarHabito = (req, res, next) => {
    const { nombre, meta } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: "El nombre es un campo requerido" });
    }
    if (!meta) {
        return res.status(400).json({ error: "La meta es un campo requerido" });
    }
    next();
};