// index.js — versión completa y funcional con Swagger + MySQL (XAMPP) + JWT global

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// ==========================
// 1️⃣ Conexión a MySQL (XAMPP)
// ==========================
const mysql = require('mysql2');

// Pool de conexión MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'apinews',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

// Prueba de conexión al iniciar
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('✅ Conexión establecida con MySQL (XAMPP)');
  } catch (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
  }
})();

// ==========================
// 2️⃣ Configuración de Express
// ==========================
const app = express();
app.use(cors());
app.use(express.json());

// ==========================
// 3️⃣ Cargar Swagger (OpenAPI)
// ==========================
const swaggerPath = path.join(__dirname, 'docs', 'openapi.yaml');
const swaggerDocument = YAML.load(swaggerPath);

const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true, // mantiene el JWT al refrescar
    displayRequestDuration: true,
  },
  customSiteTitle: 'API News - Swagger Docs',
};

// Montamos Swagger en /docs y /api-docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Página raíz con enlace a docs
app.get('/', (_req, res) => {
  res.type('html').send(`
    <h1>API News</h1>
    <p>Documentación: <a href="/docs">/docs</a> | <a href="/api-docs">/api-docs</a></p>
  `);
});

// ==========================
// 4️⃣ Middleware global JWT
// ==========================
function requireAuth(req, res, next) {
  // Permitir las rutas públicas de autenticación
  if (
    (req.method === 'POST' && req.path.startsWith('/api/auth/login')) ||
    (req.method === 'POST' && req.path.startsWith('/api/auth/register'))
  ) {
    return next();
  }

  const auth = req.headers.authorization || '';
  const parts = auth.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header (expected Bearer token)',
    });
  }

  try {
    const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
}

// Aplicar el middleware JWT solo a las rutas /api/*
app.use('/api', requireAuth);

// ==========================
// 5️⃣ Rutas de la API
// ==========================
try {
  app.use('/api/auth', require('./routes/auth.routes'));
} catch (e) {
  console.warn('⚠️  Aviso: no se encontró ./routes/auth.routes. Crea el archivo si lo necesitas.');
}

try {
  app.use('/api/users', require('./routes/users.routes'));
} catch (e) {
  console.warn('⚠️  Aviso: no se encontró ./routes/users.routes. Crea el archivo si lo necesitas.');
}

// ==========================
// 6️⃣ Manejo de errores y 404
// ==========================
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: `No existe la ruta ${req.method} ${req.originalUrl}`,
    });
  }
  return next();
});

// ==========================
// 7️⃣ Iniciar servidor
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  console.log(`Swagger disponible en: http://localhost:${PORT}/docs  (y /api-docs)`);
});
