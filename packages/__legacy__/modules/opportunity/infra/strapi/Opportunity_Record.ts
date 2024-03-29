//

import { InputError } from "@1/core/error";
import { z } from "zod";
import { z_strapi_entity_data } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Opportunity } from "../../domain";

//

export const Opportunity_Record = z
  .object({})
  .merge(Strapi_Timestamps)
  .passthrough()
  .describe("Category Record");
export type Opportunity_Record = z.TypeOf<typeof Opportunity_Record>;

//

export const Opportunity_DataRecord = z_strapi_entity_data(Opportunity_Record);
export type Opportunity_DataRecord = z.TypeOf<typeof Opportunity_DataRecord>;

//

export function opportunity_to_domain({
  data,
}: Opportunity_DataRecord): Opportunity {
  const { id, attributes } = data ?? { id: NaN, attributes: {} };

  const domain = Opportunity.create({
    ...Opportunity.zero.toObject(),
    ...attributes,
    id,
  });

  if (domain.isFail()) {
    throw new InputError("Opportunity_Record.to_domain", {
      cause: domain.error(),
    });
  }

  return domain.value();
}
