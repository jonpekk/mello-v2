import request from 'supertest';
import { app } from '../app';

describe('GET /api/v1/counter', () => {
  it('It should return a 200', async () => {
    const response = await request(app).get('/api/v1/counter');
    expect(response.status).toBe(200);
  });
});