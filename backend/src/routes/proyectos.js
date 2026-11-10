import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { rows } = await query(
    `SELECT v.*,
            COUNT(t.id_tarea)::int AS total_tareas,
            COUNT(t.id_tarea) FILTER (WHERE t.estado = 'Completada')::int AS tareas_completadas
     FROM vw_detalle_proyectos v
     LEFT JOIN tareas t ON t.id_proyecto = v.id_proyecto
     WHERE $1::boolean OR EXISTS (
       SELECT 1 FROM trabaja_en w WHERE w.id_proyecto = v.id_proyecto AND w.id_empleado = $2
     )
     GROUP BY v.id_proyecto, v.proyecto, v.estado, v.fecha_inicio, v.fecha_fin, v.cliente, v.empresa
     ORDER BY CASE v.estado WHEN 'En progreso' THEN 0 WHEN 'Planificación' THEN 1 ELSE 2 END, v.fecha_fin`,
    [req.user.rol === 'lider', req.user.id_empleado],
  );
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Id inválido' });

  const [proyecto, equipo, tecnologias] = await Promise.all([
    query('SELECT * FROM vw_detalle_proyectos WHERE id_proyecto = $1', [id]),
    query(
      `SELECT e.id_empleado, e.nombre, e.apellido, r.nombre AS cargo
       FROM trabaja_en w
       INNER JOIN empleados e ON w.id_empleado = e.id_empleado
       INNER JOIN roles r ON e.id_rol = r.id_rol
       WHERE w.id_proyecto = $1
       ORDER BY e.nombre`,
      [id],
    ),
    query(
      `SELECT t.id_tecnologia, t.nombre
       FROM usa u
       INNER JOIN tecnologias t ON u.id_tecnologia = t.id_tecnologia
       WHERE u.id_proyecto = $1
       ORDER BY t.nombre`,
      [id],
    ),
  ]);

  const esMiembro = equipo.rows.some((e) => e.id_empleado === req.user.id_empleado);
  if (!proyecto.rows[0] || (req.user.rol !== 'lider' && !esMiembro)) {
    return res.status(404).json({ error: 'Proyecto no encontrado' });
  }

  res.json({ ...proyecto.rows[0], equipo: equipo.rows, tecnologias: tecnologias.rows });
});

export default router;
