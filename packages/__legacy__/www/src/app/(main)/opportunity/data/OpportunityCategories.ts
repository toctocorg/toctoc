//

import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";

//

export class OpportunityCategoriesRepository extends OpenAPI_Repository {
  async load() {
    const { data: body } = await this.client.GET("/opportunity-categories", {
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
