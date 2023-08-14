//

import { GET } from "@/app/api/v1";
import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";

//

export class OpportunityCategories {
  static async load() {
    const { data: body } = await GET("/opportunity-categories", {
      params: {
        query: {
          sort: ["slug:asc"],
        } as any,
      },
      next: { revalidate: 86400 satisfies _24_HOURS_ },
    });

    if (!body) return [];
    if (!body.data) return [];

    return body.data;
  }
}
