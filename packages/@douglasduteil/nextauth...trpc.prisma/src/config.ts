//

import process from "node:process";
import { z } from "zod";
import { PrismaClient } from "../prisma/.client";

//

export const NEXT_AUTH_HEADER = z.object({ NEXTAUTH_TOKEN: z.string() });
export type NEXT_AUTH_HEADER = z.TypeOf<typeof NEXT_AUTH_HEADER>;

export interface NextAuth_TRPCContext {
  headers: NEXT_AUTH_HEADER;
  prisma: PrismaClient;
}
export const SEND_VERIFICATION_REQUEST_INPUT_SCHEMA = z.object({
  identifier: z.string().email(),
  token: z.string(),
  expires: z.coerce.date(),
  url: z.string().url(),
});
export type SEND_VERIFICATION_REQUEST_INPUT_SCHEMA = z.TypeOf<
  typeof SEND_VERIFICATION_REQUEST_INPUT_SCHEMA
>;

export const NEXTAUTH_TRPCENV = z
  .object({
    NEXTAUTH_SECRET: z.string(),
  })
  .parse(process.env, { path: ["<NEXTAUTH_TRPCENV>", "process.env"] }); //

export const NEXT_AUTH_STRATEGIES = z.union([
  z.literal("Everyone can login"),
  z.literal("Only existing users can login"),
]);
export type NEXT_AUTH_STRATEGIES = z.TypeOf<typeof NEXT_AUTH_STRATEGIES>;
