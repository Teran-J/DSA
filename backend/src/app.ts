import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './presentation/routes';
import { errorHandler } from './presentation/middlewares/errorHandler';
import { UploadService } from './application/services/UploadService';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc'; // 👈 Nueva dependencia
import swaggerOptions from './config/swagger-options';

const app: Application = express();

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middlewares
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(config.upload.dir));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api', routes);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec) // Usamos el objeto generado automáticamente
);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize upload directory
const uploadService = new UploadService();
uploadService.initialize().catch((err) => {
  console.error('Failed to initialize upload directory:', err);
});

export default app;
