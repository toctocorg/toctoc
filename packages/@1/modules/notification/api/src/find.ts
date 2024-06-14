//

import { next_auth_procedure } from "@1.modules/trpc";
import { z } from "zod";

//

export default next_auth_procedure
  .input(
    z.object({
      cursor: z.string().optional(),
      limit: z.number().min(1).max(10).default(10),
    }),
  )
  .query(async ({ input, ctx: { prisma, payload } }) => {
    const { cursor, limit } = input;
    const { id: owner_id } = payload.profile;
    const items = await prisma.notification.findMany({
      ...(cursor ? { cursor: { id: cursor } } : {}),
      orderBy: { created_at: "desc" },
      take: limit + 1,
      where: { owner_id },
      include: {
        inbox_message: {
          select: {
            message: {
              select: {
                author: { select: { name: true } },
                thread_id: true,
              },
            },
          },
        },
        exchange_message: {
          select: {
            exchange_id: true,
            exchange: {
              select: { owner: { select: { profile_id: true } }, title: true },
            },
            message: {
              select: {
                author: { select: { name: true } },
                thread_id: true,
              },
            },
          },
        },
      },
    });

    let prevCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop()!;
      prevCursor = nextItem.id;
    }

    return { data: items, prevCursor };
  });
