//

import { Item } from ":app/(main)/exchanges/_client/List";
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
    title: `My Exchanges :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page({ params }: { params: CodeParms }) {
  const profile_id = await code_to_profile_id(params);
  if (!profile_id) {
    return notFound();
  }

  const { data: exchanges } = await TRPC_SSR.exchanges.by_profile.fetch({
    profile_id,
  });

  return (
    <main className="mx-auto mt-10 grid grid-cols-1 gap-y-5 px-4 md:max-w-4xl">
      {exchanges.map(({ id }) => (
        <Item key={id} id={id} />
      ))}
    </main>
  );
}