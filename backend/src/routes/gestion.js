import express from 'express';
import { query } from '../db.js';

const router = express.Router();
const handler = fn => (req, res, next) => fn(req, res, next).catch(next);
const limpiar = v => String(v ?? '').trim();
const error = (res, status, msg) => res.status(status).json({ error: msg });

router.get('/catalogos', handler(async (req, res) => {
  const [clientes, tecnologias, empleados] = await Promise.all([
    query('SELECT id_cliente, nombre, empresa FROM clientes ORDER BY empresa, nombre'),
    query('SELECT id_tecnologia, nombre FROM tecnologias ORDER BY nombre'),
    query(`SELECT e.id_empleado, e.nombre, e.apellido, r.nombre AS cargo
           FROM empleados e LEFT JOIN roles r ON r.id_rol = e.id_rol
           ORDER BY e.apellido, e.nombre`),
  ]);
  res.json({ clientes: clientes.rows, tecnologias: tecnologias.rows, empleados: empleados.rows });
}));

router.post('/clientes', handler(async (req, res) => {
  const nombre = limpiar(req.body.nombre);
  const empresa = limpiar(req.body.empresa);
  const email = limpiar(req.body.email).toLowerCase();
  const telefono = limpiar(req.body.telefono);
  const direccion = limpiar(req.body.direccion);
  if (!nombre || !empresa) return error(res, 400, 'Nombre y empresa son obligatorios');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return error(res, 400, 'El email no es válido');
  try {
    const { rows } = await query(
      `INSERT INTO clientes (nombre, email, telefono, direccion, empresa)
       VALUES ($1, $2, $3, $4, $5) RETURNING id_cliente, nombre, empresa`,
      [nombre, email, telefono || null, direccion || null, empresa]);
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return error(res, 409, 'Ya existe un cliente con ese email');
    throw e;
  }
}));

router.put('/proyectos/:id/equipo', handler(async (req, res) => {
  const id = Number(req.params.id);
  const empleados = Array.isArray(req.body.empleados) ? req.body.empleados.map(Number) : null;
  if (!Number.isInteger(id) || !empleados || empleados.some(n => !Number.isInteger(n))) {
    return error(res, 400, 'Datos de equipo inválidos');
  }
  const proyecto = await query('SELECT 1 FROM proyectos WHERE id_proyecto = $1', [id]);
  if (!proyecto.rows.length) return error(res, 404, 'Proyecto no encontrado');

  const bloqueados = await query(
    `SELECT DISTINCT e.nombre, e.apellido FROM tareas t
     JOIN empleados e ON e.id_empleado = t.id_empleado
     WHERE t.id_proyecto = $1 AND NOT (t.id_empleado = ANY($2::int[]))`,
    [id, empleados]);
  if (bloqueados.rows.length) {
    const nombres = bloqueados.rows.map(e => `${e.nombre} ${e.apellido}`).join(', ');
    return error(res, 409, `No se puede quitar del equipo a quien tiene tareas en el proyecto: ${nombres}`);
  }

  await query(
    `WITH quitar AS (
       DELETE FROM trabaja_en WHERE id_proyecto = $1::int AND NOT (id_empleado = ANY($2::int[]))
     )
     INSERT INTO trabaja_en (id_empleado, id_proyecto)
     SELECT id_empleado, $1::int FROM empleados WHERE id_empleado = ANY($2::int[])
     ON CONFLICT DO NOTHING`,
    [id, empleados]);
  res.json({ ok: true });
}));

export default router;