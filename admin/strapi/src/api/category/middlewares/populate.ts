//

import type { Next } from "koa";
import type { StrapiContext } from "~/types";

export default () => {
  return async (context: StrapiContext, next: Next) => {
    context.query.populate = "*";

    //
    //
    //

    return next();
  };
};
