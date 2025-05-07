// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('✅ Conectado a MongoDB');
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB:', err);
        process.exit(1); // Termina la app si no se puede conectar
    }
};
