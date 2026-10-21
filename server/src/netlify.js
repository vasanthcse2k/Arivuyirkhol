import serverless from 'serverless-http';
import app from './app.js';
import { connectDatabase } from './database.js';
const handle = serverless(app);
export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  try { await connectDatabase(); }
  catch (error) {
    console.error('Database connection unavailable:', error.name);
    return { statusCode: 503, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Enquiry storage is temporarily unavailable. Please email contactarivuyirkhol@gmail.com.', status: 'unavailable', database: 'disconnected' }) };
  }
  // Both the public rewrite and the direct function URL use the same API routes.
  const adjusted = { ...event, path: event.path.replace(/^\/\.netlify\/functions\/api(?:\/api)?(?=\/|$)/, '/api') };
  return handle(adjusted, context);
}
