import { describe, expect, it } from 'bun:test';

describe('Elysia Server API', () => {
  it('should return 200 OK and status Running on GET /', async () => {
    const response = await fetch('http://localhost:3000/');
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toEqual({
      message: 'Hello Elysia!',
      status: 'Running',
    });
  });

  it('should gracefully return error for GET /items when DB is disconnected', async () => {
    const response = await fetch('http://localhost:3000/items');
    expect(response.status).toBe(200);
    
    const data = (await response.json()) as { error: string };
    expect(data).toHaveProperty('error');
  });
});
