import { Elysia, t } from 'elysia';
import { db } from './db';
import { items } from './db/schema';
import { eq } from 'drizzle-orm';
import { usersRoute } from './routes/users-route';

export const app = new Elysia()
  .use(usersRoute)
  .get('/', () => ({
    message: 'Hello Elysia!',
    status: 'Running'
  }))
  .group('/items', (group) =>
    group
      // GET /items - Retrieve all items
      .get('/', async () => {
        try {
          const allItems = await db.select().from(items);
          return allItems;
        } catch (error: any) {
          return { error: error.message };
        }
      })
      // GET /items/:id - Retrieve an item by ID
      .get('/:id', async ({ params: { id } }) => {
        try {
          const item = await db.select().from(items).where(eq(items.id, parseInt(id, 10)));
          if (item.length === 0) {
            return { error: 'Item not found' };
          }
          return item[0];
        } catch (error: any) {
          return { error: error.message };
        }
      })
      // POST /items - Create a new item
      .post(
        '/',
        async ({ body }) => {
          try {
            const result = await db.insert(items).values({
              name: body.name,
              description: body.description,
            });
            // MySQL returns result array with insertId
            const insertId = result[0].insertId;
            return { message: 'Item created successfully', id: insertId };
          } catch (error: any) {
            return { error: error.message };
          }
        },
        {
          body: t.Object({
            name: t.String(),
            description: t.Optional(t.String()),
          }),
        }
      )
      // PUT /items/:id - Update an item
      .put(
        '/:id',
        async ({ params: { id }, body }) => {
          try {
            await db
              .update(items)
              .set({
                name: body.name,
                description: body.description,
              })
              .where(eq(items.id, parseInt(id, 10)));
            return { message: 'Item updated successfully' };
          } catch (error: any) {
            return { error: error.message };
          }
        },
        {
          body: t.Object({
            name: t.String(),
            description: t.Optional(t.String()),
          }),
        }
      )
      // DELETE /items/:id - Delete an item
      .delete('/:id', async ({ params: { id } }) => {
        try {
          await db.delete(items).where(eq(items.id, parseInt(id, 10)));
          return { message: 'Item deleted successfully' };
        } catch (error: any) {
          return { error: error.message };
        }
      })
  )
  .listen(process.env.PORT || 3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
