import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { requireAuth, requireLider } from './middleware/auth.js';
import { query } from './db.js'; // Importación correcta de la base de datos

import authRoutes from './routes/auth.js';
import panelRoutes from './routes/panel.js';
import tareasRoutes from './routes/tareas.js';
import proyectosRoutes from './routes/proyectos.js';
import liderRoutes from './routes/lider.js';
import adjuntosRoutes from './routes/adjuntos.js';
import mensajesRoutes from './routes/mensajes.js';
import perfilRoutes from './routes/perfil.js';
import gestionRoutes from './routes/gestion.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(
    path.join(__dirname, '..', 'uploads')
));

// Ruta de prueba para verificar la conexión a Render
app.get('/test-db', async (req, res) => {
    try {
        const resultado = await query('SELECT NOW()');
        res.json({
            mensaje: '¡Conexión exitosa con Render!',
            fechaServidorBD: resultado.rows[0].now
        });
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        res.status(500).json({ error: 'Fallo la conexión con la base de datos', detalle: error.message });
    }
});

// Rutas públicas
app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/panel', requireAuth, panelRoutes);
app.use('/api/tareas/:id/adjuntos', requireAuth, adjuntosRoutes);
app.use('/api/tareas', requireAuth, tareasRoutes);
app.use('/api/proyectos/:id/mensajes', requireAuth, mensajesRoutes);
app.use('/api/proyectos', requireAuth, proyectosRoutes);
app.use('/api/perfil', requireAuth, perfilRoutes);

// Rutas de líder
app.use('/api/lider', requireAuth, requireLider, gestionRoutes);
app.use('/api/lider', requireAuth, requireLider, liderRoutes);

// Ruta inexistente
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    const status = err.status >= 400 && err.status < 500
        ? err.status
        : 500;

    if (status === 500) console.error(err);

    res.status(status).json({
        error: status === 500
            ? 'Error interno del servidor'
            : 'Solicitud inválida'
    });
});

// Iniciar servidor
const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
    console.log(`API escuchando en el puerto ${port}`);
});