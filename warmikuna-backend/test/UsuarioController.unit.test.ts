// File: test/UsuarioController.unit.test.ts

import { UsuarioController } from '../src/controllers/UsuarioController';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { usuarioService } from '../src/services/UsuarioService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Hacemos mock de los módulos
jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));
jest.mock('../src/services/UsuarioService', () => ({
  usuarioService: {
    buscarPorCorreo: jest.fn()
  }
}));
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('UsuarioController.login (unitario)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  // Convertimos los imports mockeados a jest.Mocks
  const mockValidationResult = validationResult as unknown as jest.Mock;
  const mockBuscar = usuarioService.buscarPorCorreo as jest.Mock;
  const mockCompare = (bcrypt.compare as unknown as jest.Mock);
  const mockSign    = (jwt.sign as unknown as jest.Mock);

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('debe devolver 400 si la validación falla', async () => {
    mockValidationResult.mockReturnValue({
      isEmpty: () => false,
      array:   () => [{ msg: 'Error de validación' }]
    });

    await UsuarioController.login(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errores: [{ msg: 'Error de validación' }] });
  });

  it('debe devolver 401 si el usuario no existe', async () => {
    mockValidationResult.mockReturnValue({ isEmpty: () => true });
    mockBuscar.mockResolvedValue(null);

    req.body = { correo: 'a@b.com', password: 'pwd' };
    await UsuarioController.login(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Credenciales inválidas' });
  });

  it('debe devolver 401 si la contraseña es incorrecta', async () => {
    mockValidationResult.mockReturnValue({ isEmpty: () => true });
    mockBuscar.mockResolvedValue({ id:1, correo:'a@b.com', password:'hash', rol:'user', dni:'', nombre:'' });
    mockCompare.mockResolvedValue(false);

    req.body = { correo: 'a@b.com', password: 'wrong' };
    await UsuarioController.login(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Credenciales inválidas' });
  });

    it('debe devolver token y usuario si las credenciales son válidas', async () => {
    mockValidationResult.mockReturnValue({ isEmpty: () => true });
    mockBuscar.mockResolvedValue({
      id: 1,
      correo: 'a@b.com',
      password: 'hash',
      rol: 'user',
      dni: '',
      nombre: ''
    });
    mockCompare.mockResolvedValue(true);
    mockSign.mockReturnValue('mock-token');

    req.body = { correo: 'a@b.com', password: 'correct' };
    await UsuarioController.login(req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      token: 'mock-token',
      usuario: {
        id: 1,
        correo: 'a@b.com',
        rol: 'user'
      }
    });
  });

});
