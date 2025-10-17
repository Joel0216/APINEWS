const express = require('express');
// Usamos el archivo de configuración mejorado que carga variables de entorno
const { connection, testConnection } = require('./config.db');

// Registrar modelos (para que Sequelize conozca las tablas)
require('./models/ProfileModel');
require('./models/CategoryModel');

require('./models/NewModel');
require('./models/StateModel');
require('./models/UserModel');

const app = express();
app.use(express.json());

//Exportar Rutas
const profile_routes = require('./routes/ProfileRoute');
const state_routes = require('./routes/StateRoute');
const category_routes = require('./routes/CategoryRoute');
const new_routes = require('./routes/NewRoute');
const user_routes = require('./routes/UserRoute');
const auth_routes = require('./routes/AuthRoute');

// healthcheck
app.get('/health', async (req, res) => {
  try {
    await testConnection();
    res.json({ ok: true, message: 'Database connection is healthy' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Database connection failed', error: error.message });
  }
});

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ApiNews',
      version: '1.0.0',
      description: 'Una API para un portal de noticias.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Usar las rutas
app.use('/api', profile_routes, state_routes, category_routes, new_routes, user_routes, auth_routes)

const startServer = async () => {
  await testConnection(); // Primero prueba la conexión a la BD

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
  });
};

startServer();
