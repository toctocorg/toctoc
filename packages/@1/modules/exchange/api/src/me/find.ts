//

import { next_auth_procedure } from "@1.modules/trpc";
import type { Prisma } from "@prisma/client";
import { isAfter } from "date-fns";
import { z } from "zod";

//

export const find = next_auth_procedure
  .input(
    z.object({
      cursor: z.string().optional(),
      limit: z.number().min(1).max(10).default(10),
      search: z.string().optional(),
    }),
  )
  .query(async ({ input, ctx: { payload, prisma } }) => {
    const { profile } = payload;
    const { cursor, limit, search } = input;

    const { id: student_id } = await prisma.student.findUniqueOrThrow({
      select: { id: true },
      where: { profile_id: profile.id },
    });

    const search_where: Prisma.ExchangeWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
            {
              owner: {
                profile: { name: { contains: search, mode: "insensitive" } },
              },
            },
          ],
        }
      : {};

    const deal_releated_to_me_where: Prisma.DealWhereInput = {
      OR: [
        { participant_id: student_id },
        {
          parent: { owner_id: student_id },
        },
      ],
    };

    const find_cursor = cursor
      ? ({
          participant_per_exchange: {
            parent_id: cursor,
            participant_id: profile.id,
          },
        } as Prisma.DealWhereUniqueInput)
      : {};

    const deals = await prisma.deal.findMany({
      ...find_cursor,
      orderBy: { updated_at: "desc" },
      select: {
        parent: true,
        exchange_threads: {
          select: {
            last_seen_date: true,
            thread: { select: { updated_at: true } },
          },
          take: 1,
          where: { owner_id: student_id },
          orderBy: { thread: { updated_at: "desc" } },
        },
      },
      take: limit + 1,
      where: {
        ...deal_releated_to_me_where,
        parent: {
          is_active: true,
          OR: [{ expiry_date: { gte: new Date() } }, { expiry_date: null }],
          ...search_where,
        },
      },
      distinct: ["parent_id"],
    });

    const data = deals.map(({ parent, exchange_threads }) => {
      const {
        last_seen_date,
        thread: { updated_at },
      } = exchange_threads[0]!;
      return {
        exchange: parent,
        last_thread_update: updated_at,
        is_unread: isAfter(updated_at, last_seen_date),
      };
    });

    let next_cursor: typeof cursor | undefined = undefined;
    if (data.length > limit) {
      const next_item = data.pop()!;
      next_cursor = next_item.exchange.id;
    }

    return { data, next_cursor };
  });
