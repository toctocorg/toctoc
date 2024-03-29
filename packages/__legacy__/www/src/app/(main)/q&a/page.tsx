//

import { Hydrate, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { fromServer } from "~/app/api/v1";
import { getQueryClient } from "~/core/getQueryClient";
import { Question_Repository } from "~/modules/question/repository";
import type { Question_Controller } from "~/modules/question/view/react/controller";
import { QAList } from "./QAList";
import { QASearchForm } from "./QASearchForm";
import { Question_Form } from "./page.client";

//

export const dynamic = "force-dynamic";

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = searchParams["q"] as string | undefined;
  const category = searchParams["category"] as string | undefined;
  return (
    <main>
      <QASearchForm />
      <Suspense>
        <Question_Form />
      </Suspense>
      <hr className="my-10" />
      <HydreatedQAList category={category} search={search} />
    </main>
  );
}

async function HydreatedQAList({
  category,
  search,
}: Record<"category" | "search", string | undefined>) {
  const repository = new Question_Repository(fromServer);

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    ["question", "list"] as ReturnType<
      InstanceType<typeof Question_Controller>["query_keys"]["lists"]
    >,
    repository.findAll.bind(repository, {
      filter: { category, search },
      sort: ["createdAt:desc"],
      pagination: { pageSize: 11 },
    }),
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <QAList category={category} search={search} />
    </Hydrate>
  );
}
