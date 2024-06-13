//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { Exchange_Card } from ":widgets/exchanges/card";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Proposals :: ${(await parent).title?.absolute}`,
  };
}

export default async function Page({ params }: { params: CodeParms }) {
  const profile_id = await code_to_profile_id(params);
  if (!profile_id) {
    return notFound();
  }

  const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);
  if (profile.role !== PROFILE_ROLES.Enum.STUDENT) {
    redirect(`/@${params.code}`);
  }

  const { data: exchanges } = await TRPC_SSR.exchanges.by_profile.fetch({
    profile_id,
  });

  return (
    <main className="grid grid-cols-1 gap-y-5">
      {exchanges.map((exchange) => (
        <Exchange_Card
          key={exchange.id}
          exchange={exchange}
          profile={profile}
        />
      ))}
    </main>
  );
}
