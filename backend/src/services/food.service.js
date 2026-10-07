import { Food } from '../models/Food.js';
import { Category } from '../models/Category.js';
import { NotFoundError, BadRequestError } from '../errors/AppError.js';

class FoodService {
  async getFoods(query = {}, isPublic = true) {
    const {
      categoryId,
      search,
      isAvailable,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = query;

    const filter = {};

    // For public customer queries, default to available items unless specified
    if (isPublic) {
      filter.isAvailable = isAvailable !== undefined ? isAvailable : true;
    } else if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable;
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    const [foods, total] = await Promise.all([
      Food.find(filter)
        .populate('categoryId', 'name image isActive')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      Food.countDocuments(filter),
    ]);

    return {
      foods,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber) || 1,
      },
    };
  }

  async getFoodById(id) {
    const food = await Food.findById(id).populate('categoryId', 'name image isActive');
    if (!food) {
      throw new NotFoundError(`Food item not found with ID: ${id}`, 'FOOD_NOT_FOUND');
    }
    return food;
  }

  async createFood(data) {
    // Validate category existence
    const category = await Category.findById(data.categoryId);
    if (!category) {
      throw new BadRequestError(
        `Invalid category ID: Category does not exist`,
        'INVALID_CATEGORY'
      );
    }

    const food = await Food.create(data);
    return Food.findById(food._id).populate('categoryId', 'name image isActive');
  }

  async updateFood(id, data) {
    if (data.categoryId) {
      const category = await Category.findById(data.categoryId);
      if (!category) {
        throw new BadRequestError(
          `Invalid category ID: Category does not exist`,
          'INVALID_CATEGORY'
        );
      }
    }

    const updated = await Food.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('categoryId', 'name image isActive');

    if (!updated) {
      throw new NotFoundError(`Food item not found with ID: ${id}`, 'FOOD_NOT_FOUND');
    }

    return updated;
  }

  async deleteFood(id) {
    const food = await this.getFoodById(id);
    await Food.findByIdAndDelete(id);
    return { id, name: food.name };
  }
}

export const foodService = new FoodService();
