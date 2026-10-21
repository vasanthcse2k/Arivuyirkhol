import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { validateEnquiry } from './validation.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '16kb' }));
const Enquiry = mongoose.model('Enquiry', new mongoose.Schema({
  name: { type: String, required: true }, email: { type: String, required: true },
  organization: String, service: String, audience: String, message: String,
  consent: Boolean, confidential: Boolean, status: { type: String, default: 'new' }
}, { timestamps: true }));
app.get('/api/health', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'unavailable', database: connected ? 'connected' : 'disconnected' });
});
app.post('/api/enquiries', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many enquiries. Please try again in 15 minutes.' } }), async (req, res, next) => {
  const { data, errors } = validateEnquiry(req.body);
  if (errors.length) return res.status(400).json({ message: errors.join(' ') });
  try {
    const enquiry = await Enquiry.create(data);
    res.status(201).json({ message: 'Your enquiry has been saved. The team can follow up by email.', reference: enquiry.id });
  } catch (error) { next(error); }
});
app.use((error, _req, res, _next) => {
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON request.' });
  if (error.type === 'entity.too.large') return res.status(413).json({ message: 'Request is too large.' });
  console.error('Request failed:', error.name);
  res.status(503).json({ message: 'We could not save your enquiry. Please try again later.' });
});
export default app;
