import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { requireAuth, requireLider } from './middleware/auth.js';

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