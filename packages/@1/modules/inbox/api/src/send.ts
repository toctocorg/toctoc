//

import { thread_recipient } from "@1.modules/inbox.domain/select";
import { next_auth_procedure } from "@1.modules/trpc";
import { NotificationType, Prisma } from "@prisma/client";
import { P, match } from "ts-pattern";
import { z } from "zod";
import { message_event_emitter } from "./MessageEventEmitter";

//

export const send = next_auth_procedure
  .input(
    z.object({
      thread_id: z.string(),
      content: z.string(),
    }),
  )
  .mutation(async ({ ctx: { payload, prisma }, input }) => {
    const {
      profile: { id: profile_id },
    } = payload;
    const { content, thread_id } = input;

    const { id: student_id } = await prisma.student.findFirstOrThrow({
      select: { id: true },
      where: { profile_id },
    });

    // guard : Only write on participating threads
    const { participants } = await prisma.thread.findUniqueOrThrow({
      select: { participants: { select: { id: true } } },
      where: { id: thread_id, participants: { some: { id: profile_id } } },
    });
    const recipient = thread_recipient({ participants, profile_id });
    const updated_at = new Date();

    const [exchange_thread, inbox_thread] = await Promise.all([
      prisma.exchangeThread.findUnique({
        select: { deal: { select: { parent_id: true } } },
        where: { owner_id_thread_id: { owner_id: student_id, thread_id } },
      }),
      prisma.inboxThread.findUnique({
        where: { owner_id_thread_id: { owner_id: student_id, thread_id } },
      }),
    ]);

    const linked_thread_update = match({
      exchange_thread,
      inbox_thread,
    })
      .with(
        { exchange_thread: P.nonNullable },
        (): Prisma.ThreadUpdateInput => ({
          exchange_threads: {
            update: {
              data: { last_seen_date: updated_at },
              where: {
                owner_id_thread_id: { owner_id: student_id, thread_id },
              },
            },
          },
        }),
      )
      .with(
        { inbox_thread: P.nonNullable },
        (): Prisma.ThreadUpdateInput => ({
          inbox_threads: {
            update: {
              data: { last_seen_date: updated_at },
              where: {
                owner_id_thread_id: { owner_id: student_id, thread_id },
              },
            },
          },
        }),
      )
      .otherwise(() => ({}));

    const inbox_notifications: Prisma.InboxMessageNotificationCreateNestedManyWithoutMessageInput =
      inbox_thread
        ? {
            create: {
              notification: {
                create: {
                  owner_id: recipient.id,
                  type: NotificationType.INBOX_NEW_MESSAGE,
                },
              },
            },
          }
        : {};

    const exchange_notifications: Prisma.ExchangeMessageNotificationUncheckedCreateNestedManyWithoutMessageInput =
      exchange_thread
        ? {
            create: {
              exchange: { connect: { id: exchange_thread.deal.parent_id } },
              notification: {
                create: {
                  owner_id: recipient.id,
                  type: NotificationType.EXCHANGE_NEW_MESSAGE,
                },
              },
            },
          }
        : {};

    const updated_thread = await prisma.thread.update({
      data: {
        updated_at: updated_at,
        messages: {
          create: {
            created_at: updated_at,
            updated_at,
            author: { connect: { id: profile_id } },
            content,
            inbox_notifications,
            exchange_notifications,
          },
        },
        ...linked_thread_update,
      },
      where: { id: thread_id },
    });

    message_event_emitter.emit(`${thread_id}>new_message`);
    return updated_thread;
  });
