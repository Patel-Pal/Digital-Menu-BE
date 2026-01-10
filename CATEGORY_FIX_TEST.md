# Quick Test with Valid ObjectId

## 1. First, create a shop to get a valid shopId:
```bash
curl -X POST http://localhost:5000/api/shops \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Restaurant",
    "description": "Test description",
    "address": "123 Test St"
  }'
```

## 2. Use the returned shop _id in category creation:
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Appetizers",
    "description": "Delicious starters",
    "icon": "🥗",
    "order": 1,
    "shopId": "SHOP_ID_FROM_STEP_1"
  }'
```

## Alternative: Use existing shop ID
If you already have a shop, get the shop ID:
```bash
curl -X GET http://localhost:5000/api/shops \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Then use that shop ID in the category creation.
