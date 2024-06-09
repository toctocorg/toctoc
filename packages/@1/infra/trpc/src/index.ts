//

import auth_api_router from "@1.modules/auth.api";
import bookmarks_api_router from "@1.modules/bookmark.api";
import category_api_router from "@1.modules/category.api";
import type { Location } from "@1.modules/core/Location";
import exchange_api_router from "@1.modules/exchange.api";
import forum_api_router from "@1.modules/forum.api";
import inbox_api_router from "@1.modules/inbox.api";
import notification_api_router from "@1.modules/notification.api";
import opportunity_api_router from "@1.modules/opportunity.api";
import profile_api_router from "@1.modules/profile.api";
import { partner_api_router } from "@1.modules/profile.api/partner";
import { studient_api_router } from "@1.modules/profile.api/studient";
import { procedure, router } from "@1.modules/trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

//

export const root_router = router({
  auth: auth_api_router,
  bookmarks: bookmarks_api_router,
  category: category_api_router,
  exchanges: exchange_api_router,
  forum: forum_api_router,
  inbox: inbox_api_router,
  opportunity: opportunity_api_router,
  partner: partner_api_router,
  profile: profile_api_router,
  studient: studient_api_router,
  notification: notification_api_router,
  locations: procedure
    .input(z.object({ location: z.string().trim().default("Paris") }))
    .query(async ({ input: { location: nom } }) => {
      const search_params = new URLSearchParams({
        boost: "population",
        limit: "5",
        nom,
        fields: "departement",
      });
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?${search_params}`,
      );
      return response.json() as Promise<Location[]>;
    }),
});

export { root_router as router };
export type Router = typeof root_router;
export type RouterInput = inferRouterInputs<Router>;
export type RouterOutput = inferRouterOutputs<Router>;
