// test/UsuarioService.test.ts

import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/database/data-source';
import { Usuario } from '../src/entities/Usuario';

describe('UsuarioService - Registro y Login', () => {
  const timestamp = Date.now();
  const testUser = {
    nombre: 'Test User',
    correo: `testuser+${timestamp}@example.com`,
    password: 'TestPassword123',   // ahora usamos "password"
    dni: `${Math.floor(10000000 + Math.random() * 90000000)}`
  };

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.getRepository(Usuario).clear();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('debería registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios/registrar')
      .send(testUser);

    expect(res.status).toBe(201);
    // La ruta ahora devuelve { id, correo, rol }
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('correo', testUser.correo);
    expect(res.body).toHaveProperty('rol');
  });

  it('debería permitir login con usuario registrado', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        correo: testUser.correo,
        password: testUser.password    // usamos "password"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body).toHaveProperty('usuario');
    expect(res.body.usuario).toMatchObject({
      correo: testUser.correo,
      rol: expect.any(String),
      id: expect.any(Number)
    });
  });

  it('debería permitir solicitar recuperación de contraseña', async () => {
    const res = await request(app)
      .post('/api/usuarios/cambiar-contrasena')  // ruta original
      .send({
        correo: testUser.correo,
        dni: testUser.dni,
        password: 'NuevaPassword123'            // propiedad "password"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensaje');
    expect(res.body.mensaje).toMatch(/Contraseña actualizada correctamente/i);
  });
});
