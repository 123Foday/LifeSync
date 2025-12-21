import mongoose from "mongoose"

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));

    // Use dbName option instead of appending to the connection string to avoid SRV/URL formatting issues
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'lifeSync',
      // reduce server selection timeout so failures are visible quickly in development
      serverSelectionTimeoutMS: 10000,
      // recommended in modern mongoose versions; other options can be added as needed
      maxPoolSize: 10,
    });

    console.log('Successfully connected to MongoDB')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Crash the process so the developer notices and can fix config (nodemon will wait for file changes)
    process.exit(1);
  }
}

export default connectDB