
// This would normally use 'jsonwebtoken' and 'bcryptjs' in a real Node environment
// For this prototype, we simulate the logic used by the Next.js backend

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-zuobin-wang';

export interface JWTPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

/**
 * In a real Next.js app, this would be in an API route:
 * 1. const isValid = await bcrypt.compare(password, user.passwordHash);
 * 2. const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
 * 3. res.setHeader('Set-Cookie', serialize('auth_token', token, { ...options }));
 */

export async function simulateLogin(username: string, password: string) {
  // Simulate database lookup
  if (username === 'binbin' && password === 'password') {
    return {
      success: true,
      user: { id: 'u1', username: 'binbin' }
    };
  }
  return { success: false, message: '用户名或密码错误' };
}
