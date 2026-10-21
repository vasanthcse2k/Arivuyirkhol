import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEnquiry } from './validation.js';
const valid = { name: 'Science Team', email: ' TEAM@example.com ', service: 'Research Summaries', audience: 'Public', message: 'Please explain our research to a public audience.', consent: true };
test('valid enquiry is normalized and unknown fields discarded', () => { const result = validateEnquiry({ ...valid, status: 'approved' }); assert.deepEqual(result.errors, []); assert.equal(result.data.email, 'team@example.com'); assert.equal(result.data.status, undefined); });
test('rejects malformed and missing data', () => { assert.ok(validateEnquiry({}).errors.length >= 5); assert.ok(validateEnquiry({ ...valid, email: 'bad', service: 'fake', consent: 'true' }).errors.length === 3); });
test('rejects oversized project brief', () => assert.ok(validateEnquiry({ ...valid, message: 'x'.repeat(3001) }).errors.length));
