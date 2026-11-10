import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const id = req.user.id_empleado;

  const [proyectos, conteo, prioritaria] = await Promise.all([
    query(
      `SELECT p.id_proyecto, p.nombre
       FROM proyectos p
       INNER JOIN trabaja_en w ON w.id_proyecto = p.id_proyecto
       WHERE w.id_empleado = $1 AND p.estado = 'En progreso'
       ORDER BY p.nombre`,
      [id],
    ),
    query(
      `SELECT COUNT(*)::int AS pendientes,
              COUNT(*) FILTER (WHERE prioridad = 'Crítica')::int AS urgentes
       FROM tareas
       WHERE id_empleado = $1 AND estado <> 'Completada'`,
      [id],
    ),
    query(
      `SELECT * FROM vw_tareas_detalle
       WHERE id_empleado = $1 AND estado <> 'Completada'
       ORDER BY CASE prioridad WHEN 'Crítica' THEN 0 WHEN 'Alta' THEN 1 WHEN 'Media' THEN 2 ELSE 3 END,
                fecha_limite
       LIMIT 1`,
      [id],
    ),
  ]);

  res.json({
    fecha: new Date().toISOString(),
    proyectos_activos: { total: proyectos.rowCount, items: proyectos.rows },
    tareas_pendientes: conteo.rows[0],
    tarea_prioritaria: prioritaria.rows[0] ?? null,
  });
});

export default router;
