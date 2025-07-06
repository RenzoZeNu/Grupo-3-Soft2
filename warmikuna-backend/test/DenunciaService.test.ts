// test/DenunciaService.test.ts

import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/database/data-source';
import { Usuario } from '../src/entities/Usuario';
import { Denuncia } from '../src/entities/Denuncia';
import { Evidencia } from '../src/entities/Evidencia';

describe('DenunciaService - Crear denuncia y listar propias', () => {
  const timestamp = Date.now();
  const testUser = {
    nombre: 'Test User',
    correo: `testuser+${timestamp}@example.com`,
    password: 'TestPassword123',
    dni: `${Math.floor(10000000 + Math.random() * 90000000)}`
  };
  let token: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    // Limpiar tablas
    await AppDataSource.getRepository(Evidencia).clear();
    await AppDataSource.getRepository(Denuncia).clear();
    await AppDataSource.getRepository(Usuario).clear();

    // Registrar y loguear usuario
    await request(app).post('/api/usuarios/registrar').send(testUser);
    const loginRes = await request(app)
      .post('/api/usuarios/login')
      .send({ correo: testUser.correo, password: testUser.password });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('debería crear una nueva denuncia', async () => {
    const denunciaData = {
      descripcion: 'Prueba de denuncia automatizada',
      anonima: false
    };

    const res = await request(app)
      .post('/api/denuncias')
      .set('Authorization', `Bearer ${token}`)
      .send(denunciaData);

    expect(res.status).toBe(201);
    // El controlador devuelve la entidad de Denuncia
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      descripcion: denunciaData.descripcion,
      anonima: denunciaData.anonima,
      estado: expect.any(String),
      correo_usuario: testUser.correo
    });
  });

  it('debería obtener las denuncias del usuario autenticado', async () => {
    const res = await request(app)
      .get('/api/denuncias')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Cada elemento debe tener al menos estas propiedades
    res.body.forEach((d: any) => {
      expect(d).toMatchObject({
        id: expect.any(Number),
        descripcion: expect.any(String),
        anonima: expect.any(Boolean),
        estado: expect.any(String),
        correo_usuario: testUser.correo
      });
    });
  });
});


