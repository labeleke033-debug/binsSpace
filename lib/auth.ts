
import { CONFIG } from '../config';

export async function simulateLogin(username: string, password: string) {
  console.log(`POST ${CONFIG.BACKEND_API_URL}/auth/login (Port: ${CONFIG.BACKEND_PORT})`);
  
  // 模拟网络往返
  await new Promise(res => setTimeout(res, 600));

  if (username === 'binbin' && password === 'password') {
    return {
      success: true,
      user: { id: 'u1', username: 'binbin' }
    };
  }
  return { success: false, message: '用户名或密码错误' };
}
