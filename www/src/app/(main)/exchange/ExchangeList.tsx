"use client";

import type { Exchange } from "@1/modules/exchange/domain";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { P, match } from "ts-pattern";
import { useExchange_list_controller } from "~/modules/exchange";
import { ExchangeCard } from "./ExchangeCard";

//

export function Exchange_InfiniteList({
  info,
}: {
  info: UseInfiniteQueryResult<Exchange, unknown>;
}) {
  return match(info)
    .with({ status: "error" }, ({ error }) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with(
      {
        status: "success",
        data: P.when((list) => list.pages.flat().length === 0),
      },
      () => <EmptyList />,
    )
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="grid grid-cols-1 gap-9">
          {pages.flat().map((exchange) => (
            <li key={exchange.get("id")}>
              <ExchangeCard id={exchange.get("id")} />
            </li>
          ))}
          <li className="col-span-full mx-auto">
            {isFetchingNextPage ? <Loading /> : null}
          </li>
          <li className="col-span-full mx-auto">
            {hasNextPage ? (
              <Button
                onPress={() => fetchNextPage()}
                isDisabled={!hasNextPage || isFetchingNextPage}
              >
                Charger plus
              </Button>
            ) : null}
          </li>
        </ul>
      ),
    )
    .exhaustive();
}

export function ExchangeList() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;
  const {
    lists: { useQuery },
  } = useExchange_list_controller();

  const query_result = useQuery({
    filter: {
      category,
      search,
    },
    sort: ["createdAt:desc"],
    pagination: { pageSize: 4 },
  });

  //

  return match(query_result)
    .with({ status: "error" }, ({ error }) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with(
      {
        status: "success",
        data: P.when(
          (list) => list.pages.map((page) => page.data!).flat().length === 0,
        ),
      },
      () => <EmptyList />,
    )
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="grid grid-cols-1 gap-9">
          {pages
            .map((page) => page.data!)
            .flat()
            .map((exchange) => (
              <li key={exchange.id}>
                <ExchangeCard id={exchange.id!} />
              </li>
            ))}
          <li className="col-span-full mx-auto">
            {isFetchingNextPage ? <Loading /> : null}
          </li>
          <li className="col-span-full mx-auto">
            {hasNextPage ? (
              <Button
                onPress={() => fetchNextPage()}
                isDisabled={!hasNextPage || isFetchingNextPage}
              >
                Charger plus
              </Button>
            ) : null}
          </li>
        </ul>
      ),
    )
    .exhaustive();
}

//

function EmptyList() {
  return (
    <h5 className="py-5 text-center font-bold">Pas plus de résultats ...</h5>
  );
}

function Loading() {
  return (
    <div className="mt-28 text-center">
      <Spinner />
    </div>
  );
}
