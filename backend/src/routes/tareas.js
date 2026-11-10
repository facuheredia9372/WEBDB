import { Router } from 'express';
import { query } from '../db.js';
import { requireLider } from '../middleware/auth.js';

const router = Router();

const ESTADOS = ['Pendiente', 'En progreso', 'Completada'];
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Crítica'];
const ORDEN = `
  CASE estado WHEN 'Completada' THEN 1 ELSE 0 END,
  CASE prioridad WHEN 'Crítica' THEN 0 WHEN 'Alta' THEN 1 WHEN 'Media' THEN 2 ELSE 3 END,
  fecha_limite`;

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

const esLider = (req) => req.user.rol === 'lider';

router.get('/', async (req, res) => {
  const { estado, empleado } = req.query;

  let idEmpleado = req.user.id_empleado;
  if (esLider(req) && empleado === 'todos') idEmpleado = null;
  else if (esLider(req) && empleado) idEmpleado = Number(empleado);
  if (idEmpleado !== null && !Number.isInteger(idEmpleado)) {
    return res.status(400).json({ error: 'Empleado inválido' });
  }
  if (estado && !ESTADOS.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  const filtros = [];
  const params = [];
  if (idEmpleado !== null) {
    params.push(idEmpleado);
    filtros.push(`id_empleado = $${params.length}`);
  }
  if (estado) {
    params.push(estado);
    filtros.push(`estado = $${params.length}`);
  }
  const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

  const { rows } = await query(`SELECT * FROM vw_tareas_detalle ${where} ORDER BY ${ORDEN}`, params);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Id inválido' });

  const { rows } = await query('SELECT * FROM vw_tareas_detalle WHERE id_tarea = $1', [id]);
  const tarea = rows[0];
  if (!tarea || (!esLider(req) && tarea.id_empleado !== req.user.id_empleado)) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.json(tarea);
});

router.patch('/:id/estado', async (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body ?? {};
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Id inválido' });
  if (!ESTADOS.includes(estado)) return res.status(400).json({ error: 'Estado inválido' });

  const { rowCount } = await query(
    `UPDATE tareas SET estado = $1
     WHERE id_tarea = $2 AND ($3::boolean OR id_empleado = $4)`,
    [estado, id, esLider(req), req.user.id_empleado],
  );
  if (!rowCount) return res.status(404).json({ error: 'Tarea no encontrada' });

  const { rows } = await query('SELECT * FROM vw_tareas_detalle WHERE id_tarea = $1', [id]);
  res.json(rows[0]);
});

router.post('/', requireLider, async (req, res) => {
  const { nombre, descripcion = null, prioridad = 'Media', fecha_limite, id_proyecto, id_empleado } = req.body ?? {};
  const proyecto = Number(id_proyecto);
  const empleado = Number(id_empleado);

  if (typeof nombre !== 'string' || !nombre.trim() || !Number.isInteger(proyecto) || !Number.isInteger(empleado)) {
    return res.status(400).json({ error: 'Faltan datos de la tarea' });
  }
  if (!PRIORIDADES.includes(prioridad)) return res.status(400).json({ error: 'Prioridad inválida' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_limite ?? '')) {
    return res.status(400).json({ error: 'La fecha límite debe tener formato AAAA-MM-DD' });
  }

  try {
    const { rows } = await query(
      `INSERT INTO tareas (nombre, descripcion, prioridad, fecha_limite, id_proyecto, id_empleado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id_tarea`,
      [nombre.trim(), descripcion, prioridad, fecha_limite, proyecto, empleado],
    );
    const tarea = await query('SELECT * FROM vw_tareas_detalle WHERE id_tarea = $1', [rows[0].id_tarea]);
    res.status(201).json(tarea.rows[0]);
  } catch (err) {
    if (err.code === '23503') return res.status(400).json({ error: 'El empleado no trabaja en ese proyecto' });
    if (err.code === '23514' || err.code === '22008') {
      return res.status(400).json({ error: 'La fecha límite no puede ser anterior a hoy' });
    }
    throw err;
  }
});

router.patch('/:id', requireLider, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Id inválido' });

  const { nombre, descripcion, prioridad, fecha_limite, id_empleado } = req.body ?? {};
  const campos = [];
  const valores = [];
  const agregar = (columna, valor) => {
    valores.push(valor);
    campos.push(`${columna} = $${valores.length}`);
  };

  if (nombre !== undefined) {
    if (typeof nombre !== 'string' || !nombre.trim()) return res.status(400).json({ error: 'Título inválido' });
    agregar('nombre', nombre.trim());
  }
  if (descripcion !== undefined) agregar('descripcion', descripcion ? String(descripcion).trim() : null);
  if (prioridad !== undefined) {
    if (!PRIORIDADES.includes(prioridad)) return res.status(400).json({ error: 'Prioridad inválida' });
    agregar('prioridad', prioridad);
  }
  if (fecha_limite !== undefined) {
    if (!FECHA.test(fecha_limite)) return res.status(400).json({ error: 'Fecha inválida' });
    agregar('fecha_limite', fecha_limite);
  }
  if (id_empleado !== undefined) {
    const empleado = Number(id_empleado);
    if (!Number.isInteger(empleado)) return res.status(400).json({ error: 'Empleado inválido' });
    agregar('id_empleado', empleado);
  }
  if (!campos.length) return res.status(400).json({ error: 'No hay cambios para guardar' });

  valores.push(id);
  try {
    const { rowCount } = await query(
      `UPDATE tareas SET ${campos.join(', ')} WHERE id_tarea = $${valores.length}`,
      valores,
    );
    if (!rowCount) return res.status(404).json({ error: 'Tarea no encontrada' });

    const { rows } = await query('SELECT * FROM vw_tareas_detalle WHERE id_tarea = $1', [id]);
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23503') return res.status(400).json({ error: 'El empleado no trabaja en ese proyecto' });
    if (err.code === '23514') {
      return res.status(400).json({ error: 'La fecha límite no puede ser anterior a la fecha de asignación' });
    }
    if (err.code === '22007' || err.code === '22008') return res.status(400).json({ error: 'Fecha inválida' });
    throw err;
  }
});

router.delete('/:id', requireLider, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Id inválido' });

  const { rowCount } = await query('DELETE FROM tareas WHERE id_tarea = $1', [id]);
  if (!rowCount) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.json({ mensaje: 'Tarea eliminada' });
});

export default router;
