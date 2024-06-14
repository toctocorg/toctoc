//

import { next_auth_procedure, router } from "@1.modules/trpc";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { thread } from "./thread";

const inbox_api_router = router({
  //

  talk_to: next_auth_procedure
    .input(z.string())
    .mutation(
      async ({ ctx: { payload, prisma }, input: recipient_profile_id }) => {
        const { profile } = payload;
        const { id: student_id } = await prisma.student.findUniqueOrThrow({
          select: { id: true },
          where: { profile_id: profile.id },
        });
        const existing_inbox_thread = await prisma.inboxThread.findFirst({
          where: {
            owner_id: student_id,
            thread: { participants: { some: { id: recipient_profile_id } } },
          },
        });

        if (existing_inbox_thread) return existing_inbox_thread;

        const { id: recipient_student_id } =
          await prisma.student.findUniqueOrThrow({
            select: { id: true },
            where: { profile_id: recipient_profile_id },
          });

        await prisma.thread.create({
          data: {
            participants: {
              connect: [{ id: profile.id }, { id: recipient_profile_id }],
            },
            inbox_threads: {
              createMany: {
                data: [
                  { owner_id: student_id },
                  { owner_id: recipient_student_id },
                ],
              },
            },
          },
        });
        return prisma.inboxThread.findFirstOrThrow({
          where: {
            owner_id: student_id,
            thread: { participants: { some: { id: recipient_profile_id } } },
          },
        });
      },
    ),

  //

  find: next_auth_procedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(10).default(5),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx: { payload, prisma }, input }) => {
      const { profile } = payload;
      const { cursor, limit, search } = input;
      const { id: student_id } = await prisma.student.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      const search_where: Prisma.InboxThreadWhereInput = search
        ? {
            OR: [
              {
                thread: {
                  participants: {
                    some: { name: { contains: search, mode: "insensitive" } },
                  },
                },
              },
              {
                thread: {
                  messages: {
                    some: {
                      content: { contains: search, mode: "insensitive" },
                    },
                  },
                },
              },
            ],
          }
        : {};
      const data = await prisma.inboxThread.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: [{ thread: { updated_at: "desc" } }],
        include: { thread: { select: { id: true, updated_at: true } } },
        take: limit + 1,
        where: { owner_id: student_id, ...search_where },
      });

      let next_cursor: typeof cursor | undefined = undefined;
      if (data.length > limit) {
        const next_item = data.pop()!;
        next_cursor = next_item.id;
      }

      return { data, next_cursor };
    }),

  //

  by_thread_id: next_auth_procedure
    .input(z.string())
    .query(async ({ ctx: { payload, prisma }, input: thread_id }) => {
      const { profile } = payload;
      const { id: student_id } = await prisma.student.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      const owner_id_thread_id: Prisma.InboxThreadOwner_idThread_idCompoundUniqueInput =
        { owner_id: student_id, thread_id };

      return prisma.inboxThread.findUniqueOrThrow({
        include: {
          thread: {
            include: {
              participants: { select: { id: true, name: true, image: true } },
              messages: { take: 1, orderBy: [{ created_at: "desc" }] },
            },
          },
        },
        where: {
          owner_id_thread_id,
        },
      });
    }),

  //

  thread,
});

export default inbox_api_router;
export type InboxApiRouter = typeof inbox_api_router;
