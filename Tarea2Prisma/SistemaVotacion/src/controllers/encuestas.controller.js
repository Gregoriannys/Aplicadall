import { prisma } from "../db.js";

export const crearEncuesta = async (req, res) => {
    try {
        const { pregunta, opciones } = req.body;
        
       
        const encuesta = await prisma.encuesta.create({
            data: {
                pregunta,
                opciones: opciones.map(op => ({ texto: op, votos: 0 }))
            }
        });
        res.status(201).json(encuesta);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la encuesta" });
    }
};

export const listarEncuestas = async (req, res) => {
    try {
        const encuestas = await prisma.encuesta.findMany();
        res.json(encuestas);
    } catch (error) {
        res.status(500).json({ error: "Error al listar encuestas" });
    }
};

export const votar = async (req, res) => {
    try {
        const { id } = req.params;
        const { opcion } = req.body;

        const encuesta = await prisma.encuesta.findUnique({ where: { id: Number(id) } });
        if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });

        if (!opcion) {
            return res.status(400).json({ error: "La opcion es un campo requerido" });
        }

        
        const opcionEncontrada = encuesta.opciones.find(op => op.texto === opcion);
        if (!opcionEncontrada) {
            return res.status(400).json({ error: "Esa opcion no existe en la encuesta" });
        }

       
        const opcionesActualizadas = encuesta.opciones.map(op =>
            op.texto === opcion ? { ...op, votos: op.votos + 1 } : op
        );

        const actualizada = await prisma.encuesta.update({
            where: { id: Number(id) },
            data: { opciones: opcionesActualizadas }
        });

        res.json(actualizada);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el voto" });
    }
};

export const obtenerResultados = async (req, res) => {
    try {
        const { id } = req.params;
        const encuesta = await prisma.encuesta.findUnique({ where: { id: Number(id) } });
        if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });

        
        const totalVotos = encuesta.opciones.reduce((acc, op) => acc + op.votos, 0);
        const resultados = encuesta.opciones.map(op => ({
            texto: op.texto,
            votos: op.votos,
            porcentaje: totalVotos === 0 ? 0 : Number(((op.votos / totalVotos) * 100).toFixed(2))
        }));

        let ganador = null;
        if (totalVotos > 0) {
            ganador = resultados.reduce((max, op) => (op.votos > max.votos ? op : max), resultados[0]);
        }

        res.json({ pregunta: encuesta.pregunta, totalVotos, resultados, ganador });
    } catch (error) {
        res.status(500).json({ error: "Error al calcular resultados" });
    }
};

export const eliminarEncuesta = async (req, res) => {
    try {
        const { id } = req.params;
        const encuesta = await prisma.encuesta.findUnique({ where: { id: Number(id) } });
        if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });

        await prisma.encuesta.delete({ where: { id: Number(id) } });
        res.json({ mensaje: "Eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la encuesta" });
    }
};