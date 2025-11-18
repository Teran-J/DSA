import { Options } from 'swagger-jsdoc';

const options: Options = {
  // Información básica de la API (lo que antes iba en el YAML)
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Design Platform API',
      version: '1.0.0',
      description: 'API para la plataforma de diseño.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desarrollo Local',
      },
    ],
  },
  // Rutas de archivos donde Swagger JSDoc debe buscar los comentarios.
  // Es crucial que apunte a tus controladores o archivos de rutas compilados.
  apis: [
    // La ruta es relativa a 'backend/' (la carpeta raíz del proyecto Node.js)
    './src/presentation/routes/*.ts',

    // Incluir explícitamente los archivos de rutas que contienen los 'components/schemas'
    // aunque estén incluidos en el wildcard anterior, es una buena práctica.
    './src/presentation/routes/authRoutes.ts',
    './src/presentation/routes/designRoutes.ts',
    './src/presentation/routes/reviewRoutes.ts',
    './src/presentation/routes/uploadRoutes.ts',
  ],
};

export default options;
