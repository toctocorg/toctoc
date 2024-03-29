//

import { ID_Schema, Id } from "@1/core/domain";
import { NextTsyringe } from "@1/next-tsyringe";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import type { Metadata, ResolvingMetadata } from "next";
import { Main_Module } from "~/app/(main)/layout";
import { getQueryClient } from "~/core/getQueryClient";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";
import { Exchange_QueryKeys } from "~/modules/exchange/queryKeys";
import { Edit_Exchange } from "./page.client";

//

export async function generateMetadata(
  { params }: { params: { exchange_id: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Edit Exchange@${params.exchange_id} :: ${(await parent).title
      ?.absolute}`,
  };
}

//

export default async function Page({
  params,
}: {
  params: { exchange_id: string };
}) {
  try {
    const exchange_id = ID_Schema.parse(params.exchange_id, {
      path: ["params.exchange_id"],
    });

    //

    const container = await NextTsyringe.injector(Main_Module);

    const repository = container.resolve(Exchange_Repository);

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({
      queryKey: Exchange_QueryKeys.item(exchange_id),
      queryFn: () => repository.by_id(Id(exchange_id)),
    });
    const dehydratedState = dehydrate(queryClient);

    return (
      <Hydrate state={dehydratedState}>
        <Edit_Exchange exchange_id={exchange_id} />
      </Hydrate>
    );
  } catch (error) {
    return (
      <article className="px-4 pt-40 lg:px-16">
        <h1 className="text-4xl font-bold">Page introuvable.</h1>
      </article>
    );
  }
}
