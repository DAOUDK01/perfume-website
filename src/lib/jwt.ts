import { SignJWT, jwtVerify } from 'jose';

// JWT secret - in production, this should be a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-replace-in-production';

if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-replace-in-production') {
  console.warn('⚠️  JWT_SECRET not set or using default value. Please set JWT_SECRET environment variable.');
}

const secret = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  userId: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Creates a signed JWT token
 * @param payload - The payload to include in the token
 * @param expiresIn - Token expiration time (default: 7 days)
 * @returns Promise<string> - The signed JWT token
 */
export async function createJWTToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>, 
  expiresIn: string = '7d'
): Promise<string> {
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
 * @param token - The JWT token to verify
 * @returns Promise<JWTPayload> - The decoded payload if valid
 * @throws Error if token is invalid or expired
 */
export async function verifyJWTToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret);
    
    // Validate required fields exist
    if (!payload.userId || !payload.role || !payload.email) {
      throw new Error('Invalid token payload: missing required fields');
    }
    
    return {
      userId: payload.userId as string,
      role: payload.role as string,
      email: payload.email as string,
      iat: payload.iat,
      exp: payload.exp
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid or expired authentication token');
  }
}

/**
 * Checks if a JWT token is valid without throwing
 * @param token - The JWT token to check
 * @returns Promise<boolean> - True if valid, false otherwise
 */
export async function isValidJWTToken(token: string): Promise<boolean> {
  try {
    await verifyJWTToken(token);
    return true;
  } catch {
    return false;
  }
}