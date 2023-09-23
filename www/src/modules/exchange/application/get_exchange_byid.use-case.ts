//

import { Exchange_ItemSchemaToDomain } from "@1/modules/exchange/infra/strapi";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { getQueryClient } from "~/core/getQueryClient";
import { Exchange_Repository } from "../infrastructure";
import { Exchange_QueryKeys } from "../queryKeys";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Exchange_ById_UseCase {
  #log = debug(`~:modules:exchange:${Get_Exchange_ById_UseCase.name}`);

  constructor(
    @inject(Exchange_Repository)
    private readonly repository: Exchange_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(id: number) {
    return useQuery({
      enabled: this.repository.is_authorized,
      queryFn: () => this.repository.by_id(id),
      queryKey: Exchange_QueryKeys.item(id),
      select: (data) => {
        return new Exchange_ItemSchemaToDomain().build(data!).value();
      },
    });
  }

  async prefetch(id: number) {
    this.#log("prefetch", id);

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
      queryKey: Exchange_QueryKeys.item(id),
      queryFn: () => this.repository.by_id(id),
    });

    return queryClient;
  }
}
