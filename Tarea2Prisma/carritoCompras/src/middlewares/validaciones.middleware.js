export const validarProducto = (req, res, next) => {
    const { nombre, precio, cantidad } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: "El nombre es un campo requerido" });
    }
    if (precio === undefined || typeof precio !== "number" || precio <= 0) {
        return res.status(400).json({ error: "El precio debe ser un numero positivo" });
    }
    if (cantidad === undefined || typeof cantidad !== "number" || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un numero positivo" });
    }
    next();
};

export const validarCantidad = (req, res, next) => {
    const { cantidad } = req.body;
    if (cantidad === undefined || typeof cantidad !== "number" || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un numero positivo" });
    }
    next();
};

export const validarDescuento = (req, res, next) => {
    const { porcentaje } = req.body;
    if (porcentaje === undefined || typeof porcentaje !== "number" || porcentaje <= 0) {
        return res.status(400).json({ error: "El porcentaje debe ser un numero positivo" });
    }
    if (porcentaje > 50) {
        return res.status(400).json({ error: "El descuento maximo permitido es 50%" });
    }
    next();
};