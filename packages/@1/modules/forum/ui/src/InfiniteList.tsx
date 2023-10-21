//

import type { Question } from "@1.modules/forum.domain";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { tv } from "tailwind-variants";
import { match, P } from "ts-pattern";

//

export function Question_InfiniteList({
  info,
  children,
}: {
  info: UseInfiniteQueryResult<{ data: Question[] }>;
  children: (props: Question) => React.ReactNode;
}) {
  const { base, item } = forum_list();
  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with(
      {
        status: "success",
        data: P.when(
          (list) => list.pages.map((page) => page.data).flat().length === 0,
        ),
      },
      () => <EmptyList />,
    )
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className={base()}>
          {pages
            .map((page) => page.data)
            .flat()
            .map((data) => (
              <li key={data.id} className={item()}>
                {children(data)}
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
    <figure className="mt-28 text-center">
      <h3 className="text-xl">Pas plus de résultats ...</h3>
    </figure>
  );
}

function Loading() {
  return (
    <div className="mt-28 text-center">
      <Spinner />
    </div>
  );
}

//

const forum_list = tv({
  base: `
    grid
    grid-cols-1
    gap-9
  `,
  slots: {
    item: "",
  },
});
