-- ============================================================
-- BADMINTON CLUB MANAGEMENT SYSTEM — SHOP MODULE
-- Database Schema (MySQL)
-- ============================================================

CREATE DATABASE IF NOT EXISTS badminton_shop;
USE badminton_shop;

-- ------------------------------------------------------------
-- 1. CATEGORY
-- ------------------------------------------------------------
CREATE TABLE category (
    category_id   INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. PRODUCT
-- ------------------------------------------------------------
CREATE TABLE product (
    product_id     INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(150) NOT NULL,
    description    TEXT,
    price          DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url      VARCHAR(255), 
    rating         DECIMAL(2,1) DEFAULT 0.0,
    review_count   INT DEFAULT 0,
    category_id    INT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 3. USERS (referenced by cart/orders — minimal version)
--    NOTE: If your main Badminton Club System already has a
--    `users` or `members` table, skip this and point the
--    foreign keys below at your existing table instead.
-- ------------------------------------------------------------
CREATE TABLE users (
    user_id    INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    phone      VARCHAR(20),
    password   VARCHAR(255) NOT NULL,
    address    VARCHAR(255),
    city       VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 4. CART
-- ------------------------------------------------------------
CREATE TABLE cart (
    cart_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 5. CART ITEM
-- ------------------------------------------------------------
CREATE TABLE cart_item (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id      INT NOT NULL,
    product_id   INT NOT NULL,
    quantity     INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id)
);

-- ------------------------------------------------------------
-- 6. ORDERS
-- ------------------------------------------------------------
CREATE TABLE orders (
    order_id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    order_date      DATETIME DEFAULT CURRENT_TIMESTAMP,
    subtotal        DECIMAL(10,2) NOT NULL,
    discount        DECIMAL(10,2) DEFAULT 0,
    shipping        DECIMAL(10,2) DEFAULT 0,
    total_amount    DECIMAL(10,2) NOT NULL,
    status          ENUM('Pending','Paid','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
    delivery_name   VARCHAR(100),
    delivery_address VARCHAR(255),
    delivery_phone  VARCHAR(20),
    payment_method  VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 7. ORDER ITEM
-- ------------------------------------------------------------
CREATE TABLE order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id      INT NOT NULL,
    product_id    INT NOT NULL,
    quantity      INT NOT NULL,
    price         DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- ------------------------------------------------------------
-- 8. PAYMENT
-- ------------------------------------------------------------
CREATE TABLE payment (
    payment_id     INT AUTO_INCREMENT PRIMARY KEY,
    order_id       INT NOT NULL,
    amount         DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('Pending','Completed','Failed','Refunded') DEFAULT 'Pending',
    paid_at        TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- ============================================================
-- SEED DATA — matches the wireframe screens exactly
-- ============================================================

INSERT INTO category (category_name) VALUES
('Rackets'), ('Shoes'), ('Shuttlecocks'), ('Bags'), ('Accessories');

INSERT INTO product (name, description, price, stock_quantity, image_url, rating, review_count, category_id) VALUES
('Yonex Nanoflare 700', 'High-performance racket for aggressive players. Enhanced speed and control.', 35000.00, 15, '/images/yonex-nanoflare-700.jpg', 4.8, 120, 1),
('Victor Thruster K 15', 'Balanced power and control for intermediate to advanced players.', 28500.00, 10, '/images/victor-thruster-k15.jpg', 4.6, 98, 1),
('Li-Ning Windstorm 72', 'Lightweight frame built for fast attacking play.', 18000.00, 20, '/images/lining-windstorm-72.jpg', 4.5, 76, 1),
('Apacs Finapi 232', 'Affordable all-round racket great for beginners.', 14000.00, 25, '/images/apacs-finapi-232.jpg', 4.4, 54, 1),
('Li-Ning Shoe Ultra', 'Cushioned court shoes with excellent grip and ankle support.', 12500.00, 18, '/images/lining-shoe-ultra.jpg', 4.7, 64, 2),
('Yonex Mavis 350', 'Durable nylon shuttlecocks, pack of 6, medium speed.', 1800.00, 50, '/images/yonex-mavis-350.jpg', 4.6, 210, 3);

-- Demo user (password should be hashed in real app — see auth note in README)
INSERT INTO users (name, email, phone, password, address, city) VALUES
('John D. Perera', 'john.perera@example.com', '0771234567', '$2b$10$placeholderHashedPassword', '123, KDU Road, Ratmalana', 'Colombo, Sri Lanka');
   