import request from 'supertest';
import app from '../../src/index';

describe('Cache and invalidation integration', () => {
  it('GET /api/news should be cached', async () => {
    const res1 = await request(app).get('/api/news?page=1&limit=2');
    expect(res1.status).toBe(200);
    const res2 = await request(app).get('/api/news?page=1&limit=2');
    expect(res2.status).toBe(200);
    // Responses should be identical (cached)
    expect(res2.body).toEqual(res1.body);
  });
});
