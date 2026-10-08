import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Portfolio API Server running on port ${PORT}`);
      console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
      console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    const shutdown = () => {
      console.log('\nShutting down server gracefully...');
      server.close(() => {
        console.log('Server process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err: any) {
    console.error('Fatal error starting server:', err.message);
    process.exit(1);
  }
};

startServer();
