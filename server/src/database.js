import mongoose from 'mongoose';
let connectionPromise;
export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in server/.env locally or Netlify environment variables when hosted.');
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000, maxPoolSize: 5 }).catch(error => { connectionPromise = undefined; throw error; });
  }
  await connectionPromise;
}
