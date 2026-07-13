# Badminton Club — Shop Module

Full-stack shop module built with React + Node.js/Express + MySQL, matching your wireframe (Home → Products → Product Detail → Cart → Checkout → Order Success → My Orders → Order Details) plus an Admin Dashboard.

## Folder structure

badminton-shop-module/
├── database/
│   └── schema.sql          ← run this first, creates all tables + seed data
├── backend/
│   ├── server.js           ← Express entry point
│   ├── .env.example        ← copy to .env and fill in your MySQL password
│   ├── config/db.js        ← MySQL connection pool
│   ├── routes/              ← URL → controller mapping
│   ├── controllers/         ← business logic
│   └── middleware/errorMiddleware.js
└── frontend/
    ├── src/
    │   ├── pages/            ← Home, Products, ProductDetails, Cart, Checkout,
    │   │                        OrderSuccess, Orders, OrderDetails, AdminDashboard
    │   ├── components/       ← BottomNav, StarRating
    │   ├── context/          ← CartContext (global cart state)
    │   ├── api/client.js     ← all Axios calls in one place
    │   └── styles/global.css ← matches wireframe colors (purple/green)
    └── vite.config.js        ← proxies /api → localhost:5000 
```

Setup in VS Code — step by step

 1. Install MySQL and create the database

Open MySQL Workbench (or CLI) and run the script:

```bash
mysql -u root -p < database/schema.sql
```

This creates the `badminton_shop` database, all 8 tables (category, product, users, cart, cart_item, orders, order_item, payment), and seeds it with the 6 products + 5 categories from your wireframe.

### 2. Start the backend

Open a VS Code terminal:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your MySQL password:

```
DB_PASSWORD=your_mysql_password_here
```

Then:

```bash
npm install
npm run dev
```

You should see:
```
Server running on http://localhost:5000
MySQL connected successfully
```

Test it works by opening `http://localhost:5000/api/products` in your browser — you should see JSON with the 6 seeded products.

### 3. Start the frontend

Open a **second** VS Code terminal (keep the backend running):

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` — you'll see the Shop Home screen. Vite proxies all `/api/*` calls to your backend on port 5000 automatically (configured in `vite.config.js`), so you don't need CORS workarounds.

### 4. Try the full flow

1. **Home** → tap a category or "Shop Now"
2. **Products** → tap "Add to Cart" or tap a product card
3. **Product Detail** → choose quantity, "Add to Cart" or "Buy Now"
4. **Cart** → adjust quantities, "Proceed to Checkout"
5. **Checkout** → pick a payment method, "Place Order"
6. **Order Success** → "View Orders"
7. **My Orders** → filter by status tab, "View Details"
8. **Order Details** → see full breakdown, cancel if still Pending

Admin product management lives at `http://localhost:3000/admin`.

## Important notes before you go further

- **Authentication is not implemented.** All pages currently use a hardcoded `CURRENT_USER_ID = 1` (set in `frontend/src/context/CartContext.jsx`), matching the demo user seeded in `schema.sql`. Before this goes anywhere near production, you need real login/session handling — otherwise every visitor shares one cart and one order history.
- **Product images** are referenced by `image_url` (e.g. `/images/yonex-nanoflare-700.jpg`) but no actual image files are included. Either add a `frontend/public/images/` folder with real product photos, or point `image_url` at hosted image URLs.
- **Payment is not actually processed.** "Online Payment (Card)" and "Mobile Payment" just record the choice — no Stripe/PayHere integration yet. Cash on Delivery works end-to-end since no external gateway is needed. See Step 12 in your original PDF roadmap for adding PayHere.
- **Discount is hardcoded** at a flat Rs. 1,000 in `Cart.jsx` and `Checkout.jsx` to match the wireframe numbers. Replace with a real coupon/promo system when ready.
- The `users` table in `schema.sql` is minimal. If your main Badminton Club System already has its own members/users table, drop this one and point the `cart.user_id` / `orders.user_id` foreign keys at your existing table instead.

## What to build next

Pick whichever you need — I can generate any of these on request:
- Login / registration system (so `CURRENT_USER_ID` becomes dynamic)
- Real PayHere or Stripe payment integration
- Image upload for the Admin Dashboard (instead of typing a URL)
- React Native versions of these same screens for your mobile app
- Order status management UI for admins (Pending → Processing → Shipped → Delivered)  
