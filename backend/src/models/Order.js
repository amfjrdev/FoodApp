import mongoose from 'mongoose';
import { ORDER_STATUS } from '../constants/orderStatus.js';

const orderItemSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: false,
    },
    foodNameSnapshot: {
      type: String,
      required: [true, 'Food name snapshot is required'],
      trim: true,
    },
    unitPriceSnapshot: {
      type: Number,
      required: [true, 'Unit price snapshot is required'],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Item subtotal is required'],
      min: 0,
    },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: 0,
    },
    deliveryFee: {
      type: Number,
      required: [true, 'Delivery fee is required'],
      min: 0,
    },
    total: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'Order must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);
