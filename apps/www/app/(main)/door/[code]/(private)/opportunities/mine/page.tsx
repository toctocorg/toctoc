//

import { Item } from ":app/(main)/opportunities/_client/List";
import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

//

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Mine :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page({ params }: { params: CodeParms }) {
  const profile_id = await code_to_profile_id(params);
  if (!profile_id) {
    notFound();
  }

  const { data: opportunities } =
    await TRPC_SSR.opportunity.by_profile_id.fetch({
      profile_id,
    });

  return (
    <main
      className="
        grid
        grid-flow-row
        grid-cols-2
        gap-8
        lg:grid-cols-3
      "
    >
      {opportunities.map((data) => (
        <Item key={data.id} opportunity={data} />
      ))}
    </main>
  );
}
