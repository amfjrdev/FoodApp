import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { Admin } from '../src/models/Admin.js';
import { hashPassword } from '../src/utils/password.js';

let mongoServer;
const TEST_ADMIN = {
  email: 'admin@foodapp.test',
  password: 'AdminPassword123!',
  name: 'Test Admin',
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Seed test admin
  const passwordHash = await hashPassword(TEST_ADMIN.password);
  await Admin.create({
    email: TEST_ADMIN.email,
    passwordHash,
    name: TEST_ADMIN.name,
  });
}, 60000);

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Admin Authentication API (/api/v1/admin/auth)', () => {
  let validToken = '';

  describe('POST /api/v1/admin/auth/login', () => {
    it('should successfully log in with valid credentials and return JWT token', async () => {
      const res = await request(app)
        .post('/api/v1/admin/auth/login')
        .send({
          email: TEST_ADMIN.email,
          password: TEST_ADMIN.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(typeof res.body.data.token).toBe('string');
      expect(res.body.data.admin).toHaveProperty('email', TEST_ADMIN.email);
      expect(res.body.data.admin).toHaveProperty('name', TEST_ADMIN.name);
      expect(res.body.data.admin).not.toHaveProperty('passwordHash');

      validToken = res.body.data.token;
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/admin/auth/login')
        .send({
          email: TEST_ADMIN.email,
          password: 'WrongPassword999',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/admin/auth/login')
        .send({
          email: 'unknown@foodapp.test',
          password: TEST_ADMIN.password,
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should return 400 validation error on malformed email or missing password', async () => {
      const res = await request(app)
        .post('/api/v1/admin/auth/login')
        .send({
          email: 'not-an-email',
          password: '123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/v1/admin/auth/me (Protected)', () => {
    it('should return admin profile when authenticated with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/v1/admin/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(TEST_ADMIN.email);
      expect(res.body.data.name).toBe(TEST_ADMIN.name);
      expect(res.body.data).not.toHaveProperty('passwordHash');
    });

    it('should reject request when Authorization header is missing', async () => {
      const res = await request(app).get('/api/v1/admin/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('TOKEN_MISSING');
    });

    it('should reject request when token is invalid or tampered', async () => {
      const res = await request(app)
        .get('/api/v1/admin/auth/me')
        .set('Authorization', 'Bearer invalid.tampered.token');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /api/v1/admin/auth/logout (Protected)', () => {
    it('should successfully log out authenticated admin', async () => {
      const res = await request(app)
        .post('/api/v1/admin/auth/logout')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Logged out successfully');
    });
  });
});
