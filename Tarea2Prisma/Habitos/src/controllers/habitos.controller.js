import { prisma } from "../db.js";

const hoy = () => new Date().toISOString().split('T')[0];

export const crearHabito = async (req, res) => {
    try {
        const { nombre, meta } = req.body;
       
        const habito = await prisma.habito.create({
            data: { nombre, meta, registros: [] }
        });
        res.status(201).json(habito);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el habito" });
    }
};

export const listarHabitos = async (req, res) => {
    try {
        
        const habitos = await prisma.habito.findMany();
        res.json(habitos);
    } catch (error) {
        res.status(500).json({ error: "Error al listar los habitos" });
    }
};

export const registrarHabito = async (req, res) => {
    try {
        const { id } = req.params;

        
        const habito = await prisma.habito.findUnique({ where: { id: Number(id) } });
        if (!habito) return res.status(404).json({ error: "Habito no encontrado" });

        const fecha = hoy();
        
        const yaRegistrado = habito.registros.find(r => r.fecha === fecha);
        if (yaRegistrado) {
            return res.status(400).json({ error: "Ya se registro este habito hoy" });
        }

        
        const nuevosRegistros = [...habito.registros, { fecha, completado: true }];
        const actualizado = await prisma.habito.update({
            where: { id: Number(id) },
            data: { registros: nuevosRegistros }
        });

        res.status(201).json(actualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el habito" });
    }
};

export const obtenerEstadisticas = async (req, res) => {
    try {
        const { id } = req.params;

        const habito = await prisma.habito.findUnique({ where: { id: Number(id) } });
        if (!habito) return res.status(404).json({ error: "Habito no encontrado" });

        
        const fechas = habito.registros.map(r => r.fecha).sort();

        let rachaActual = 0;
        let mejorRacha = 0;
        let racha = 0;
        let anterior = null;

        for (const fecha of fechas) {
            if (anterior) {
                const diff = (new Date(fecha) - new Date(anterior)) / (1000 * 60 * 60 * 24);
                racha = diff === 1 ? racha + 1 : 1;
            } else {
                racha = 1;
            }
            if (racha > mejorRacha) mejorRacha = racha;
            anterior = fecha;
        }

        if (fechas.length > 0) {
            const ultima = fechas[fechas.length - 1];
            const diffHoy = (new Date(hoy()) - new Date(ultima)) / (1000 * 60 * 60 * 24);
            rachaActual = diffHoy <= 1 ? racha : 0;
        }

        const diasTotales = fechas.length > 0
            ? (new Date(hoy()) - new Date(fechas[0])) / (1000 * 60 * 60 * 24) + 1
            : 0;
        const porcentajeCumplimiento = diasTotales > 0
            ? Number(((fechas.length / diasTotales) * 100).toFixed(2))
            : 0;

        res.json({
            habito: habito.nombre,
            rachaActual,
            mejorRacha,
            porcentajeCumplimiento
        });
    } catch (error) {
        res.status(500).json({ error: "Error al calcular estadisticas" });
    }
};

export const eliminarHabito = async (req, res) => {
    try {
        const { id } = req.params;

        
        const habito = await prisma.habito.findUnique({ where: { id: Number(id) } });
        if (!habito) return res.status(404).json({ error: "Habito no encontrado" });

        await prisma.habito.delete({ where: { id: Number(id) } });
        res.json({ mensaje: "Eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el habito" });
    }
};