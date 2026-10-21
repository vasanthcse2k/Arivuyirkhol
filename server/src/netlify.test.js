import test from 'node:test';
import assert from 'node:assert/strict';
import serverless from 'serverless-http';
import app from './app.js';
import { handler } from './netlify.js';
const invoke = serverless(app);
const event = (path, method = 'GET', body = null) => ({ path, httpMethod: method, headers: { 'content-type': 'application/json' }, body, isBase64Encoded: false, requestContext: { identity: { sourceIp: '127.0.0.1' } } });
test('serverless health returns JSON when database is offline', async () => {
  const response = await invoke(event('/api/health'), {});
  assert.equal(response.statusCode, 503);
  assert.equal(JSON.parse(response.body).database, 'disconnected');
});
test('serverless enquiry rejects invalid input without a database write', async () => {
  const response = await invoke(event('/api/enquiries', 'POST', '{}'), {});
  assert.equal(response.statusCode, 400);
  assert.match(JSON.parse(response.body).message, /Name must/);
});
test('missing cloud database config gives a controlled response', async () => {
  delete process.env.MONGODB_URI;
  const response = await handler(event('/api/health'), {});
  assert.equal(response.statusCode, 503);
  assert.equal(JSON.parse(response.body).database, 'disconnected');
  assert.ok(!response.body.includes('MONGODB_URI'));
});
