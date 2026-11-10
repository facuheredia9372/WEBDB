import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import express from 'express';
import multer from 'multer';
import { query } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DIR = path.join(__dirname, '..', '..', 'uploads');
const TIPOS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
fs.mkdirSync(DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: DIR,
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + TIPOS[file.mimetype]),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, Boolean(TIPOS[file.mimetype])),
});

const router = express.Router({ mergeParams: true });
const handler = fn => (req, res, next) => fn(req, res, next).catch(next);
const esLider = req => req.user.rol_app === 'lider';
const COLUMNAS = "id_adjunto, id_usuario, nombre_original, fecha, '/uploads/' || archivo AS url";

router.use(handler(async (req, res, next) => {
  const { rows } = await query('SELECT id_empleado FROM tareas WHERE id_tarea = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Tarea no encontrada' });
  if (!esLider(req) && rows[0].id_empleado !== req.user.id_empleado) {
    return res.status(403).json({ error: 'No tenés permiso sobre esta tarea' });
  }
  next();
}));

router.get('/', handler(async (req, res) => {
  const { rows } = await query(
    `SELECT ${COLUMNAS}, (id_usuario = $2) AS propio FROM adjuntos WHERE id_tarea = $1 ORDER BY fecha DESC`,
    [req.params.id, req.user.id_usuario]);
  res.json(rows);
}));

const subir = (req, res, next) => upload.single('imagen')(req, res, err => {
  if (!err) return next();
  res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'La imagen supera los 5 MB' : 'No se pudo subir la imagen' });
});

router.post('/', subir, handler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Solo se permiten imágenes JPG, PNG o WEBP' });
  const { rows } = await query(
    `INSERT INTO adjuntos (id_tarea, id_usuario, archivo, nombre_original)
     VALUES ($1, $2, $3, $4) RETURNING ${COLUMNAS}`,
    [req.params.id, req.user.id_usuario, req.file.filename, req.file.originalname]);
  res.status(201).json(rows[0]);
}));

router.delete('/:idAdjunto', handler(async (req, res) => {
  const { rows } = await query(
    'SELECT archivo, id_usuario FROM adjuntos WHERE id_adjunto = $1 AND id_tarea = $2',
    [req.params.idAdjunto, req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Imagen no encontrada' });
  if (!esLider(req) && rows[0].id_usuario !== req.user.id_usuario) {
    return res.status(403).json({ error: 'No podés eliminar esta imagen' });
  }
  await query('DELETE FROM adjuntos WHERE id_adjunto = $1', [req.params.idAdjunto]);
  fs.promises.unlink(path.join(DIR, rows[0].archivo)).catch(() => {});
  res.json({ ok: true });
}));

export default router;