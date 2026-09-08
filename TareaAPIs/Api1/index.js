const express = require('express');
const app = express();

app.use(express.json());
app.listen(3000, () => console.log("Servidor en el puerto 3000"))

app.use((req, res, next) => {
    console.log('[${new Dte().toISOS()}] ${req.method} ${req.url}')
    next();
})


const validarProducto = (req,res,next) =>{
    const {nombre,precio,cantidad} = req.body;
    if(!nombre)
    {
        return res.status(400).json({error:"El nombre es un campo requerido"});
    }
    if(precio===undefined || typeof precio!=="number" || precio<=0)
    {
        return res.status(400).json({error:"El precio debe ser un numero positivo"});
    }
    if(cantidad===undefined || typeof cantidad!=="number" || cantidad<=0)
    {
        return res.status(400).json({error:"La cantidad debe ser un numero positivo"});
    }
    next();
}

let productos = [
    {
        id: 1,
        nombre:"Kiwi",
        precio:20,
        cantidad:3
    }
];
let nextId = 2;

app.get('/productos',(req,res)=>{
    res.json(productos);
})

app.post('/productos',validarProducto,(req,res) =>{
    const {nombre,precio,cantidad} = req.body;
    const existente = productos.find(p=>p.nombre.toLowerCase()===nombre.toLowerCase());
    if(existente)
    {
        existente.cantidad += cantidad;
        return res.json(existente);
    }
    const producto = {id:nextId++,nombre,precio,cantidad};
    productos.push(producto);
    res.status(201).json(producto);
})

app.put('/productos/:id',(req,res)=>{
    const producto = productos.find(p=>p.id === parseInt(req.params.id));
    if(!producto) return res.status(404).json({error:"Producto no encontrado"});
    const {cantidad} = req.body;
    if(cantidad===undefined || typeof cantidad!=="number" || cantidad<=0)
    {
        return res.status(400).json({error:"La cantidad debe ser un numero positivo"});
    }
    producto.cantidad = cantidad;
    res.json(producto);
})

app.delete('/productos/:id',(req,res) =>{
    const index = productos.findIndex(p=> p.id===parseInt(req.params.id))
    if(index===-1) return res.status(404).json({error:"Producto no encontrado"});
    productos.splice(index,1);
    res.json({mensaje:"Eliminado"});
})

app.get('/carrito/total',(req,res)=>{
    const total = productos.reduce((acc,p)=>acc + p.precio*p.cantidad,0);
    res.json({total});
})

app.post('/carrito/aplicar-descuento',(req,res)=>{
    const {porcentaje} = req.body;
    if(porcentaje===undefined || typeof porcentaje!=="number" || porcentaje<=0)
    {
        return res.status(400).json({error:"El porcentaje debe ser un numero positivo"});
    }
    if(porcentaje>50)
    {
        return res.status(400).json({error:"El descuento maximo permitido es 50%"});
    }
    const total = productos.reduce((acc,p)=>acc + p.precio*p.cantidad,0);
    const totalConDescuento = total - total*(porcentaje/100);
    res.json({totalOriginal:total,totalConDescuento});
})  