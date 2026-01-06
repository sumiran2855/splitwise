import mongoose from 'mongoose';

interface IDatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  ensureConnected(): Promise<void>;
}

class DatabaseConnection implements IDatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnectedFlag: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnectedFlag) {
      console.log('Database already connected');
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/splitwise';
      
      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      });

      this.isConnectedFlag = true;
      console.log('Connected to MongoDB successfully');

      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
        this.isConnectedFlag = false;
      });

      mongoose.connection.on('disconnected', () => {
        this.isConnectedFlag = false;
      });

      mongoose.connection.on('reconnected', () => {
        this.isConnectedFlag = true;
      });

    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      this.isConnectedFlag = false;
      throw error;
    }
  }

  public async ensureConnected(): Promise<void> {
    if (this.isConnectedFlag && mongoose.connection.readyState === 1) {
      return;
    }

    if (this.connectionPromise) {
      await this.connectionPromise;
      return;
    }

    this.connectionPromise = this.connect();

    try {
      await this.connectionPromise;
    } finally {
      this.connectionPromise = null;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedFlag) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnectedFlag = false;
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public isConnected(): boolean {
    return this.isConnectedFlag && mongoose.connection.readyState === 1;
  }
}

export const database = DatabaseConnection.getInstance();

// Initialize database connection on server startup
database.connect().catch(error => {
  console.error('Failed to connect to database on startup:', error);
});
