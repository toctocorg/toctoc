//

import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";
import { sanitize, validate } from "@strapi/utils";
import { z } from "zod";
import { GetValues, ID_Schema, Params, type KoaContext } from "~/types";
import { EXCHANGE_API_CONTENT_ID } from "../../exchange/content-types/exchange";
import { BOOKMARK_API_CONTENT_ID } from "../content-types/bookmark";
import { find_owner_bookmarks } from "../services/bookmark";

//

export default {
  async find(ctx: KoaContext) {
    const contentType = strapi.contentType(EXCHANGE_API_CONTENT_ID);

    await validate.contentAPI.query(ctx.query, contentType as any, {
      auth: ctx.state.auth,
    });

    const owner = ID_Schema.parse(ctx.state.user.id, {
      path: ["context.state.user.id"],
    });

    //

    try {
      const { exchanges } = await find_owner_bookmarks(owner, ctx);

      //

      const sanitizedQueryParams = await sanitize.contentAPI.query(
        ctx.query,
        contentType,
        { auth: ctx.state.auth },
      );

      const { results, pagination } = await strapi
        .service(EXCHANGE_API_CONTENT_ID)
        .find({
          ...sanitizedQueryParams,
          filters: {
            id: { $in: exchanges.map(({ id }) => id) },
          },
        } satisfies Params.Pick<typeof EXCHANGE_API_CONTENT_ID, "filters">);

      const sanitizedResults = await sanitize.contentAPI.output(
        results,
        contentType,
        {
          auth: ctx.state.auth,
        },
      );

      return transformResponse(
        sanitizedResults,
        { pagination },
        { contentType },
      );
    } catch (error) {
      const pagination = {
        page: 1,
        pageCount: 25,
        pageSize: 0,
        total: 0,
      };
      const data = [];
      return transformResponse(data, { pagination }, { contentType });
    }
  },

  async check(ctx: KoaContext<never, never, { id: string }>) {
    const owner = ID_Schema.parse(ctx.state.user.id, {
      path: ["context.state.user.id"],
    });
    const exchange_id = z.coerce.number().parse(ctx.params.id, {
      path: ["context.params.id"],
    });

    //

    try {
      const { exchanges } = await find_owner_bookmarks(owner, ctx);
      ctx.status = exchanges.some(({ id }) => id === exchange_id) ? 200 : 404;
      return;
    } catch (error) {
      return ctx.notFound();
    }
  },

  async add(ctx: KoaContext<never, never, { id: string }>) {
    const owner = ID_Schema.parse(ctx.state.user.id, {
      path: ["context.state.user.id"],
    });
    const exchange_id = z.coerce.number().parse(ctx.params.id, {
      path: ["context.params.id"],
    });

    //

    let bookmark: GetValues<"api::bookmark.bookmark">;
    try {
      bookmark = await find_owner_bookmarks(owner, ctx);
    } catch (error) {
      bookmark = await strapi
        .service(BOOKMARK_API_CONTENT_ID)
        .create({ data: { owner } }, ctx);
    }

    try {
      await strapi.entityService.update(BOOKMARK_API_CONTENT_ID, bookmark.id, {
        data: {
          exchanges: {
            connect: [{ id: exchange_id, position: { start: true } }],
          } as any,
        },
      });
    } catch (error) {
      ctx.status = 409;
      return;
    }

    ctx.status = 200;
    return;
  },

  async remove(ctx: KoaContext<never, never, { id: string }>) {
    const owner = ID_Schema.parse(ctx.state.user.id, {
      path: ["context.state.user.id"],
    });
    const exchange_id = z.coerce.number().parse(ctx.params.id, {
      path: ["context.params.id"],
    });

    //

    try {
      const bookmark = await find_owner_bookmarks(owner, ctx);

      await strapi.entityService.update(BOOKMARK_API_CONTENT_ID, bookmark.id, {
        data: {
          exchanges: {
            disconnect: [{ id: exchange_id }],
          } as any,
        },
      });
    } catch (error) {
      ctx.status = 410;
      return;
    }

    ctx.status = 200;
    return;
  },
};
