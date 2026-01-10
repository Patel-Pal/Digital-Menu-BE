# Category API Test Commands

## 1. Create Category
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Appetizers",
    "description": "Delicious starters",
    "icon": "🥗",
    "order": 1,
    "shopId": "YOUR_SHOP_ID"
  }'
```

## 2. Get Categories for Shop (Public)
```bash
curl -X GET http://localhost:5000/api/categories/shop/YOUR_SHOP_ID
```

## 3. Get All Categories for Management (Private)
```bash
curl -X GET http://localhost:5000/api/categories/manage/YOUR_SHOP_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 4. Update Category
```bash
curl -X PUT http://localhost:5000/api/categories/CATEGORY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Updated Appetizers",
    "description": "Updated description",
    "icon": "🍽️",
    "order": 2,
    "isActive": true
  }'
```

## 5. Toggle Category Status
```bash
curl -X PATCH http://localhost:5000/api/categories/CATEGORY_ID/toggle \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 6. Delete Category
```bash
curl -X DELETE http://localhost:5000/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## API Endpoints Summary:
- `GET /api/categories/shop/:shopId` - Get active categories (Public)
- `GET /api/categories/manage/:shopId` - Get all categories (Private)
- `POST /api/categories` - Create category (Private)
- `PUT /api/categories/:id` - Update category (Private)
- `PATCH /api/categories/:id/toggle` - Toggle isActive status (Private)
- `DELETE /api/categories/:id` - Delete category (Private)
