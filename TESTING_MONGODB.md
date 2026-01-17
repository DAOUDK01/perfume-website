# Testing the MongoDB Integration

## Prerequisites

1. **MongoDB Running:**
   - Make sure MongoDB is running on `localhost:27017`
   - Default database `eeora` will be created automatically

   Start MongoDB:
   ```bash
   mongod --dbpath <path-to-data-directory>
   ```

2. **Development Server Running:**
   ```bash
   npm run dev
   ```
   Server will be at `http://localhost:3000`

## Manual Testing Steps

### 1. Test Order Creation via UI

1. Navigate to `http://localhost:3000/fragrances`
2. Click "Buy Now" on any fragrance
3. Go to `http://localhost:3000/checkout`
4. Fill in all required fields:
   - **First Name** (required)
   - **Email** (required)
   - **Street Address** (required)
   - **City** (required)
   - **State**
   - **ZIP Code**
   - **Country**
5. Click "Complete Purchase"
6. You should be redirected to confirmation page

### 2. Verify Order in MongoDB

Open MongoDB shell:

```bash
mongosh mongodb://localhost:27017/eeora
```

Check the orders collection:

```javascript
// View all orders
db.orders.find().pretty()

// View latest order
db.orders.findOne({}, {sort: {createdAt: -1}})

// Count total orders
db.orders.countDocuments()

// Find orders by email
db.orders.find({email: "user@example.com"}).pretty()
```

### 3. Test API Directly

Use curl or Postman to test the API:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, San Francisco, CA 94102",
    "items": [
      {
        "id": "perfume-1",
        "name": "Test Perfume",
        "quantity": 2,
        "price": 89.99
      }
    ]
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Order saved successfully",
  "orderId": "507f1f77bcf86cd799439011"
}
```

## Error Testing

### Test Missing Name

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "test@example.com",
    "address": "123 Main St",
    "items": [{"id": "1", "name": "Test", "quantity": 1, "price": 50}]
  }'
```

Expected: `400` error - "Customer name is required"

### Test Missing Items

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "test@example.com",
    "address": "123 Main St",
    "items": []
  }'
```

Expected: `400` error - "Order must contain at least one item"

### Test Invalid JSON

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d 'invalid json'
```

Expected: `500` error - "Failed to save order"

## Debugging

### Check MongoDB Connection

If you get connection errors in the console:

1. Verify MongoDB is running: `mongosh mongodb://localhost:27017`
2. Check connection string in `lib/mongodb.js`
3. Look for console logs in your Next.js dev server

### Check API Logs

The API logs errors to the console:
- Connection errors
- Validation errors
- Database insertion errors

Watch the terminal where you ran `npm run dev`

### Check Browser Console

Frontend errors appear in:
1. Browser Developer Tools (F12)
2. Network tab to see API responses
3. Console tab for JavaScript errors

## Example Order Document

Once created, an order in MongoDB looks like:

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "customerName": "John Doe",
  "email": "john@example.com",
  "address": "123 Main St, San Francisco, CA 94102",
  "items": [
    {
      "productId": "eo-001",
      "name": "Moonlit Jasmine",
      "quantity": 2,
      "price": 89.99
    }
  ],
  "totalAmount": 179.98,
  "createdAt": ISODate("2024-01-17T10:30:45.123Z")
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Ensure MongoDB is running on localhost:27017 |
| Database not found | MongoDB creates databases automatically on first write |
| 500 error on order submission | Check browser console and server logs for details |
| Order not appearing in MongoDB | Verify the `/api/orders` endpoint returned success |
| Form won't submit | Check that all required fields are filled in |

## Notes

- Orders are saved to the `orders` collection in the `eeora` database
- Each order gets a unique `_id` from MongoDB automatically
- The `createdAt` field is set by the server (not frontend)
- No card information is stored (demo mode)
- Cart is cleared from localStorage after successful order
