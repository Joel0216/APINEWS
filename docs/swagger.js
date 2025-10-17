// docs/swagger.js
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

function mountSwagger(app) {
  const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true, // mantiene el token al refrescar
        displayRequestDuration: true,
      },
      customSiteTitle: 'API News - Swagger',
    })
  );
}

module.exports = { mountSwagger };
