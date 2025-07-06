// File: warmikuna-backend/test/UsuarioControllerWhiteBox.test.ts

import request from 'supertest';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../src/database/data-source';
import { Usuario } from '../src/entities/Usuario';
import app from '../src/app';

describe('White-Box: UsuarioController.login (integración)', () => {
  const testEmail = 'whitebox@example.com';
  const testPassword = 'Secret123';
  let hashed: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    // Limpiar usuarios previamente
    await AppDataSource.getRepository(Usuario).clear();
    // Insertar un usuario con contraseña hasheada
    hashed = await bcrypt.hash(testPassword, 10);
    await AppDataSource.getRepository(Usuario).save({
      nombre: 'White Box',
      correo: testEmail,
      password: hashed,
      dni: '11111111',
      rol: 'user'
    });
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('400 – correo inválido (formato)', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({ correo: 'not-an-email', password: testPassword });
    expect(res.status).toBe(400);
  });

  it('401 – usuario no existe', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({ correo: 'noexiste@dominio.com', password: testPassword });
    expect(res.status).toBe(401);
  });

  it('401 – contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({ correo: testEmail, password: 'WrongPass' });
    expect(res.status).toBe(401);
  });

  it('200 – login exitoso devuelve token y usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({ correo: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body).toHaveProperty('usuario');
    expect(res.body.usuario).toMatchObject({
      id: expect.any(Number),
      correo: testEmail,
      rol: 'user'
    });
  });
});
