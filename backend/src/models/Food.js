import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Food description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    image: {
      type: String,
      required: [true, 'Food image URL is required'],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
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

foodSchema.index({ name: 'text', description: 'text' });

export const Food = mongoose.model('Food', foodSchema);
