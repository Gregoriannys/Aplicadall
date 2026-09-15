import { prisma } from "../db.js";

export const listarProductos = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al listar productos" });
    }
};

export const agregarProducto = async (req, res) => {
    try {
        const { nombre, precio, cantidad } = req.body;

        
        const existente = await prisma.producto.findFirst({
            where: { nombre: { equals: nombre, mode: "insensitive" } }
        });

        if (existente) {
            const actualizado = await prisma.producto.update({
                where: { id: existente.id },
                data: { cantidad: existente.cantidad + cantidad }
            });
            return res.json(actualizado);
        }

        const producto = await prisma.producto.create({
            data: { nombre, precio, cantidad }
        });
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto" });
    }
};

export const actualizarCantidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        const producto = await prisma.producto.findUnique({ where: { id: Number(id) } });
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        const actualizado = await prisma.producto.update({
            where: { id: Number(id) },
            data: { cantidad }
        });
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await prisma.producto.findUnique({ where: { id: Number(id) } });
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        await prisma.producto.delete({ where: { id: Number(id) } });
        res.json({ mensaje: "Eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
};