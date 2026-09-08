const express = require('express');
const app = express();
app.use(express.json());
app.listen(3000, () => console.log("Servidor en el puerto 3000"))

app.use((req,res,next) =>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next();
})

const validarEncuesta = (req,res,next) =>{
    const {pregunta,opciones} = req.body;
    if(!pregunta)
    {
        return res.status(400).json({error:"La pregunta es un campo requerido"});
    }
    if(!Array.isArray(opciones) || opciones.length < 2)
    {
        return res.status(400).json({error:"Se requieren al menos 2 opciones"});
    }
    next();
}

let encuestas = [
    {
        id: 1,
        pregunta:"Cual materia te ha gustado mas?",
        opciones:[
            {texto:"Programacion 3",votos:0},
            {texto:"Aplicada l",votos:0}
        ]
    }
];
let nextId = 2;

app.post('/encuestas',validarEncuesta,(req,res) =>{
    const {pregunta,opciones} = req.body;
    const encuesta = {
        id:nextId++,
        pregunta,
        opciones:opciones.map(op=>({texto:op,votos:0}))
    };
    encuestas.push(encuesta);
    res.status(201).json(encuesta);
})

app.get('/encuestas',(req,res)=>{
    res.json(encuestas);
})

app.post('/encuestas/:id/votar',(req,res)=>{
    const encuesta = encuestas.find(e=>e.id === parseInt(req.params.id));
    if(!encuesta) return res.status(404).json({error:"Encuesta no encontrada"});
    const {opcion} = req.body;
    if(!opcion)
    {
        return res.status(400).json({error:"La opcion es un campo requerido"});
    }
    const opcionEncontrada = encuesta.opciones.find(op=>op.texto===opcion);
    if(!opcionEncontrada)
    {
        return res.status(400).json({error:"Esa opcion no existe en la encuesta"});
    }
    opcionEncontrada.votos++;
    res.json(encuesta);
})

app.get('/encuestas/:id/resultados',(req,res)=>{
    const encuesta = encuestas.find(e=>e.id === parseInt(req.params.id));
    if(!encuesta) return res.status(404).json({error:"Encuesta no encontrada"});
    const totalVotos = encuesta.opciones.reduce((acc,op)=>acc + op.votos,0);
    const resultados = encuesta.opciones.map(op=>({
        texto:op.texto,
        votos:op.votos,
        porcentaje: totalVotos===0 ? 0 : Number(((op.votos/totalVotos)*100).toFixed(2))
    }));
    let ganador = null;
    if(totalVotos>0)
    {
        ganador = resultados.reduce((max,op)=> op.votos>max.votos ? op : max, resultados[0]);
    }
    res.json({pregunta:encuesta.pregunta,totalVotos,resultados,ganador});
})

app.delete('/encuestas/:id',(req,res) =>{
    const index = encuestas.findIndex(e=> e.id===parseInt(req.params.id))
    if(index===-1) return res.status(404).json({error:"Encuesta no encontrada"});
    encuestas.splice(index,1);
    res.json({mensaje:"Eliminada"});
})

