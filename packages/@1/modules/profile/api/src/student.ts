import { Student_Schema, type Student } from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { NotificationType } from "@prisma/client";
import { match } from "ts-pattern";
import { z } from "zod";

export const student_api_router = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.student.findUniqueOrThrow({
        where: { id },
      });
    }),

  by_profile_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: profile_id, ctx: { prisma } }) => {
      return Student_Schema.parse(
        await prisma.student.findFirstOrThrow({
          where: { profile_id },
          include: { interest: true, profile: true },
        }),
        {
          path: ["<student.by_profile_id>.prisma.student.findFirstOrThrow"],
        },
      ) as Student;
    }),

  //

  me: router({
    update: next_auth_procedure
      .input(Student_Schema.omit({ id: true, profile: true, interest: true }))
      .mutation(({ input, ctx: { prisma, payload } }) => {
        const { id: profile_id } = payload.profile;
        return prisma.student.update({
          data: {
            ...input,
            updated_at: new Date(),
          },
          where: { profile_id },
        });
      }),

    //

    last_seen_by_thread_id: next_auth_procedure
      .input(
        z.object({
          thread_id: z.string(),
          type: z.enum([
            NotificationType.EXCHANGE_NEW_MESSAGE,
            NotificationType.INBOX_NEW_MESSAGE,
          ]),
        }),
      )
      .mutation(
        async ({ ctx: { payload, prisma }, input: { thread_id, type } }) => {
          const {
            profile: { id: profile_id },
          } = payload;
          const last_seen_date = new Date();
          const { id: student_id } = await prisma.student.findFirstOrThrow({
            select: { id: true },
            where: { profile_id },
          });

          return match(type)
            .with(NotificationType.EXCHANGE_NEW_MESSAGE, () =>
              prisma.$transaction([
                prisma.notification.updateMany({
                  data: { read_at: last_seen_date },
                  where: {
                    owner: { id: profile_id },
                    exchange_message: { message: { thread_id } },
                    type: NotificationType.EXCHANGE_NEW_MESSAGE,
                  },
                }),
                prisma.exchangeThread.update({
                  data: { last_seen_date },
                  where: {
                    owner_id_thread_id: { owner_id: student_id, thread_id },
                  },
                }),
              ]),
            )
            .with(NotificationType.INBOX_NEW_MESSAGE, () =>
              prisma.$transaction([
                prisma.notification.updateMany({
                  data: { read_at: last_seen_date },
                  where: {
                    owner: { id: profile_id },
                    exchange_message: { message: { thread_id } },
                    type: NotificationType.INBOX_NEW_MESSAGE,
                  },
                }),
                prisma.inboxThread.update({
                  data: { last_seen_date },
                  where: {
                    owner_id_thread_id: { owner_id: student_id, thread_id },
                  },
                }),
              ]),
            )
            .exhaustive();
        },
      ),
  }),
});
