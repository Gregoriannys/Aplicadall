import { prisma } from "../db.js";

export const calcularTotal = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();
        const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: "Error al calcular el total" });
    }
};

export const aplicarDescuento = async (req, res) => {
    try {
        const { porcentaje } = req.body;
        const productos = await prisma.producto.findMany();
        const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
        const totalConDescuento = total - total * (porcentaje / 100);
        res.json({ totalOriginal: total, totalConDescuento });
    } catch (error) {
        res.status(500).json({ error: "Error al aplicar el descuento" });
    }
};