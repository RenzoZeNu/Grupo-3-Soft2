import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/database/data-source';
import { Usuario } from '../src/entities/Usuario';
import { Denuncia } from '../src/entities/Denuncia';
import { Evidencia } from '../src/entities/Evidencia';

describe('DenunciaService - Crear denuncia', () => {

  const timestamp = Date.now();
  const testUser = {
    nombre: 'Test User',
    correo: `testuser+${timestamp}@example.com`,
    contrasena: 'TestPassword123',
    dni: `${Math.floor(10000000 + Math.random() * 90000000)}`
  };

  let token: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    await AppDataSource.getRepository(Evidencia).createQueryBuilder().delete().execute();
    await AppDataSource.getRepository(Denuncia).createQueryBuilder().delete().execute();
    await AppDataSource.getRepository(Usuario).createQueryBuilder().delete().execute();

    // Crear usuario
    await request(app)
      .post('/api/usuarios/registrar')
      .send(testUser);

    // Login
    const login = await request(app)
      .post('/api/usuarios/login')
      .send({
        correo: testUser.correo,
        contrasena: testUser.contrasena
      });

    token = login.body.token;
  });

  it('debería crear una nueva denuncia', async () => {
    const denunciaData = {
      descripcion: 'Prueba de denuncia automatizada',
      anonima: false
    };

    const response = await request(app)
      .post('/api/denuncias')
      .set('Authorization', `Bearer ${token}`)
      .send(denunciaData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('mensaje');
    expect(response.body.mensaje).toMatch(/Denuncia creada exitosamente/i);
    expect(response.body).toHaveProperty('denuncia');
  });

  it('debería obtener las denuncias del usuario autenticado', async () => {
  const response = await request(app)
    .get('/api/denuncias/mis-denuncias')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});


});


