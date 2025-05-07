import express from 'express';
import { connectDB } from './config/db.js';
import { router } from './routes/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());

// Rutas
app.use(router);

// Ruta raíz
app.get('/', (req, res) => {
    res.send('¡Servidor y base de datos funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
