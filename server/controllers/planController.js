const planService = require('../services/planService');
const { success, error } = require('../utils/response');

const getAllPlans = async (req, res) => {
  try {
    const plans = await planService.getAllPlans();
    return success(res, { plans });
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getPlanById = async (req, res) => {
  try {
    const plan = await planService.getPlanById(req.params.id);
    return success(res, { plan });
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAllPlans, getPlanById };
