import { Order } from '../models/Order.js';
import { Food } from '../models/Food.js';
import { env } from '../config/env.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { ORDER_STATUS, isValidStatusTransition } from '../constants/orderStatus.js';
import { NotFoundError, BadRequestError } from '../errors/AppError.js';

class OrderService {
  /**
   * Anonymous customer order creation with ZERO-TRUST server-side price calculation
   */
  async createOrder(data) {
    const { customerName, customerPhone, deliveryAddress, notes, items } = data;

    // 1. Fetch referenced food records from database
    const foodIds = items.map((item) => item.foodId);
    const foods = await Food.find({ _id: { $in: foodIds } });

    if (foods.length !== foodIds.length) {
      throw new BadRequestError(
        'One or more selected foods could not be found',
        'FOOD_NOT_FOUND'
      );
    }

    const foodMap = foods.reduce((acc, food) => {
      acc[food._id.toString()] = food;
      return acc;
    }, {});

    // 2. Validate availability and calculate snapshot prices
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const food = foodMap[item.foodId];

      if (!food.isAvailable) {
        throw new BadRequestError(
          `'${food.name}' is currently unavailable. Please remove it from your cart to proceed.`,
          'FOOD_UNAVAILABLE',
          { unavailableFoodId: food._id, unavailableFoodName: food.name }
        );
      }

      const itemSubtotal = Math.round(food.price * item.quantity * 100) / 100;
      subtotal = Math.round((subtotal + itemSubtotal) * 100) / 100;

      orderItems.push({
        foodId: food._id,
        foodNameSnapshot: food.name,
        unitPriceSnapshot: food.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    // 3. Compute delivery fee and grand total
    const deliveryFee =
      subtotal >= env.FREE_DELIVERY_THRESHOLD ? 0 : Number(env.DELIVERY_FEE);
    const total = Math.round((subtotal + deliveryFee) * 100) / 100;

    // 4. Generate unique non-sequential order number
    let orderNumber = generateOrderNumber();
    let collisionCheck = await Order.findOne({ orderNumber });
    while (collisionCheck) {
      orderNumber = generateOrderNumber();
      collisionCheck = await Order.findOne({ orderNumber });
    }

    // 5. Persist order
    const order = await Order.create({
      orderNumber,
      customerName,
      customerPhone,
      deliveryAddress,
      notes,
      subtotal,
      deliveryFee,
      total,
      status: ORDER_STATUS.PENDING,
      items: orderItems,
    });

    return order;
  }

  /**
   * Public tracking lookup by order number
   */
  async getOrderByOrderNumber(orderNumber) {
    const formattedNumber = orderNumber.toUpperCase().trim();
    const order = await Order.findOne({ orderNumber: formattedNumber });

    if (!order) {
      throw new NotFoundError(
        `Order '${formattedNumber}' was not found. Please check your order number.`,
        'ORDER_NOT_FOUND'
      );
    }

    return order;
  }

  /**
   * Admin orders list with search and filtering
   */
  async getOrders(query = {}) {
    const { status, search, page = 1, limit = 20 } = query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search && search.trim()) {
      const searchTerm = search.trim();
      filter.$or = [
        { orderNumber: { $regex: searchTerm, $options: 'i' } },
        { customerName: { $regex: searchTerm, $options: 'i' } },
        { customerPhone: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      Order.countDocuments(filter),
    ]);

    return {
      orders,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber) || 1,
      },
    };
  }

  /**
   * Admin order detail by ID
   */
  async getOrderById(id) {
    const order = await Order.findById(id);
    if (!order) {
      throw new NotFoundError(`Order not found with ID: ${id}`, 'ORDER_NOT_FOUND');
    }
    return order;
  }

  /**
   * Admin order status state machine transition
   */
  async updateOrderStatus(id, nextStatus) {
    const order = await this.getOrderById(id);

    if (!isValidStatusTransition(order.status, nextStatus)) {
      throw new BadRequestError(
        `Invalid order status transition from '${order.status}' to '${nextStatus}'.`,
        'INVALID_STATUS_TRANSITION',
        { currentStatus: order.status, attemptedStatus: nextStatus }
      );
    }

    order.status = nextStatus;
    await order.save();

    return order;
  }
}

export const orderService = new OrderService();
