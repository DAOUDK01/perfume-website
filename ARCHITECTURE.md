# MongoDB Integration Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER BROWSER                              │
│                                                                   │
│  1. Browse fragrances page                                       │
│  2. Add items to cart (localStorage)                             │
│  3. Navigate to checkout                                         │
│  4. Fill form (name, email, address)                             │
│  5. Submit form → handleSubmit()                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ Frontend Validation
                       │ (name, email, street, city required)
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│          NEXT.JS FRONTEND (checkout/page.tsx)                    │
│                                                                   │
│  const handleSubmit = async (e) => {                             │
│    1. Get form data (FormData API)                               │
│    2. Validate required fields                                   │
│    3. Combine name, address, items                               │
│    4. POST fetch('/api/orders', orderData)                       │
│    5. Handle response                                            │
│    6. Clear cart                                                 │
│    7. Redirect to /checkout/confirmation                         │
│  }                                                                │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP POST
                       │ Body: {name, email, address, items[]}
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│        NEXT.JS API ROUTE (/api/orders/route.js)                 │
│                                                                   │
│  export async function POST(request) {                           │
│    1. Parse JSON body                                            │
│    2. Validate: name, email, items, address                      │
│    3. Calculate totalAmount from items                           │
│    4. Get ordersCollection from MongoDB                          │
│    5. Insert order document with createdAt                       │
│    6. Return 201 + {success, orderId}                            │
│  }                                                                │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ Connection call
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│     MONGODB CONNECTION UTILITY (lib/mongodb.js)                  │
│                                                                   │
│  connectToDatabase() {                                           │
│    1. Check cachedClient (reuse if exists)                       │
│    2. If not cached:                                             │
│       - Create MongoClient                                       │
│       - Connect to mongodb://localhost:27017/eeora               │
│       - Cache client and db                                      │
│    3. Return {client, db}                                        │
│  }                                                                │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ MongoDB Wire Protocol
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│            MONGODB SERVER (localhost:27017)                      │
│                                                                   │
│  Database: eeora                                                 │
│  Collection: orders                                              │
│                                                                   │
│  Insert Document:                                                │
│  {                                                                │
│    _id: ObjectId(...),      ← Auto-generated                     │
│    customerName: "John Doe",                                     │
│    email: "john@example.com",                                    │
│    address: "123 Main St...",                                    │
│    items: [{productId, name, quantity, price}],                 │
│    totalAmount: 179.98,                                          │
│    createdAt: 2024-01-17T10:30:45Z                               │
│  }                                                                │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ Return inserted ID
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│        RESPONSE: 201 Created                                     │
│                                                                   │
│  {                                                                │
│    "success": true,                                              │
│    "message": "Order saved successfully",                        │
│    "orderId": "507f1f77bcf86cd799439011"                         │
│  }                                                                │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ JSON response
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│           FRONTEND: Handle Success                               │
│                                                                   │
│  1. Clear cart from localStorage                                 │
│  2. Store order in lastOrder                                     │
│  3. Redirect to /checkout/confirmation                           │
│  4. Show success message to user                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
src/app/checkout/
├── page.tsx (Client Component)
│   ├── State: cartItems, isSubmitting, errors
│   ├── handleSubmit() → Validates → Calls API
│   ├── Form Sections:
│   │   ├── Customer Information
│   │   ├── Shipping Address
│   │   ├── Payment (demo)
│   │   └── Order Summary
│   └── Displays: Errors, Loading states, Success
│
├── confirmation/
│   └── page.tsx (Client Component)
│       └── Retrieves lastOrder from localStorage
│           Shows confirmation message
│
└── api/orders/
    └── route.js (Server Route Handler)
        ├── POST handler
        ├── Validation
        ├── Database insertion
        └── Response handling

lib/
└── mongodb.js (Module-level exported functions)
    ├── connectToDatabase()
    │   └── Creates/reuses cached MongoClient
    └── getOrdersCollection()
        └── Gets the orders collection
```

## State Management Flow

```
User Cart (localStorage)
│
├─ Item: {id, name, price, quantity}
├─ Item: {id, name, price, quantity}
└─ Item: {id, name, price, quantity}
        │
        ▼
   Checkout Page
        │
        ├─ Form Data: {name, email, address, ...}
        │
        ├─ Validation:
        │  ├─ name required?
        │  ├─ email required?
        │  ├─ address required?
        │  └─ items > 0?
        │
        └─ Success → API Request
             │
             ├─ Body: {name, email, address, items}
             │
             └─ Response:
                ├─ 201 Success → Redirect + Clear Cart
                └─ 400/500 Error → Show Error Message
```

## Error Handling Flow

```
User Submission
    │
    ├─ Frontend Validation (Client)
    │  ├─ Empty name? → Show inline error
    │  ├─ Empty email? → Show inline error
    │  ├─ Empty address? → Show inline error
    │  └─ Invalid? → Prevent submission, Show errors
    │
    └─ API Request (if valid)
       │
       ├─ API Validation (Server)
       │  ├─ Missing name? → 400 + "name required"
       │  ├─ Missing email? → 400 + "email required"
       │  ├─ Missing items? → 400 + "items required"
       │  ├─ Missing address? → 400 + "address required"
       │  └─ Invalid JSON? → 500 + "Failed to parse"
       │
       ├─ Database Operation
       │  ├─ Connection error? → 500 + "save failed"
       │  ├─ Insert error? → 500 + "save failed"
       │  └─ Success? → 201 + {success, orderId}
       │
       └─ Frontend Handling
          ├─ 201 Success → Redirect to confirmation
          └─ 4xx/5xx Error → Display error message
```

## MongoDB Query Examples

```javascript
// View all orders
db.orders.find()

// Find orders by email
db.orders.find({email: "john@example.com"})

// Get latest orders (sorted by date)
db.orders.find().sort({createdAt: -1}).limit(10)

// Count total orders
db.orders.countDocuments()

// Find orders over $100
db.orders.find({totalAmount: {$gt: 100}})

// Get unique emails
db.orders.distinct("email")

// Find orders from today
db.orders.find({
  createdAt: {
    $gte: new Date(new Date().setHours(0, 0, 0, 0))
  }
})

// Aggregate: orders by customer
db.orders.aggregate([
  {$group: {
    _id: "$email",
    count: {$sum: 1},
    total: {$sum: "$totalAmount"}
  }}
])
```

## File Dependencies

```
src/app/checkout/page.tsx
    ├── imports: Button, ScrollReveal, useEffect, useState, useRef
    ├── calls: fetch('/api/orders', ...)
    └── uses: localStorage

src/app/api/orders/route.js
    ├── imports: getOrdersCollection from lib/mongodb
    ├── calls: request.json(), insertOne()
    └── returns: Response.json()

lib/mongodb.js
    ├── imports: MongoClient from 'mongodb'
    ├── exports: connectToDatabase(), getOrdersCollection()
    └── maintains: cachedClient, cachedDb

src/app/checkout/confirmation/page.tsx
    └── reads: localStorage.getItem('lastOrder')
```

## Connection Pool Management

```
First Request
    │
    ├─ connectToDatabase()
    │  ├─ cachedClient exists? No
    │  ├─ Create new MongoClient
    │  ├─ Connect to mongodb://localhost:27017/eeora
    │  ├─ Cache client and db
    │  └─ Return {client, db}
    │
    └─ Use connection → Insert order

Second Request (same process running)
    │
    ├─ connectToDatabase()
    │  ├─ cachedClient exists? Yes ✓
    │  └─ Return cached {client, db}
    │
    └─ Reuse same connection → Much faster!
```

## What Happens When...

### ✅ User completes checkout successfully
1. Frontend validates form (name, email, street, city)
2. Frontend sends POST to /api/orders
3. API validates all fields
4. API calculates totalAmount
5. API inserts document into MongoDB
6. API returns 201 + orderId
7. Frontend clears cart
8. Frontend redirects to confirmation page
9. Order is now in MongoDB!

### ❌ User forgets to fill address
1. Frontend sees street field is empty
2. Shows validation error under field
3. Prevents form submission
4. User fills in address
5. Retry: proceeds to step above ✅

### ❌ MongoDB connection fails
1. Frontend sends valid request to API
2. API tries connectToDatabase()
3. Connection to MongoDB fails (server down)
4. Error logged to console
5. API catches error
6. API returns 500 + "Failed to save order"
7. Frontend displays error to user
8. User can retry after MongoDB is back up

## Performance Characteristics

- **Connection Pooling:** ✅ Built-in to MongoDB driver
- **Cached Connection:** ✅ Reused between requests
- **Validation:** ✅ Quick (before DB operation)
- **Insert Speed:** ✅ <100ms typical (local MongoDB)
- **Typical Response Time:** 50-200ms total
- **Database Queries:** Single insert per order (optimal)

---

This architecture ensures:
- Clean separation of concerns
- Efficient database connections
- Proper error handling
- Good user experience
- Ready for scale and additional features
