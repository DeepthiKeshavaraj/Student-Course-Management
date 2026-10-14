import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_service_db';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Student Service] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Student Service] MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
