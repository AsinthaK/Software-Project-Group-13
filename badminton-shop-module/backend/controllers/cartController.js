const db = require("../config/db");

// Helper: get or create a cart for a user
async function getOrCreateCart(userId) {
  const [existing] = await db.query("SELECT * FROM cart WHERE user_id = ?", [userId]);
  if (existing.length > 0) return existing[0].cart_id;

  const [result] = await db.query("INSERT INTO cart (user_id) VALUES (?)", [userId]);
  return result.insertId;
}

// GET /api/cart/:userId
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartId = await getOrCreateCart(userId);

    const [items] = await db.query(
      `SELECT ci.cart_item_id, ci.quantity, p.product_id, p.name, p.price, p.image_url, p.stock_quantity
       FROM cart_item ci
       JOIN product p ON ci.product_id = p.product_id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      success: true,
      data: {
        cart_id: cartId,
        items,
        item_count: items.length,
        subtotal,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/cart/add
// body: { user_id, product_id, quantity }
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ success: false, message: "user_id and product_id are required" });
    }

    const qty = quantity || 1;
    const cartId = await getOrCreateCart(user_id);

    // Check if item already in cart -> increment, else insert
    const [existing] = await db.query(
      "SELECT * FROM cart_item WHERE cart_id = ? AND product_id = ?",
      [cartId, product_id]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE cart_item SET quantity = quantity + ? WHERE cart_item_id = ?",
        [qty, existing[0].cart_item_id]
      );
    } else {
      await db.query(
        "INSERT INTO cart_item (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cartId, product_id, qty]
      );
    }

    res.status(201).json({ success: true, message: "Item added to cart" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/cart/item/:id
// body: { quantity }
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const [result] = await db.query(
      "UPDATE cart_item SET quantity = ? WHERE cart_item_id = ?",
      [quantity, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.json({ success: true, message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/cart/item/:id
exports.removeCartItem = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM cart_item WHERE cart_item_id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
