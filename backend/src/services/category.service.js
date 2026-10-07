import { Category } from '../models/Category.js';
import { Food } from '../models/Food.js';
import { NotFoundError, BadRequestError, ConflictError } from '../errors/AppError.js';

class CategoryService {
  async getActiveCategories() {
    return Category.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
  }

  async getAllCategories() {
    return Category.find().sort({ sortOrder: 1, createdAt: 1 });
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError(`Category not found with ID: ${id}`, 'CATEGORY_NOT_FOUND');
    }
    return category;
  }

  async createCategory(data) {
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') },
    });
    if (existing) {
      throw new ConflictError(`Category '${data.name}' already exists`, 'DUPLICATE_CATEGORY');
    }

    return Category.create(data);
  }

  async updateCategory(id, data) {
    if (data.name) {
      const existing = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') },
      });
      if (existing) {
        throw new ConflictError(`Category '${data.name}' already exists`, 'DUPLICATE_CATEGORY');
      }
    }

    const updated = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new NotFoundError(`Category not found with ID: ${id}`, 'CATEGORY_NOT_FOUND');
    }

    return updated;
  }

  async deleteCategory(id) {
    const category = await this.getCategoryById(id);

    // Safe deletion rule: verify no foods are linked to this category
    const associatedFoodsCount = await Food.countDocuments({ categoryId: id });
    if (associatedFoodsCount > 0) {
      throw new BadRequestError(
        `Cannot delete category '${category.name}' because it contains ${associatedFoodsCount} active food item(s). Please delete or reassign them first.`,
        'CATEGORY_HAS_FOODS'
      );
    }

    await Category.findByIdAndDelete(id);
    return { id, name: category.name };
  }
}

export const categoryService = new CategoryService();
