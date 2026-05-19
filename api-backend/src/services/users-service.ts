import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export class UsersService {
  static async register(userData: { name: string; email: string; password: any }) {
    // 1. Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        error: 'email sudah terdaftar atau password salah',
      };
    }

    // 2. Hash password with bcrypt using Bun's built-in password utility
    const hashedPassword = await Bun.password.hash(userData.password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    // 3. Save to database
    await db.insert(users).values({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });

    return {
      success: true,
      data: 'OK',
    };
  }
}
