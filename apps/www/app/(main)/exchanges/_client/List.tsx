"use client";

import { TRPC_React } from ":trpc/client";
import { Exchange_Card } from ":widgets/exchanges/card";
import { Exchange_Filter, type Exchange } from "@1.modules/exchange.domain";
import { Exchange_AsyncCard } from "@1.modules/exchange.ui/Card/AsyncCard";
import { Exchange_InfiniteList } from "@1.modules/exchange.ui/InfiniteList";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, type ComponentProps, type ReactNode } from "react";
import { match, P } from "ts-pattern";

//

export default function List() {
  const { data: session } = useSession();
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;
  const filter = match(Exchange_Filter.safeParse(search_params.get("f")))
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => undefined);
  useEffect(() => {
    gtag("event", "search", { search_term: search });
  }, [search]);

  const info = match(session)
    .with(
      { profile: P._ },
      () =>
        TRPC_React.exchanges.find.private.useInfiniteQuery(
          {
            category,
            filter,
            search,
          },
          {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
          },
        ) as ComponentProps<typeof Exchange_InfiniteList>["info"],
    )
    .otherwise(
      () =>
        TRPC_React.exchanges.find.public.useInfiniteQuery(
          {
            category,
            search,
          },
          {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
          },
        ) as ComponentProps<typeof Exchange_InfiniteList>["info"],
    );

  //

  return (
    <Exchange_InfiniteList info={info}>
      {({ id }) => (
        <Exchange_byId key={id} id={id}>
          {(exchange) => (
            <Exchange_Card exchange={exchange} profile={session?.profile} />
          )}
        </Exchange_byId>
      )}
    </Exchange_InfiniteList>
  );
}

function Exchange_byId({
  children,
  id,
}: {
  id: string;
  children: (exchange: Exchange) => ReactNode;
}) {
  const info = TRPC_React.exchanges.by_id.useQuery(id);
  return (
    <Exchange_AsyncCard
      info={info as ComponentProps<typeof Exchange_AsyncCard>["info"]}
    >
      {({ exchange }) => children(exchange)}
    </Exchange_AsyncCard>
  );
}
