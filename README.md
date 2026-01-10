# Digital Menu Backend

A Node.js Express API for the Digital Menu application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your configuration:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/digital-menu
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Shops
- `GET /api/shops` - Get all shops
- `GET /api/shops/:id` - Get single shop
- `POST /api/shops` - Create shop (Shopkeeper/Admin)
- `PUT /api/shops/:id` - Update shop (Owner/Admin)
- `DELETE /api/shops/:id` - Delete shop (Owner/Admin)

### Menus
- `GET /api/menus/shop/:shopId` - Get menu by shop ID
- `POST /api/menus` - Create/Update menu (Shopkeeper/Admin)
- `POST /api/menus/:menuId/items` - Add menu item (Shopkeeper/Admin)
- `PUT /api/menus/:menuId/items/:itemId` - Update menu item (Shopkeeper/Admin)
- `DELETE /api/menus/:menuId/items/:itemId` - Delete menu item (Shopkeeper/Admin)

### Admin
- `GET /api/admin/stats` - Get dashboard stats (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/:id/status` - Update user status (Admin)

## Project Structure

```
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── shopController.js
│   ├── menuController.js
│   └── adminController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Shop.js
│   └── Menu.js
├── routes/
│   ├── auth.js
│   ├── shops.js
│   ├── menus.js
│   └── admin.js
└── server.js
```
