import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDatabase } from './database.js';

try {
  await connectDatabase();
  const server = app.listen(process.env.PORT || 5000, () => console.log(`API ready at http://localhost:${process.env.PORT || 5000}`));
  for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(async () => { await mongoose.disconnect(); process.exit(0); }));
} catch (error) {
  console.error('Startup failed:', error.name === 'MongooseServerSelectionError' ? 'Cannot connect to MongoDB. Check server/.env and start MongoDB.' : error.message);
  process.exit(1);
}
