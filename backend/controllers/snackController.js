const snackService = require("../services/snackService");
const { validationResult } = require("express-validator");

exports.getAllSnacks = async (req, res) => {
  try {
    const snacks = await snackService.getAllSnacks();
    res.json(snacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSnackById = async (req, res) => {
  try {
    const snack = await snackService.getSnackById(req.params.id);
    if (!snack) return res.status(404).json({ message: "Snack not found" });
    res.json(snack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSnack = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, ean, quantity, min_replenishment } = req.body;
    const snack = await snackService.createSnack(
      name,
      ean,
      quantity,
      min_replenishment
    );
    res.status(201).json({ message: "Snack created", snackId: snack.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSnack = async (req, res) => {
  try {
    const updated = await snackService.updateSnack(req.params.id, req.body);
    if (!updated)
      return res
        .status(404)
        .json({ message: "Snack not found or no changes made" });
    res.json({ message: "Snack updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSnack = async (req, res) => {
  try {
    const deleted = await snackService.deleteSnack(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Snack not found" });
    res.json({ message: "Snack deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLowStockSnacks = async (req, res) => {
  try {
    const lowStockSnacks = await snackService.getLowStockSnacks();
    res.json(lowStockSnacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
