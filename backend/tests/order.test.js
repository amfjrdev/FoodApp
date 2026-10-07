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
let availableFood1;
let availableFood2;
let unavailableFood;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // 1. Create Admin
  const passwordHash = await hashPassword('AdminPass123!');
  await Admin.create({
    email: 'admin_order@test.com',
    passwordHash,
    name: 'Order Admin',
  });

  // Login
  const loginRes = await request(app)
    .post('/api/v1/admin/auth/login')
    .send({ email: 'admin_order@test.com', password: 'AdminPass123!' });
  adminToken = loginRes.body.data.token;

  // 2. Create Category
  const category = await Category.create({
    name: 'Burger Category',
    image: 'https://images.unsplash.com/burger.jpg',
  });

  // 3. Create Foods
  availableFood1 = await Food.create({
    categoryId: category._id,
    name: 'Bacon Cheeseburger',
    description: 'Juicy beef patty with bacon and cheddar',
    price: 15.0,
    image: 'https://images.unsplash.com/burger1.jpg',
    isAvailable: true,
  });

  availableFood2 = await Food.create({
    categoryId: category._id,
    name: 'Crispy Fries',
    description: 'Golden salted French fries',
    price: 5.0,
    image: 'https://images.unsplash.com/fries.jpg',
    isAvailable: true,
  });

  unavailableFood = await Food.create({
    categoryId: category._id,
    name: 'Sold Out Milkshake',
    description: 'Vanilla milkshake',
    price: 6.0,
    image: 'https://images.unsplash.com/shake.jpg',
    isAvailable: false,
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

describe('Order & Order Lifecycle API (/api/v1/orders & /api/v1/admin/orders)', () => {
  let createdOrderNumber = '';
  let createdOrderId = '';

  it('Anonymous customer can place an order and server calculates accurate prices', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customerName: 'John Doe',
        customerPhone: '+1-555-0199',
        deliveryAddress: '742 Evergreen Terrace, Springfield',
        notes: 'Please ring bell',
        items: [
          { foodId: availableFood1._id.toString(), quantity: 2 }, // 2 * 15.00 = 30.00
          { foodId: availableFood2._id.toString(), quantity: 1 }, // 1 * 5.00 = 5.00
        ],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.customerName).toBe('John Doe');
    expect(res.body.data.status).toBe(ORDER_STATUS.PENDING);
    expect(res.body.data.subtotal).toBe(35.0);
    expect(res.body.data.deliveryFee).toBe(3.99);
    expect(res.body.data.total).toBe(38.99);
    expect(res.body.data.items.length).toBe(2);
    expect(res.body.data.items[0].foodNameSnapshot).toBe('Bacon Cheeseburger');
    expect(res.body.data.items[0].unitPriceSnapshot).toBe(15.0);
    expect(res.body.data.orderNumber).toMatch(/^FD-\d{6}$/);

    createdOrderNumber = res.body.data.orderNumber;
    createdOrderId = res.body.data.id || res.body.data._id;
  });

  it('Customer receives free delivery if subtotal meets free delivery threshold ($50)', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customerName: 'Alice Smith',
        customerPhone: '+1-555-0123',
        deliveryAddress: '100 Main St, Suite 400',
        items: [
          { foodId: availableFood1._id.toString(), quantity: 4 }, // 4 * 15.00 = 60.00 (>= 50.00)
        ],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.subtotal).toBe(60.0);
    expect(res.body.data.deliveryFee).toBe(0);
    expect(res.body.data.total).toBe(60.0);
  });

  it('Anonymous customer can track order status using public order number', async () => {
    const res = await request(app).get(`/api/v1/orders/${createdOrderNumber}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderNumber).toBe(createdOrderNumber);
    expect(res.body.data.status).toBe(ORDER_STATUS.PENDING);
    expect(res.body.data.customerName).toBe('John Doe');
  });

  it('Order placement fails when an item is unavailable', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customerName: 'Jane Doe',
        customerPhone: '+1-555-0987',
        deliveryAddress: '123 Fake Street',
        items: [
          { foodId: unavailableFood._id.toString(), quantity: 1 },
        ],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('FOOD_UNAVAILABLE');
  });

  it('Order placement fails with non-existent food ID', async () => {
    const ghostId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customerName: 'Jane Doe',
        customerPhone: '+1-555-0987',
        deliveryAddress: '123 Fake Street',
        items: [
          { foodId: ghostId, quantity: 1 },
        ],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.code).toBe('FOOD_NOT_FOUND');
  });

  it('Admin can list orders with pagination and status filters', async () => {
    const res = await request(app)
      .get('/api/v1/admin/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ status: ORDER_STATUS.PENDING });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('Admin can transition order status along valid lifecycle state machine', async () => {
    // 1. PENDING -> CONFIRMED
    const res1 = await request(app)
      .patch(`/api/v1/admin/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: ORDER_STATUS.CONFIRMED });

    expect(res1.statusCode).toBe(200);
    expect(res1.body.data.status).toBe(ORDER_STATUS.CONFIRMED);

    // 2. CONFIRMED -> PREPARING
    const res2 = await request(app)
      .patch(`/api/v1/admin/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: ORDER_STATUS.PREPARING });

    expect(res2.statusCode).toBe(200);
    expect(res2.body.data.status).toBe(ORDER_STATUS.PREPARING);

    // 3. PREPARING -> READY
    const res3 = await request(app)
      .patch(`/api/v1/admin/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: ORDER_STATUS.READY });

    expect(res3.statusCode).toBe(200);
    expect(res3.body.data.status).toBe(ORDER_STATUS.READY);
  });

  it('Admin status update is rejected on invalid lifecycle transition (e.g. READY -> PENDING)', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: ORDER_STATUS.PENDING });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('INVALID_STATUS_TRANSITION');
  });

  it('Price changes to original food catalog item do NOT alter historical order snapshot', async () => {
    // Admin changes food price from 15.00 to 25.00
    await Food.findByIdAndUpdate(availableFood1._id, { price: 25.0 });

    // Customer looks up existing order
    const res = await request(app).get(`/api/v1/orders/${createdOrderNumber}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.items[0].unitPriceSnapshot).toBe(15.0); // Price preserved!
    expect(res.body.data.subtotal).toBe(35.0); // Subtotal preserved!
  });
});
