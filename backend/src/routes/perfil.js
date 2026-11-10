import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import express from 'express';
import multer from 'multer';
import { query } from '../db.js';

const { default: bcrypt } = await import('bcryptjs').catch(() => import('bcrypt'));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, '..', '..', 'uploads');
const TIPOS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
fs.mkdirSync(DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: DIR,
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + TIPOS[file.mimetype]),
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, Boolean(TIPOS[file.mimetype])),
});

const router = express.Router();
const handler = fn => (req, res, next) => fn(req, res, next).catch(next);
const limpiar = v => String(v ?? '').trim();
const error = (res, msg) => res.status(400).json({ error: msg });

const PERFIL = `
  SELECT u.id_usuario, e.id_empleado, e.nombre, e.apellido, e.email, e.telefono,
         r.nombre AS cargo, u.username, u.rol_app, u.avisar_vencimientos, u.avisar_mensajes,
         CASE WHEN e.foto IS NULL THEN NULL ELSE '/uploads/' || e.foto END AS foto
  FROM usuarios u
  JOIN empleados e ON e.id_empleado = u.id_empleado
  LEFT JOIN roles r ON r.id_rol = e.id_rol
  WHERE u.id_usuario = $1`;

router.get('/', handler(async (req, res) => {
  const { rows } = await query(PERFIL, [req.user.id_usuario]);
  res.json(rows[0]);
}));

router.patch('/', handler(async (req, res) => {
  const nombre = limpiar(req.body.nombre);
  const apellido = limpiar(req.body.apellido);
  const email = limpiar(req.body.email).toLowerCase();
  const telefono = limpiar(req.body.telefono);
  if (!nombre || !apellido || nombre.length > 50 || apellido.length > 50) {
    return error(res, 'Nombre y apellido son obligatorios (máximo 50 caracteres)');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return error(res, 'El email no es válido');
  if (telefono.length > 30) return error(res, 'El teléfono es demasiado largo');
  try {
    await query(
      `UPDATE empleados SET nombre = $1, apellido = $2, email = $3, telefono = $4
       WHERE id_empleado = (SELECT id_empleado FROM usuarios WHERE id_usuario = $5)`,
      [nombre, apellido, email, telefono || null, req.user.id_usuario]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Ese email ya está en uso' });
    throw e;
  }
  res.json({ ok: true });
}));

router.post('/password', handler(async (req, res) => {
  const actual = String(req.body.actual ?? '');
  const nueva = String(req.body.nueva ?? '');
  if (nueva.length < 8) return error(res, 'La nueva contraseña debe tener al menos 8 caracteres');
  const { rows } = await query('SELECT password_hash FROM usuarios WHERE id_usuario = $1', [req.user.id_usuario]);
  if (!rows.length || !(await bcrypt.compare(actual, rows[0].password_hash))) {
    return error(res, 'La contraseña actual es incorrecta');
  }
  await query('UPDATE usuarios SET password_hash = $1 WHERE id_usuario = $2',
    [await bcrypt.hash(nueva, 10), req.user.id_usuario]);
  res.json({ ok: true });
}));

const subirFoto = (req, res, next) => upload.single('foto')(req, res, err => {
  if (!err) return next();
  error(res, err.code === 'LIMIT_FILE_SIZE' ? 'La foto supera los 3 MB' : 'No se pudo subir la foto');
});

router.post('/foto', subirFoto, handler(async (req, res) => {
  if (!req.file) return error(res, 'Solo se permiten imágenes JPG, PNG o WEBP');
  const previa = await query(
    'SELECT e.foto FROM empleados e JOIN usuarios u ON u.id_empleado = e.id_empleado WHERE u.id_usuario = $1',
    [req.user.id_usuario]);
  await query(
    'UPDATE empleados SET foto = $1 WHERE id_empleado = (SELECT id_empleado FROM usuarios WHERE id_usuario = $2)',
    [req.file.filename, req.user.id_usuario]);
  if (previa.rows[0]?.foto) fs.promises.unlink(path.join(DIR, previa.rows[0].foto)).catch(() => {});
  res.json({ foto: `/uploads/${req.file.filename}` });
}));

router.patch('/avisos', handler(async (req, res) => {
  await query(
    'UPDATE usuarios SET avisar_vencimientos = $1, avisar_mensajes = $2 WHERE id_usuario = $3',
    [Boolean(req.body.avisar_vencimientos), Boolean(req.body.avisar_mensajes), req.user.id_usuario]);
  res.json({ ok: true });
}));

export default router;