import { SignJWT, jwtVerify } from 'jose';

// JWT secret - in production, this should be a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-replace-in-production';

if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-replace-in-production') {
  console.warn('⚠️  JWT_SECRET not set or using default value. Please set JWT_SECRET environment variable.');
}

const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Creates a signed JWT token
 * @param {Object} payload - The payload to include in the token
 * @param {string} expiresIn - Token expiration time (default: 7 days)
 * @returns {Promise<string>} - The signed JWT token
 */
export async function createJWTToken(payload, expiresIn = '7d') {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secret);
    
    return token;
  } catch (error) {
    console.error('Error creating JWT token:', error);
    throw new Error('Failed to create authentication token');
  }
}

/**
 * Verifies and decodes a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Promise<Object>} - The decoded payload if valid
 * @throws Error if token is invalid or expired
 */
export async function verifyJWTToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid or expired authentication token');
  }
}

/**
 * Checks if a JWT token is valid without throwing
 * @param {string} token - The JWT token to check
 * @returns {Promise<boolean>} - True if valid, false otherwise
 */
export async function isValidJWTToken(token) {
  try {
    await verifyJWTToken(token);
    return true;
  } catch {
    return false;
  }
}