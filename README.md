# Digital Menu Backend

A Node.js Express API for the Digital Menu application with real-time order management, billing, and multi-channel notifications.

## Features

- 🔐 JWT Authentication with password reset (OTP-based)
- 🏪 Multi-tenant shop management
- 📱 Real-time order notifications (Socket.IO)
- 💳 Billing and payment tracking
- 📧 Professional email notifications (Resend/Brevo/SMTP)
- ☁️ Cloudinary image management
- 🚀 Serverless deployment ready (AWS Lambda)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Required variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key
```

### 3. Setup Email Service (5 minutes)

See [QUICK_EMAIL_SETUP.md](./QUICK_EMAIL_SETUP.md) for fastest setup.

**Quick option - Resend:**
1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Add to .env: `RESEND_API_KEY=re_your_key`

**Test email:**
```bash
node test-email-service.js your-email@example.com
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on http://localhost:5000

## Email Service Setup

The application supports 3 email providers:

| Provider | Best For | Free Tier | Setup Time |
|----------|----------|-----------|------------|
| **Resend** ⭐ | Modern apps | 3,000/month | 2 min |
| **Brevo** | High volume | 9,000/month | 5 min |
| **Nodemailer** | Custom SMTP | Varies | 10 min |

**Detailed setup:** See [EMAIL_SERVICE_SETUP.md](./EMAIL_SERVICE_SETUP.md)

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
