import { Router } from 'express';
import { query, transaction } from '../db.js';

const router = Router();

const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const ESTADOS_NUEVO_PROYECTO = ['Planificación', 'En progreso'];

const listaDeIds = (valor) => {
  if (!Array.isArray(valor)) return null;
  const ids = [...new Set(valor.map(Number))];
  return ids.every((n) => Number.isInteger(n) && n > 0) ? ids : null;
};

router.get('/equipo', async (req, res) => {
  const { rows } = await query(
    `SELECT e.id_empleado, e.nombre, e.apellido, e.email, r.nombre AS cargo,
            u.username, u.rol_app,
            COUNT(t.id_tarea) FILTER (WHERE t.estado <> 'Completada')::int AS tareas_pendientes
     FROM empleados e
     INNER JOIN roles r ON e.id_rol = r.id_rol
     LEFT JOIN usuarios u ON u.id_empleado = e.id_empleado
     LEFT JOIN tareas t ON t.id_empleado = e.id_empleado
     GROUP BY e.id_empleado, e.nombre, e.apellido, e.email, r.nombre, u.username, u.rol_app
     ORDER BY e.nombre`,
  );
  res.json(rows);
});

router.post('/clientes', async (req, res) => {
  const { nombre, email = null, telefono = null, direccion = null, empresa = null } = req.body ?? {};
  if (typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre del cliente es obligatorio' });
  }

  await query('CALL sp_insertar_cliente($1, $2, $3, $4, $5)', [nombre.trim(), email, telefono, direccion, empresa]);
  res.status(201).json({ mensaje: 'Cliente creado' });
});

router.get('/catalogos', async (req, res) => {
  const [clientes, tecnologias, empleados] = await Promise.all([
    query('SELECT id_cliente, nombre, empresa FROM clientes ORDER BY empresa, nombre'),
    query('SELECT id_tecnologia, nombre FROM tecnologias ORDER BY nombre'),
    query(
      `SELECT e.id_empleado, e.nombre, e.apellido, r.nombre AS cargo
       FROM empleados e
       INNER JOIN roles r ON e.id_rol = r.id_rol
       ORDER BY e.nombre, e.apellido`,
    ),
  ]);
  res.json({ clientes: clientes.rows, tecnologias: tecnologias.rows, empleados: empleados.rows });
});

router.post('/proyectos', async (req, res) => {
  const {
    nombre,
    descripcion = null,
    fecha_inicio,
    fecha_fin,
    estado = 'Planificación',
    id_cliente,
    empleados = [],
    tecnologias = [],
  } = req.body ?? {};
  const cliente = Number(id_cliente);
  const idsEmpleados = listaDeIds(empleados);
  const idsTecnologias = listaDeIds(tecnologias);

  if (
    typeof nombre !== 'string' || !nombre.trim() || !Number.isInteger(cliente) ||
    !FECHA.test(fecha_inicio ?? '') || !FECHA.test(fecha_fin ?? '')
  ) {
    return res.status(400).json({ error: 'Faltan datos del proyecto' });
  }
  if (!ESTADOS_NUEVO_PROYECTO.includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
  if (!idsEmpleados || !idsTecnologias) return res.status(400).json({ error: 'Listas inválidas' });

  try {
    const idProyecto = await transaction(async (db) => {
      const { rows } = await db.query(
        `INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin, estado, id_cliente)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id_proyecto`,
        [nombre.trim(), descripcion ? String(descripcion).trim() : null, fecha_inicio, fecha_fin, estado, cliente],
      );
      const id = rows[0].id_proyecto;
      await db.query(
        'INSERT INTO trabaja_en (id_empleado, id_proyecto) SELECT unnest($1::int[]), $2',
        [idsEmpleados, id],
      );
      await db.query('INSERT INTO usa (id_proyecto, id_tecnologia) SELECT $1, unnest($2::int[])', [id, idsTecnologias]);
      return id;
    });
    res.status(201).json({ id_proyecto: idProyecto });
  } catch (err) {
    if (err.code === '23503') return res.status(400).json({ error: 'Cliente, empleado o tecnología inexistente' });
    if (err.code === '23514') return res.status(400).json({ error: 'La fecha de fin no puede ser anterior a la de inicio' });
    if (err.code === '22007' || err.code === '22008') return res.status(400).json({ error: 'Fecha inválida' });
    throw err;
  }
});

router.put('/proyectos/:id/equipo', async (req, res) => {
  const id = Number(req.params.id);
  const empleados = listaDeIds(req.body?.empleados);
  if (!Number.isInteger(id) || !empleados) return res.status(400).json({ error: 'Datos inválidos' });

  const proyecto = await query('SELECT 1 FROM proyectos WHERE id_proyecto = $1', [id]);
  if (!proyecto.rowCount) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const conTareas = await query(
    'SELECT 1 FROM tareas WHERE id_proyecto = $1 AND id_empleado <> ALL($2::int[]) LIMIT 1',
    [id, empleados],
  );
  if (conTareas.rowCount) {
    return res.status(409).json({ error: 'No se puede quitar a alguien que tiene tareas asignadas en el proyecto' });
  }

  try {
    await transaction(async (db) => {
      await db.query('DELETE FROM trabaja_en WHERE id_proyecto = $1 AND id_empleado <> ALL($2::int[])', [id, empleados]);
      await db.query(
        'INSERT INTO trabaja_en (id_empleado, id_proyecto) SELECT unnest($1::int[]), $2 ON CONFLICT DO NOTHING',
        [empleados, id],
      );
    });
    res.json({ mensaje: 'Equipo actualizado' });
  } catch (err) {
    if (err.code === '23503') return res.status(400).json({ error: 'Empleado inexistente' });
    throw err;
  }
});

export default router;
