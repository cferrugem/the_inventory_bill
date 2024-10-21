const pool = require("../config/database");

module.exports = {
  getAllSnacks: async () => {
    const query = "SELECT * FROM snacks WHERE deleted_at IS NULL";
    const { rows } = await pool.query(query);
    return rows;
  },

  getSnackById: async (id) => {
    const query = "SELECT * FROM snacks WHERE id = $1 AND deleted_at IS NULL";
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  createSnack: async (name, ean, quantity, min_replenishment) => {
    const query =
      "INSERT INTO snacks (name, ean, quantity, min_replenishment, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id";
    const values = [name, ean, quantity, min_replenishment];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  updateSnack: async (id, data) => {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.name) {
      fields.push(`name = $${idx}`);
      values.push(data.name);
      idx++;
    }
    if (data.ean) {
      fields.push(`ean = $${idx}`);
      values.push(data.ean);
      idx++;
    }
    if (data.quantity !== undefined) {
      fields.push(`quantity = $${idx}`);
      values.push(data.quantity);
      idx++;
    }
    if (data.min_replenishment !== undefined) {
      fields.push(`min_replenishment = $${idx}`);
      values.push(data.min_replenishment);
      idx++;
    }
    if (fields.length === 0) return null;

    values.push(id);

    const query = `UPDATE snacks SET ${fields.join(
      ", "
    )} WHERE id = $${idx} AND deleted_at IS NULL`;
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  },

  deleteSnack: async (id) => {
    const query =
      "UPDATE snacks SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL";
    const values = [id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  },

  getLowStockSnacks: async () => {
    const query =
      "SELECT * FROM snacks WHERE quantity < min_replenishment AND deleted_at IS NULL";
    const { rows } = await pool.query(query);
    return rows;
  },
};
