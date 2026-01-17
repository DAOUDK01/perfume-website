# MongoDB Integration Guide

## Overview
MongoDB integration has been added to the perfume website to store customer orders when they complete the checkout flow.

## Database Configuration

**Connection String:** `mongodb://localhost:27017/eeora`
**Database:** `eeora`
**Collection:** `orders`

## Project Structure

### New Files Created

1. **[lib/mongodb.js](lib/mongodb.js)**
   - Reusable MongoDB connection utility
   - Implements connection pooling for performance
   - Single shared connection instance cached at module level
   - Works seamlessly with Next.js App Router

2. **[src/app/api/orders/route.js](src/app/api/orders/route.js)**
   - API endpoint for saving orders: `POST /api/orders`
   - Validates required fields: name, email, address, items
   - Automatically adds `createdAt` timestamp
   - Returns success/error responses

### Modified Files

1. **[src/app/checkout/page.tsx](src/app/checkout/page.tsx)**
   - Updated form to collect shipping address fields with proper `name` attributes
   - Added form field validation for street, city
   - Modified `handleSubmit` to:
     - Collect customer name, email, and full address
     - Combine items data with quantities and prices
     - Send POST request to `/api/orders`
     - Handle success and error responses
     - Show error messages to user if submission fails

## Database Schema

### Orders Collection

```javascript
{
  customerName: String,           // Full name (first + last name)
  email: String,                  // Customer email address
  address: String,                // Full shipping address
  items: [
    {
      productId: String,          // Unique product ID
      name: String,               // Product name
      quantity: Number,           // Quantity ordered
      price: Number               // Price per unit
    }
  ],
  totalAmount: Number,            // Total order amount
  createdAt: Date                 // Order creation timestamp
}
```

## Form Fields

The checkout form now collects:

### Customer Information
- First Name (required)
- Last Name (optional)
- Email Address (required)
- Phone Number (optional)

### Shipping Address (required)
- Street Address
- City
- State
- ZIP Code
- Country

## API Endpoint

### POST /api/orders

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main St, San Francisco, CA 94102",
  "items": [
    {
      "id": "product-123",
      "name": "Perfume Name",
      "quantity": 2,
      "price": 89.99
    }
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order saved successfully",
  "orderId": "507f1f77bcf86cd799439011"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message describing what went wrong"
}
```

## Validation

The API validates the following:
- `name` is required and non-empty
- `email` is required and non-empty
- `items` array must have at least one item
- `address` is required and non-empty
- `totalAmount` must be greater than zero

## Flow

1. User fills out checkout form with personal and address information
2. User adds items to cart from the fragrances page
3. User clicks "Complete Purchase"
4. Frontend validates required fields (name, email, street, city)
5. Frontend sends POST request to `/api/orders` with order data
6. API validates all fields and data
7. API inserts order into MongoDB `orders` collection
8. API returns success response with order ID
9. Frontend clears cart and redirects to confirmation page
10. Confirmation page shows success message

## Error Handling

- **Frontend validation:** Shows field-specific error messages
- **API validation:** Returns 400 status with error description
- **Database errors:** Returns 500 status with generic error message
- **Network errors:** Caught and displayed to user

## Security Considerations

✓ No sensitive card information is stored (demo mode)
✓ No authentication required (as per requirements)
✓ Input validation on both frontend and API
✓ Proper HTTP status codes
✓ Error messages are user-friendly but not revealing

## UX Features

✓ White background only
✓ Text-based form with minimal styling
✓ Plain text error messages
✓ Simple success confirmation on new page
✓ Auto-focus on email field for better UX
✓ Real-time field validation

## Getting Started

1. **Ensure MongoDB is running:**
   ```bash
   mongod --dbpath <path-to-data>
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Test the flow:**
   - Navigate to fragrances page
   - Add items to cart
   - Go to checkout
   - Fill out all required fields
   - Click "Complete Purchase"
   - Check MongoDB for the order in the `eeora.orders` collection

## Future Enhancements

- Add payment processing (Stripe/PayPal integration)
- Add order tracking with order numbers
- Send confirmation emails to customers
- Add order history for authenticated users
- Implement order status updates
- Add refund/return management

## Dependencies

- `mongodb` - Official MongoDB Node.js driver v6.3.0+
- No ORM or additional database libraries required
