import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config();

const testCloudinaryConnection = async () => {
  try {
    // Test the connection by trying to get account info
    const result = await cloudinary.api.ping();
    if (result.status === 'ok') {
      console.log('✅ Connected to Cloudinary successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Failed to connect to Cloudinary:', error.message);
    return false;
  }
};

const connectCloudinary = async () => {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
      secure: true // Force HTTPS
    });

    // Validate required environment variables
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
      throw new Error('Missing required Cloudinary configuration. Please check your .env file.');
    }

    // Test the connection
    const isConnected = await testCloudinaryConnection();
    if (!isConnected) {
      throw new Error('Failed to establish connection with Cloudinary');
    }

  } catch (error) {
    console.error('Cloudinary Configuration Error:', error.message);
    // Don't throw the error, but log it - this allows the app to start even if Cloudinary isn't available
    // The upload functions will handle errors individually
  }
};

// Configure upload defaults
cloudinary.config({
  secure: true, // Force HTTPS
  timeout: 60000, // 60 seconds timeout
  chunked: true, // Enable chunked uploads
  chunk_size: 6000000 // 6MB chunks
});

export { testCloudinaryConnection }; // Export for testing connection in other parts of the app
export default connectCloudinary;