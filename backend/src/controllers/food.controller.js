import { foodService } from '../services/food.service.js';
import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/statusCodes.js';

class FoodController {
  // Public
  async getPublicFoods(req, res, next) {
    try {
      const { foods, pagination } = await foodService.getFoods(req.query, true);
      return sendPaginated(res, foods, pagination, 'Foods retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin
  async getAllFoods(req, res, next) {
    try {
      const { foods, pagination } = await foodService.getFoods(req.query, false);
      return sendPaginated(res, foods, pagination, 'All foods retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getFoodById(req, res, next) {
    try {
      const food = await foodService.getFoodById(req.params.id);
      return sendSuccess(res, food, 'Food item retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createFood(req, res, next) {
    try {
      const food = await foodService.createFood(req.body);
      return sendSuccess(
        res,
        food,
        'Food item created successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  async updateFood(req, res, next) {
    try {
      const food = await foodService.updateFood(req.params.id, req.body);
      return sendSuccess(res, food, 'Food item updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteFood(req, res, next) {
    try {
      const result = await foodService.deleteFood(req.params.id);
      return sendSuccess(res, result, 'Food item deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const foodController = new FoodController();
