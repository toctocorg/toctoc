//
import { initTRPC } from "@trpc/server";
import {} from "@trpc/server/observable";
import SuperJSON from "superjson";
import { z } from "zod";
//
const t = initTRPC.context().create({
    transformer: SuperJSON,
});
export const router = t.router;
export const publicProcedure = t.procedure;
//
export const appRouter = t.router({
    notifications: t.procedure
        .input(z.string())
        .subscription(async function notifications({ ctx, input: token }) {
        const { id: user_id } = await ctx.verify_jwt(token);
        return ctx.subscription_to.notifications(user_id);
    }),
});
