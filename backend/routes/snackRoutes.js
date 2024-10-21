const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const snackController = require("../controllers/snackController");

router.get("/", snackController.getAllSnacks);
router.get("/low-stock", snackController.getLowStockSnacks);
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Snack name is required"),
    body("ean")
      .notEmpty()
      .isLength({ min: 13, max: 13 })
      .withMessage("EAN must be 13 characters"),
    body("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer"),
    body("min_replenishment")
      .isInt({ min: 0 })
      .withMessage("Minimum replenishment must be a non-negative integer"),
  ],
  snackController.createSnack
);
router.get("/:id", snackController.getSnackById);
router.put("/:id", snackController.updateSnack);
router.delete("/:id", snackController.deleteSnack);

module.exports = router;
