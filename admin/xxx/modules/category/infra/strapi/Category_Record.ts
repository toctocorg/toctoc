//

import { InputError } from "@1/core/error";
import { z } from "zod";
import { z_strapi_entity_data } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Category } from "../../domain";

//

export const Category_Record = z
  .object({
    name: z.string(),
    slug: z.string(),
  })
  .merge(Strapi_Timestamps)
  .describe("Category Record");
export type Category_Record = z.TypeOf<typeof Category_Record>;

export const Category_DataRecord = z_strapi_entity_data(Category_Record);
export type Category_DataRecord = z.TypeOf<typeof Category_DataRecord>;

//

export function category_to_domain({ data }: Category_DataRecord): Category {
  const { id, attributes } = data ?? { id: NaN, attributes: {} };

  const domain = Category.create({
    ...Category.zero.toObject(),
    ...attributes,
    id,
  });

  if (domain.isFail()) {
    throw new InputError("Category_Record.to_domain", {
      cause: domain.error(),
    });
  }

  return domain.value();
}
