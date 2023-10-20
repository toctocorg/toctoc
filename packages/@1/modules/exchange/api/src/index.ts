//

import { procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const exchange_api_router = router({
  by_id: procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return await prisma.exchange.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          owner: { include: { profile: true } },
          participants: true,
        },
      });
    }),

  find: procedure
    .input(
      z.object({
        category: z.string().optional(),
        cursor: z.date().optional(),
        limit: z.number().min(1).max(10).default(10),
        search: z.string().optional(),
      }),
    )
    .query(
      async ({
        input: { category, cursor, limit, search },
        ctx: { prisma },
      }) => {
        const orderBy: NonNullable<
          Parameters<typeof prisma.exchange.findFirst>[0]
        >["orderBy"] = { created_at: "asc" };
        const items = await prisma.exchange.findMany({
          ...(cursor ? { cursor: { created_at: cursor } } : {}),
          orderBy,
          take: limit + 1,

          where: {
            OR: [
              { title: { contains: search ?? "" } },
              { description: { contains: search ?? "" } },
            ],

            ...(category ? { category: { slug: category } } : {}),
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem!.created_at;
        }

        return { data: items, nextCursor };
      },
    ),
});

export default exchange_api_router;
export type ExchangeApiRouter = typeof exchange_api_router;
