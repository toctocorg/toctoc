/**
 * question controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::question.question", {
  // ? TODO(douglasduteil): find a way to retrieve the accepted_answer
  // async find(ctx: Context, next: Next) {
  //   // super.find(ctx, next); like
  //   const sanitizedQuery = await this.sanitizeQuery(ctx);
  //   const { results, pagination } = await strapi
  //     .service("api::exchange-deal.exchange-deal")
  //     .find(sanitizedQuery);
  //   const sanitizedResults = await this.sanitizeOutput(results, ctx);
  //   // ! HACK(douglasduteil): retrive the comment relation by hand
  //   // As I don't know how to allow the content type to access it
  //   // const sanitizedResultsWithLastMessage = sanitizedResults.map(
  //   //   (result: ApiQuestionQuestion["attributes"], index) =>
  //   //     ({
  //   //       ...result,
  //   //       accepted_answer: results[index]["accepted_answer"],
  //   //     }) as ApiQuestionQuestion["attributes"],
  //   // );
  //   return this.transformResponse(sanitizedResults, {
  //     pagination,
  //   });
  // },
});
