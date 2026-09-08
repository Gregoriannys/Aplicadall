const express = require('express');
const app = express();
app.use(express.json());
app.listen(3000, () => console.log("Servidor en el puerto 3000"))

app.use((req,res,next) =>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next();
})

const validarTurno = (req,res,next) =>{
    const {cliente,servicio} = req.body;
    if(!cliente)
    {
        return res.status(400).json({error:"El cliente es un campo requerido"});
    }
    if(!servicio)
    {
        return res.status(400).json({error:"El servicio es un campo requerido"});
    }
    next();
}

let turnos = [
    {
        id: 1,
        cliente:"Graciela Hernandez",
        servicio:"Secado de pelo",
        estado:"esperando"
    }
];
let nextId = 2;

app.post('/turnos',validarTurno,(req,res) =>{
    const {cliente,servicio} = req.body;
    const turno = {id:nextId++,cliente,servicio,estado:"esperando"};
    turnos.push(turno);
    res.status(201).json(turno);
})

app.get('/turnos',(req,res)=>{
    res.json(turnos);
})

app.get('/turnos/siguiente',(req,res)=>{
    const siguiente = turnos.find(t=>t.estado==="esperando");
    if(!siguiente) return res.status(404).json({error:"No hay turnos en espera"});
    res.json(siguiente);
})

app.put('/turnos/llamar',(req,res)=>{
    const enAtencion = turnos.find(t=>t.estado==="atendiendo");
    if(enAtencion)
    {
        return res.status(400).json({error:"Ya hay un turno siendo atendido"});
    }
    const siguiente = turnos.find(t=>t.estado==="esperando");
    if(!siguiente)
    {
        return res.status(404).json({error:"No hay turnos en espera"});
    }
    siguiente.estado = "atendiendo";
    res.json(siguiente);
})

app.put('/turnos/:id/finalizar',(req,res)=>{
    const turno = turnos.find(t=>t.id === parseInt(req.params.id));
    if(!turno) return res.status(404).json({error:"Turno no encontrado"});
    if(turno.estado !== "atendiendo")
    {
        return res.status(400).json({error:"Solo se puede finalizar un turno que esta siendo atendido"});
    }
    turno.estado = "finalizado";
    res.json(turno);
})

app.get('/turnos/espera',(req,res)=>{
    const enEspera = turnos.filter(t=>t.estado==="esperando");
    res.json({total:enEspera.length});
})