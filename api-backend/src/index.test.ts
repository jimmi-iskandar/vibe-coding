import { describe, expect, it, spyOn } from 'bun:test';
import { app } from './index';
import { UsersService } from './services/users-service';

describe('Elysia Server API', () => {
  it('should return 200 OK and status Running on GET /', async () => {
    const response = await app.handle(new Request('http://localhost/'));
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toEqual({
      message: 'Hello Elysia!',
      status: 'Running',
    });
  });

  it('should gracefully return items or error depending on DB connection state', async () => {
    const response = await app.handle(new Request('http://localhost/items'));
    expect(response.status).toBe(200);
    
    const data = await response.json();
    if (Array.isArray(data)) {
      expect(Array.isArray(data)).toBe(true);
    } else {
      expect(data).toHaveProperty('error');
    }
  });
});

describe('Elysia User API', () => {
  it('should return error if payload validation fails', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'iskandar' }), // missing email & password
      })
    );
    expect(response.status).toBe(422);
  });

  it('should return data: OK when registration service succeeds', async () => {
    const registerSpy = spyOn(UsersService, 'register').mockResolvedValue({
      success: true,
      data: 'OK',
    });

    const response = await app.handle(
      new Request('http://localhost/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'iskandar',
          email: 'jim.iskandar20@gmail.com',
          password: 'rahasia',
        }),
      })
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ data: 'OK' });
    
    registerSpy.mockRestore();
  });

  it('should return error when registration service fails', async () => {
    const registerSpy = spyOn(UsersService, 'register').mockResolvedValue({
      success: false,
      error: 'email sudah terdaftar atau password salah',
    });

    const response = await app.handle(
      new Request('http://localhost/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'iskandar',
          email: 'jim.iskandar20@gmail.com',
          password: 'rahasia',
        }),
      })
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      error: 'email sudah terdaftar atau password salah',
      eror: 'email sudah terdaftar atau password salah',
    });

    registerSpy.mockRestore();
  });
});
