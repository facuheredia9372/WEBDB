import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Sesión no iniciada' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Sesión vencida o inválida' });
  }
}

export function requireLider(req, res, next) {
  if (req.user?.rol !== 'lider') {
    return res.status(403).json({ error: 'Solo disponible para líderes' });
  }
  next();
}
