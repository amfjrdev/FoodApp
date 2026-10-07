import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { Admin } from '../src/models/Admin.js';
import { Category } from '../src/models/Category.js';
import { Food } from '../src/models/Food.js';
import { hashPassword } from '../src/utils/password.js';

let mongoServer;
let adminToken = '';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create admin
  const passwordHash = await hashPassword('AdminPass123!');
  await Admin.create({
    email: 'admin_cat@test.com',
    passwordHash,
    name: 'Category Admin',
  });

  // Login to get token
  const loginRes = await request(app)
    .post('/api/v1/admin/auth/login')
    .send({ email: 'admin_cat@test.com', password: 'AdminPass123!' });
  adminToken = loginRes.body.data.token;
}, 60000);

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Category API (/api/v1/categories & /api/v1/admin/categories)', () => {
  let createdCategoryId = '';

  it('Admin should successfully create a new category', async () => {
    const res = await request(app)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Artisan Burgers',
        image: 'https://images.unsplash.com/photo-burger.jpg',
        sortOrder: 1,
        isActive: true,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Artisan Burgers');
    expect(res.body.data.sortOrder).toBe(1);

    createdCategoryId = res.body.data.id || res.body.data._id;
  });

  it('Admin should fail to create duplicate category with same name', async () => {
    const res = await request(app)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Artisan Burgers',
        image: 'https://images.unsplash.com/photo-burger2.jpg',
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('DUPLICATE_CATEGORY');
  });

  it('Public customer can list active categories without authentication', async () => {
    const res = await request(app).get('/api/v1/categories');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].name).toBe('Artisan Burgers');
  });

  it('Public customer can fetch a category by ID', async () => {
    const res = await request(app).get(`/api/v1/categories/${createdCategoryId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Artisan Burgers');
  });

  it('Admin can update category details and toggle active status', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Gourmet Burgers',
        sortOrder: 10,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Gourmet Burgers');
    expect(res.body.data.sortOrder).toBe(10);
  });

  it('Admin cannot delete category if associated foods exist (Safe Deletion)', async () => {
    // Create an associated food item
    await Food.create({
      categoryId: createdCategoryId,
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with aged cheddar',
      price: 12.99,
      image: 'https://images.unsplash.com/cheeseburger.jpg',
      isAvailable: true,
    });

    const res = await request(app)
      .delete(`/api/v1/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('CATEGORY_HAS_FOODS');
  });

  it('Admin can delete category once all associated foods are removed', async () => {
    // Clean up foods in category
    await Food.deleteMany({ categoryId: createdCategoryId });

    const res = await request(app)
      .delete(`/api/v1/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is gone
    const fetchRes = await request(app).get(`/api/v1/categories/${createdCategoryId}`);
    expect(fetchRes.statusCode).toBe(404);
  });

  it('Unauthenticated user cannot access admin category endpoints', async () => {
    const res = await request(app)
      .post('/api/v1/admin/categories')
      .send({
        name: 'Unauthorized Category',
        image: 'https://example.com/img.jpg',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('TOKEN_MISSING');
  });
});
