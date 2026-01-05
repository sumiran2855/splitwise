import { database } from './database';

class ShutdownHandler {
  private static instance: ShutdownHandler;
  private isShuttingDown = false;

  private constructor() {
    this.setupGracefulShutdown();
  }

  public static getInstance(): ShutdownHandler {
    if (!ShutdownHandler.instance) {
      ShutdownHandler.instance = new ShutdownHandler();
    }
    return ShutdownHandler.instance;
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) {
        console.log('Shutdown already in progress, ignoring signal:', signal);
        return;
      }

      this.isShuttingDown = true;
      console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

      try {
        await database.disconnect();
        console.log('Database disconnected successfully');
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    // Handle various shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2')); // For nodemon restarts

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown('unhandledRejection');
    });
  }
}

export const shutdownHandler = ShutdownHandler.getInstance();
