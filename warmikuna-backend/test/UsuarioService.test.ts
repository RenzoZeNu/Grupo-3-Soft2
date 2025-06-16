import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/database/data-source';
import { Usuario } from '../src/entities/Usuario';

describe('UsuarioService - Registro y Login', () => {

  const timestamp = Date.now();
  const testUser = {
    nombre: 'Test User',
    correo: `testuser+${timestamp}@example.com`,
    contrasena: 'TestPassword123',
    dni: `${Math.floor(10000000 + Math.random() * 90000000)}`
  };

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    await AppDataSource.getRepository(Usuario).clear();
  });

  it('debería registrar un nuevo usuario', async () => {
    const response = await request(app)
      .post('/api/usuarios/registrar')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('mensaje');
    expect(response.body.mensaje).toMatch(/Usuario registrado con éxito/i);
  });

  it('debería permitir login con usuario registrado', async () => {
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        correo: testUser.correo,
        contrasena: testUser.contrasena
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  it('debería permitir solicitar recuperación de contraseña', async () => {
  const response = await request(app)
    .post('/api/usuarios/recuperar-contrasena')
    .send({
    correo: testUser.correo,
    dni: testUser.dni,
    nuevaContrasena: 'NuevaPassword123'
    })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensaje');
    expect(response.body.mensaje).toMatch(/Contraseña actualizada correctamente/i);

});

});



