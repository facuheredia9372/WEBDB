import express from 'express';
import { query } from '../db.js';

const router = express.Router({ mergeParams: true });
const handler = fn => (req, res, next) => fn(req, res, next).catch(next);

router.use(handler(async (req, res, next) => {
  const { rows } = await query('SELECT 1 FROM proyectos WHERE id_proyecto = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Proyecto no encontrado' });
  if (req.user.rol_app !== 'lider') {
    const equipo = await query(
      'SELECT 1 FROM trabaja_en WHERE id_proyecto = $1 AND id_empleado = $2',
      [req.params.id, req.user.id_empleado]);
    if (!equipo.rows.length) return res.status(403).json({ error: 'No pertenecés a este proyecto' });
  }
  next();
}));

router.get('/', handler(async (req, res) => {
  const { rows } = await query(
    `SELECT * FROM (
       SELECT m.id_mensaje, m.id_usuario, m.texto, m.sistema, m.fecha, e.nombre, e.apellido, (m.id_usuario = $3) AS propio
       FROM mensajes m
       JOIN usuarios u ON u.id_usuario = m.id_usuario
       JOIN empleados e ON e.id_empleado = u.id_empleado
       WHERE m.id_proyecto = $1 AND m.id_mensaje > $2
       ORDER BY m.id_mensaje DESC LIMIT 100
     ) ultimos ORDER BY id_mensaje`,
    [req.params.id, Number(req.query.despues) || 0, req.user.id_usuario]);
  res.json(rows);
}));

router.post('/', handler(async (req, res) => {
  const texto = String(req.body.texto ?? '').trim();
  if (!texto || texto.length > 500) {
    return res.status(400).json({ error: 'El mensaje debe tener entre 1 y 500 caracteres' });
  }
  await query(
    'INSERT INTO mensajes (id_proyecto, id_usuario, texto) VALUES ($1, $2, $3)',
    [req.params.id, req.user.id_usuario, texto]);
  res.status(201).json({ ok: true });
}));

export default router;