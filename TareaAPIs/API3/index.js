const express = require('express');
const app = express();
app.use(express.json());
app.listen(3000, () => console.log("Servidor en el puerto 3000"))

app.use((req,res,next) =>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next();
})

const validarProducto = (req,res,next) =>{
    const {producto,stock} = req.body;
    if(!producto)
    {
        return res.status(400).json({error:"El producto es un campo requerido"});
    }
    if(stock===undefined || typeof stock!=="number" || stock<0)
    {
        return res.status(400).json({error:"El stock debe ser un numero valido"});
    }
    next();
}

const validarCantidad = (req,res,next) =>{
    const {cantidad} = req.body;
    if(cantidad===undefined || typeof cantidad!=="number" || cantidad<=0)
    {
        return res.status(400).json({error:"La cantidad debe ser un numero positivo"});
    }
    next();
}

let inventario = [
    {
        id: 1,
        producto:"Laptop",
        stock:15,
        stockMinimo:5
    }
];
let nextId = 2;

app.get('/inventario',(req,res)=>{
    res.json(inventario);
})

app.post('/inventario',validarProducto,(req,res) =>{
    const {producto,stock,stockMinimo} = req.body;
    const item = {
        id:nextId++,
        producto,
        stock,
        stockMinimo: stockMinimo!==undefined ? stockMinimo : 5
    };
    inventario.push(item);
    res.status(201).json(item);
})

app.post('/inventario/:id/entrada',validarCantidad,(req,res)=>{
    const item = inventario.find(i=>i.id === parseInt(req.params.id));
    if(!item) return res.status(404).json({error:"Producto no encontrado"});
    item.stock += req.body.cantidad;
    res.json(item);
})

app.post('/inventario/:id/salida',validarCantidad,(req,res)=>{
    const item = inventario.find(i=>i.id === parseInt(req.params.id));
    if(!item) return res.status(404).json({error:"Producto no encontrado"});
    const {cantidad} = req.body;
    if(cantidad > item.stock)
    {
        return res.status(400).json({error:"No hay suficiente stock disponible"});
    }
    item.stock -= cantidad;
    res.json(item);
})

app.get('/inventario/alertas',(req,res)=>{
    const alertas = inventario
        .filter(i=>i.stock < i.stockMinimo)
        .map(i=>({...i, faltante: i.stockMinimo - i.stock}));
    res.json(alertas);
})



