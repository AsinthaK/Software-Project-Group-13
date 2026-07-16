const db = require("../config/db");

const SHIPPING_FLAT_RATE = 500;

// POST /api/orders
// body: { user_id, delivery_name, delivery_address, delivery_phone, payment_method, discount }
// Creates an order FROM the user's current cart, then clears the cart.
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { user_id, delivery_name, delivery_address, delivery_phone, payment_method, discount } = req.body;

    if (!user_id || !delivery_address || !payment_method) {
      return res.status(400).json({ success: false, message: "Missing required checkout fields" });
    }

    await connection.beginTransaction();

    // 1. Get the user's cart and items
    const [carts] = await connection.query("SELECT cart_id FROM cart WHERE user_id = ?", [user_id]);
    if (carts.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    const cartId = carts[0].cart_id;

    const [items] = await connection.query(
      `SELECT ci.product_id, ci.quantity, p.price, p.stock_quantity, p.name
       FROM cart_item ci JOIN product p ON ci.product_id = p.product_id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    if (items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2. Verify stock availability
    for (const item of items) {
      if (item.stock_quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`,
        });
      }
    }

    // 3. Calculate totals
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discountAmt = discount || 0;
    const shipping = SHIPPING_FLAT_RATE;
    const total = subtotal - discountAmt + shipping;

    // 4. Create the order
    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (user_id, subtotal, discount, shipping, total_amount, status, delivery_name, delivery_address, delivery_phone, payment_method)
       VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?)`,
      [user_id, subtotal, discountAmt, shipping, total, delivery_name, delivery_address, delivery_phone, payment_method]
    );
    const orderId = orderResult.insertId;

    // 5. Create order_item rows + decrement stock
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_item (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
      await connection.query(
        `UPDATE product SET stock_quantity = stock_quantity - ? WHERE product_id = ?`,
        [item.quantity, item.product_id]
      );
    }

    // 6. Create payment record
    await connection.query(
      `INSERT INTO payment (order_id, amount, payment_method, payment_status)
       VALUES (?, ?, ?, ?)`,
      [orderId, total, payment_method, payment_method === "Cash on Delivery" ? "Pending" : "Pending"]
    );

    // 7. Clear the cart
    await connection.query("DELETE FROM cart_item WHERE cart_id = ?", [cartId]);

    await connection.commit();

    res.status(201).json({
      success: true,
      data: { order_id: orderId, total_amount: total },
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
};

// GET /api/orders/user/:userId
// Optional ?status=Pending filter
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let sql = "SELECT * FROM orders WHERE user_id = ?";
    const params = [userId];

    if (status && status !== "All") {
      sql += " AND status = ?";
      params.push(status);
    }
    sql += " ORDER BY order_date DESC";

    const [orders] = await db.query(sql, params);

    // Attach item count + thumbnail previews for each order
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT p.image_url FROM order_item oi
         JOIN product p ON oi.product_id = p.product_id
         WHERE oi.order_id = ? LIMIT 3`,
        [order.order_id]
      );
      const [[{ total_items }]] = await db.query(
        `SELECT COUNT(*) as total_items FROM order_item WHERE order_id = ?`,
        [order.order_id]
      );
      order.thumbnails = items.map((i) => i.image_url);
      order.total_items = total_items;
    }

    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders WHERE order_id = ?", [req.params.id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const [items] = await db.query(
      `SELECT oi.*, p.name, p.image_url FROM order_item oi
       JOIN product p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/orders/:id/status  (admin)
// body: { status }
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const [result] = await db.query("UPDATE orders SET status = ? WHERE order_id = ?", [
      status,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/orders/:id/cancel  (customer)
exports.cancelOrder = async (req, res) => {
  try {
    const [orders] = await db.query("SELECT status FROM orders WHERE order_id = ?", [req.params.id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (["Shipped", "Delivered"].includes(orders[0].status)) {
      return res.status(400).json({ success: false, message: "Order can no longer be cancelled" });
    }

    await db.query("UPDATE orders SET status = 'Cancelled' WHERE order_id = ?", [req.params.id]);
    res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
