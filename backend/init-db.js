import 'dotenv/config';
import { query } from './src/db.js'; // Ajusta la ruta a tu archivo db.js si es necesario

const crearTablas = async () => {
    try {
        console.log('Conectando a la base de datos para crear las tablas...');

        // Sentencia SQL para crear la tabla usuarios (modifícala con los campos exactos de tu sistema)
        await query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                rol VARCHAR(50) DEFAULT 'usuario',
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('¡Tabla "usuarios" creada o verificada exitosamente!');
        process.exit(0);
    } catch (error) {
        console.error('Error al crear las tablas:', error);
        process.exit(1);
    }
};

crearTablas();