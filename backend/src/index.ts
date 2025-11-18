import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎨 Design Platform API Server                          ║
║                                                           ║
║   Environment: ${config.nodeEnv.padEnd(43)}║
║   Port: ${PORT.toString().padEnd(50)}║
║   API Base: http://localhost:${PORT}/api${' '.repeat(23)}║
║                                                           ║
║   📚 Endpoints:                                           ║
║   - POST   /api/auth/register                            ║
║   - POST   /api/auth/login                               ║
║   - GET    /api/products                                 ║
║   - POST   /api/designs                                  ║
║   - POST   /api/upload                                   ║
║   - POST   /api/reviews/:id/approve                      ║
║   - GET    /health                                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
