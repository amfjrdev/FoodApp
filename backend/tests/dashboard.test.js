import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { Admin } from '../src/models/Admin.js';
import { Category } from '../src/models/Category.js';
import { Food } from '../src/models/Food.js';
import { Order } from '../src/models/Order.js';
import { hashPassword } from '../src/utils/password.js';
import { ORDER_STATUS } from '../src/constants/orderStatus.js';

let mongoServer;
let adminToken = '';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // 1. Create Admin
  const passwordHash = await hashPassword('AdminPass123!');
  await Admin.create({
    email: 'admin_dash@test.com',
    passwordHash,
    name: 'Dashboard Admin',
  });

  // Login
  const loginRes = await request(app)
    .post('/api/v1/admin/auth/login')
    .send({ email: 'admin_dash@test.com', password: 'AdminPass123!' });
  adminToken = loginRes.body.data.token;

  // 2. Create Category and Food
  const cat = await Category.create({ name: 'Desserts', image: 'https://img.jpg' });
  await Food.create({
    categoryId: cat._id,
    name: 'Gelato',
    description: 'Italian ice cream',
    price: 6.0,
    image: 'https://img.jpg',
    isAvailable: true,
  });

  // 3. Create Orders
  await Order.create({
    orderNumber: 'FD-100001',
    customerName: 'Sam',
    customerPhone: '1234567890',
    deliveryAddress: '1st St',
    subtotal: 12.0,
    deliveryFee: 3.99,
    total: 15.99,
    status: ORDER_STATUS.PENDING,
    items: [
      {
        foodNameSnapshot: 'Gelato',
        unitPriceSnapshot: 6.0,
        quantity: 2,
        subtotal: 12.0,
      },
    ],
  });

  await Order.create({
    orderNumber: 'FD-100002',
    customerName: 'Bob',
    customerPhone: '9876543210',
    deliveryAddress: '2nd St',
    subtotal: 18.0,
    deliveryFee: 3.99,
    total: 21.99,
    status: ORDER_STATUS.DELIVERED,
    items: [
      {
        foodNameSnapshot: 'Gelato',
        unitPriceSnapshot: 6.0,
        quantity: 3,
        subtotal: 18.0,
      },
    ],
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

describe('Dashboard Statistics API (/api/v1/admin/dashboard/statistics)', () => {
  it('Admin can retrieve dashboard overview metrics, orders by status, and recent orders', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard/statistics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overview.totalOrders).toBe(2);
    expect(res.body.data.overview.pendingOrders).toBe(1);
    expect(res.body.data.overview.totalRevenue).toBe(37.98); // 15.99 + 21.99
    expect(res.body.data.overview.activeFoods).toBe(1);
    expect(res.body.data.overview.activeCategories).toBe(1);
    expect(res.body.data.ordersByStatus[ORDER_STATUS.PENDING]).toBe(1);
    expect(res.body.data.ordersByStatus[ORDER_STATUS.DELIVERED]).toBe(1);
    expect(res.body.data.recentOrders.length).toBe(2);
  });

  it('Unauthenticated request to dashboard statistics is rejected', async () => {
    const res = await request(app).get('/api/v1/admin/dashboard/statistics');
    expect(res.statusCode).toBe(401);
    expect(res.body.code).toBe('TOKEN_MISSING');
  });
});
