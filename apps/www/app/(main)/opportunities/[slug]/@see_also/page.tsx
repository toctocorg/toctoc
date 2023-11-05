//

import { TRPC_SSR } from ":trpc/server";
import { ErrorOccur } from "@1.ui/react/error";
import Page_Client from "./page.client";

//

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  //! HACK(douglasduteil): Investigate way the param is "undefined" on direct page access
  if (slug === "undefined") return null;

  try {
    const opportunity = await TRPC_SSR.opportunity.by_slug.fetch(slug);

    const { category } = opportunity;

    return <Page_Client category={category.slug} />;
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}
