import "dotenv/config";
import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import productosRoutes from "./routes/productos.routes.js";
import carritoRoutes from "./routes/carrito.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggerMiddleware);

app.use("/productos", productosRoutes);
app.use("/carrito", carritoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});