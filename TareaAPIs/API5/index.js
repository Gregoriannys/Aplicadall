const express = require('express');
const app = express();
app.use(express.json());
app.listen(3000, () => console.log("Servidor en el puerto 3000"))

app.use((req,res,next) =>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next();
})

const validarHabito = (req,res,next) =>{
    const {nombre,meta} = req.body;
    if(!nombre)
    {
        return res.status(400).json({error:"El nombre es un campo requerido"});
    }
    if(!meta)
    {
        return res.status(400).json({error:"La meta es un campo requerido"});
    }
    next();
}

let habitos = [
    {
        id: 1,
        nombre:"Tomar agua",
        meta:"2 litros al dia",
        registros:[]
    }
];
let nextId = 2;

const hoy = () => new Date().toISOString().split('T')[0];

app.post('/habitos',validarHabito,(req,res) =>{
    const {nombre,meta} = req.body;
    const habito = {id:nextId++,nombre,meta,registros:[]};
    habitos.push(habito);
    res.status(201).json(habito);
})

app.get('/habitos',(req,res)=>{
    res.json(habitos);
})

app.post('/habitos/:id/registrar',(req,res)=>{
    const habito = habitos.find(h=>h.id === parseInt(req.params.id));
    if(!habito) return res.status(404).json({error:"Habito no encontrado"});
    const fecha = hoy();
    const yaRegistrado = habito.registros.find(r=>r.fecha===fecha);
    if(yaRegistrado)
    {
        return res.status(400).json({error:"Ya se registro este habito hoy"});
    }
    habito.registros.push({fecha,completado:true});
    res.status(201).json(habito);
})

app.get('/habitos/:id/estadisticas',(req,res)=>{
    const habito = habitos.find(h=>h.id === parseInt(req.params.id));
    if(!habito) return res.status(404).json({error:"Habito no encontrado"});

    const fechas = habito.registros.map(r=>r.fecha).sort();

    let rachaActual = 0;
    let mejorRacha = 0;
    let racha = 0;
    let anterior = null;

    for(const fecha of fechas)
    {
        if(anterior)
        {
            const diff = (new Date(fecha) - new Date(anterior)) / (1000*60*60*24);
            racha = diff === 1 ? racha + 1 : 1;
        }
        else
        {
            racha = 1;
        }
        if(racha > mejorRacha) mejorRacha = racha;
        anterior = fecha;
    }

    if(fechas.length > 0)
    {
        const ultima = fechas[fechas.length - 1];
        const diffHoy = (new Date(hoy()) - new Date(ultima)) / (1000*60*60*24);
        rachaActual = diffHoy <= 1 ? racha : 0;
    }

    const diasTotales = fechas.length > 0
        ? (new Date(hoy()) - new Date(fechas[0])) / (1000*60*60*24) + 1
        : 0;
    const porcentajeCumplimiento = diasTotales > 0
        ? Number(((fechas.length / diasTotales) * 100).toFixed(2))
        : 0;

    res.json({
        habito:habito.nombre,
        rachaActual,
        mejorRacha,
        porcentajeCumplimiento
    });
})

app.delete('/habitos/:id',(req,res) =>{
    const index = habitos.findIndex(h=> h.id===parseInt(req.params.id))
    if(index===-1) return res.status(404).json({error:"Habito no encontrado"});
    habitos.splice(index,1);
    res.json({mensaje:"Eliminado"});
})