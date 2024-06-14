//

import {
  next_auth_input_token,
  next_auth_procedure,
  router,
} from "@1.modules/trpc";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { message_event_emitter } from "./MessageEventEmitter";
import { send } from "./send";

//

export const thread = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ ctx: { payload, prisma }, input: id }) => {
      const { profile } = payload;
      return prisma.thread.findUniqueOrThrow({
        where: { id, participants: { some: { id: profile.id } } },
        include: { participants: true },
      });
    }),

  //

  messages: next_auth_procedure
    .input(
      z.object({
        thread_id: z.string(),
        cursor: z.date().optional(),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ ctx: { payload, prisma }, input }) => {
      const { profile } = payload;
      const { cursor, limit, thread_id: id } = input;
      const data = await prisma.message.findMany({
        ...(cursor
          ? {
              cursor: {
                unique_date_in_thread: { thread_id: id, created_at: cursor },
              },
            }
          : {}),
        include: { author: true },
        orderBy: { created_at: "desc" },
        take: limit + 1,
        where: { thread: { id, participants: { some: { id: profile.id } } } },
      });

      let prevCursor: typeof cursor | undefined = undefined;
      if (data.length > limit) {
        const prev_item = data.pop()!;
        prevCursor = prev_item.created_at;
      }

      return { data, prevCursor };
    }),

  //

  on_new_message: next_auth_input_token
    .input(z.object({ thread_id: z.string() }))
    .subscription(async ({ ctx: { prisma, payload }, input }) => {
      const { thread_id } = input;
      const {
        profile: { id: profile_id },
      } = payload;

      // guard : Only subscribe to participating threads
      await prisma.thread.findUniqueOrThrow({
        where: { id: thread_id, participants: { some: { id: profile_id } } },
      });

      return observable<void>((emit) => {
        const new_message = () => {
          emit.next();
        };
        message_event_emitter.on(`${thread_id}>new_message`, new_message);
        return () => {
          message_event_emitter.off(`${thread_id}>new_message`, new_message);
        };
      });
    }),

  //

  send: send,
});
