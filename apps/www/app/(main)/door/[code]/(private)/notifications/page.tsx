//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import { AsyncListInfinite } from "./List";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Notifications :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page() {
  await TRPC_SSR.notification.find.prefetchInfinite({});
  //
  return (
    <TRPC_Hydrate>
      <main className="container my-32 px-16">
        <h1 className="mb-8 text-4xl font-bold">Notifications</h1>
        <AsyncListInfinite />
      </main>
    </TRPC_Hydrate>
  );
}
