// middlewares/requireAuth.js
const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  // Rutas públicas permitidas
  const publicPaths = [
    { method: 'POST', path: '/api/auth/login' },
    { method: 'POST', path: '/api/auth/register' },
  ];

  // Si la ruta actual es pública, continuar
  const isPublic = publicPaths.some(p =>
    p.method === req.method && req.path.startsWith(p.path)
  );
  if (isPublic) return next();

  // Extraer token del header Authorization: Bearer <token>
  const auth = req.headers.authorization || '';
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header (expected Bearer token)',
    });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // deja disponible el payload del JWT
    next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};
