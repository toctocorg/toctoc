//

import type { Router } from "@1.infra/trpc";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import { create_nexauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { createTRPCProxyClient, httpLink, loggerLink } from "@trpc/client";
import type { JWT } from "next-auth/jwt";
import SuperJSON from "superjson";
import { z } from "zod";

//

const ENV = z
  .object({ _01_NEXT_AUTH_MODULES_TRPC_API_URL: z.string().url() })
  .parse(process.env);

//

export const trpc = createTRPCProxyClient<Router>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpLink({
      url: ENV._01_NEXT_AUTH_MODULES_TRPC_API_URL,
      headers: async ({}) => {
        const nexaut_header = await create_nexauth_header({
          secret: NEXTAUTH_TRPCENV.NEXTAUTH_SECRET,
          token: {
            from: "@1.modules/auth.next",
            profile: { id: "SSR", image: "", name: "", role: "ADMIN", bio: "" },
          } satisfies JWT,
          maxAge: 60,
        });
        return nexaut_header;
      },
    }),
  ],
  transformer: SuperJSON,
});
