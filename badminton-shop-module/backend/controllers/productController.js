const db = require("../config/db");

// GET /api/products
// Supports optional query params: ?category=1&search=racket
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let sql = `
      SELECT p.*, c.category_name
      FROM product p
      LEFT JOIN category c ON p.category_id = c.category_id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      sql += " AND p.category_id = ?";
      params.push(category);
    }
    if (search) {
      sql += " AND p.name LIKE ?";
      params.push(`%${search}%`);
    }

    sql += " ORDER BY p.created_at DESC";

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.category_name
       FROM product p
       LEFT JOIN category c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/products  (admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, image_url, category_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Name and price are required" });
    }

    const [result] = await db.query(
      `INSERT INTO product (name, description, price, stock_quantity, image_url, category_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || null, price, stock_quantity || 0, image_url || null, category_id || null]
    );

    res.status(201).json({ success: true, data: { product_id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/products/:id  (admin)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, image_url, category_id } = req.body;

    const [result] = await db.query(
      `UPDATE product
       SET name = ?, description = ?, price = ?, stock_quantity = ?, image_url = ?, category_id = ?
       WHERE product_id = ?`,
      [name, description, price, stock_quantity, image_url, category_id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id  (admin)
exports.deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM product WHERE product_id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM category ORDER BY category_name");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
