import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Demasiados intentos, probá de nuevo en unos minutos' },
});

const normalizar = (texto = '') =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

const SELECT_USUARIO = `
  SELECT u.id_usuario, u.id_empleado, u.password_hash, u.rol_app, u.activo,
         e.nombre, e.apellido, r.nombre AS cargo
  FROM usuarios u
  INNER JOIN empleados e ON u.id_empleado = e.id_empleado
  INNER JOIN roles r ON e.id_rol = r.id_rol`;

const perfil = (u) => ({
  id_empleado: u.id_empleado,
  nombre: u.nombre,
  apellido: u.apellido,
  cargo: u.cargo,
  rol: u.rol_app,
});

router.post('/login', limiter, async (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Faltan usuario o contraseña' });
  }

  const { rows } = await query(`${SELECT_USUARIO} WHERE u.username = $1`, [normalizar(username)]);
  const usuario = rows[0];
  const valido = usuario?.activo && (await bcrypt.compare(password, usuario.password_hash));
  if (!valido) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  const token = jwt.sign(
    { id_usuario: usuario.id_usuario, id_empleado: usuario.id_empleado, rol: usuario.rol_app },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '8h' },
  );
  res.json({ token, usuario: perfil(usuario) });
});

router.post('/registro', limiter, async (req, res) => {
  const { id_empleado, nombre, username, password } = req.body ?? {};
  const id = Number(id_empleado);

  if (!Number.isInteger(id) || id <= 0 || [nombre, username, password].some((v) => typeof v !== 'string')) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }
  const usuarioNormalizado = normalizar(username);
  if (!/^[a-z0-9._-]{3,30}$/.test(usuarioNormalizado)) {
    return res.status(400).json({ error: 'Usuario inválido: 3 a 30 caracteres, letras, números, punto, guion' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  const { rows } = await query('SELECT nombre FROM empleados WHERE id_empleado = $1', [id]);
  if (!rows[0] || normalizar(rows[0].nombre) !== normalizar(nombre)) {
    return res.status(400).json({ error: 'El nombre y el id no coinciden con ningún empleado' });
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    await query(
      `INSERT INTO usuarios (id_empleado, username, password_hash, rol_app)
       VALUES ($1, $2, $3, 'programador')`,
      [id, usuarioNormalizado, hash],
    );
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ese empleado ya tiene cuenta o el usuario está en uso' });
    }
    throw err;
  }
  res.status(201).json({ mensaje: 'Cuenta creada' });
});

router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await query(`${SELECT_USUARIO} WHERE u.id_usuario = $1`, [req.user.id_usuario]);
  if (!rows[0]?.activo) return res.status(401).json({ error: 'Sesión inválida' });
  res.json(perfil(rows[0]));
});

export default router;
