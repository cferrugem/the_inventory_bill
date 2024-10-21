const snackModel = require("../models/snackModel");

module.exports = {
  getAllSnacks: async () => {
    return await snackModel.getAllSnacks();
  },

  getSnackById: async (id) => {
    return await snackModel.getSnackById(id);
  },

  createSnack: async (name, ean, quantity, min_replenishment) => {
    return await snackModel.createSnack(name, ean, quantity, min_replenishment);
  },

  updateSnack: async (id, data) => {
    return await snackModel.updateSnack(id, data);
  },

  deleteSnack: async (id) => {
    return await snackModel.deleteSnack(id);
  },

  getLowStockSnacks: async () => {
    return await snackModel.getLowStockSnacks();
  },
};
