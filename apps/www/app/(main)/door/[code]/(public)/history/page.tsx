//

import { Item } from ":app/(main)/exchanges/_client/List";
import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `History :: ${(await parent).title?.absolute}`,
  };
}

export default async function Page({ params }: { params: CodeParms }) {
  const profile_id = await code_to_profile_id(params);

  if (!profile_id) {
    return notFound();
  }

  const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);
  if (profile.role !== PROFILE_ROLES.Enum.STUDIENT) {
    redirect(`/@${params.code}`);
  }

  const { data: exchanges } = await TRPC_SSR.exchanges.by_particitpant.fetch({
    profile_id,
  });
  if (exchanges.length === 0) return <>N/A History</>;
  return (
    <main className="grid grid-cols-1 gap-y-5">
      {exchanges.map(({ id }) => (
        <Item key={id} id={id} />
      ))}
    </main>
  );
}
