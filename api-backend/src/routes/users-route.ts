import { Elysia, t } from 'elysia';
import { UsersService } from '../services/users-service';

export const usersRoute = new Elysia()
  .post(
    '/api/users',
    async ({ body }) => {
      const result = await UsersService.register(body);
      
      if (!result.success) {
        return {
          error: result.error,
          eror: result.error, // Support both Indonesian spelling "eror" and standard "error"
        };
      }
      
      return {
        data: result.data,
      };
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
    }
  );
