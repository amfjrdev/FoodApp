import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { Admin } from '../src/models/Admin.js';
import { Category } from '../src/models/Category.js';
import { hashPassword } from '../src/utils/password.js';

let mongoServer;
let adminToken = '';
let testCategory;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create admin
  const passwordHash = await hashPassword('AdminPass123!');
  await Admin.create({
    email: 'admin_food@test.com',
    passwordHash,
    name: 'Food Admin',
  });

  // Login
  const loginRes = await request(app)
    .post('/api/v1/admin/auth/login')
    .send({ email: 'admin_food@test.com', password: 'AdminPass123!' });
  adminToken = loginRes.body.data.token;

  // Create test category
  testCategory = await Category.create({
    name: 'Pizza Category',
    image: 'https://images.unsplash.com/pizza.jpg',
    sortOrder: 1,
    isActive: true,
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

describe('Food API (/api/v1/foods & /api/v1/admin/foods)', () => {
  let createdFoodId = '';

  it('Admin should successfully create a new food item', async () => {
    const res = await request(app)
      .post('/api/v1/admin/foods')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId: testCategory.id || testCategory._id.toString(),
        name: 'Neapolitan Margherita',
        description: 'Authentic buffalo mozzarella with San Marzano tomatoes and basil',
        price: 15.5,
        image: 'https://images.unsplash.com/margherita.jpg',
        isAvailable: true,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Neapolitan Margherita');
    expect(res.body.data.price).toBe(15.5);
    expect(res.body.data.categoryId).toHaveProperty('name', 'Pizza Category');

    createdFoodId = res.body.data.id || res.body.data._id;
  });

  it('Admin should fail to create food item with non-existent category', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post('/api/v1/admin/foods')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId: nonExistentId,
        name: 'Ghost Food',
        description: 'Does not exist',
        price: 10.0,
        image: 'https://example.com/ghost.jpg',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('INVALID_CATEGORY');
  });

  it('Public customer can list foods with search and category filtering', async () => {
    const res = await request(app)
      .get('/api/v1/foods')
      .query({
        search: 'Margherita',
        categoryId: testCategory.id || testCategory._id.toString(),
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Neapolitan Margherita');
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination.total).toBe(1);
  });

  it('Public customer can fetch a food item by ID', async () => {
    const res = await request(app).get(`/api/v1/foods/${createdFoodId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Neapolitan Margherita');
    expect(res.body.data.categoryId.name).toBe('Pizza Category');
  });

  it('Admin can update food price and availability status', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/foods/${createdFoodId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        price: 17.0,
        isAvailable: false,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.price).toBe(17.0);
    expect(res.body.data.isAvailable).toBe(false);
  });

  it('Unavailable food should not be returned to public customer queries by default', async () => {
    const res = await request(app).get('/api/v1/foods');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it('Admin can delete a food item', async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/foods/${createdFoodId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const checkRes = await request(app).get(`/api/v1/foods/${createdFoodId}`);
    expect(checkRes.statusCode).toBe(404);
  });

  it('Unauthenticated user cannot create or update food items', async () => {
    const res = await request(app)
      .post('/api/v1/admin/foods')
      .send({
        categoryId: testCategory.id || testCategory._id.toString(),
        name: 'Hacked Food',
        description: 'Hacked description',
        price: 99.0,
        image: 'https://example.com/hacked.jpg',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.code).toBe('TOKEN_MISSING');
  });
});
