//

import { SeeProfileAvatarMedia } from ":components/avatar";
import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import type { Params as ExchangeParams } from ":pipes/exchange_by_id";
import { session_profile_id } from ":pipes/session_profile_id";
import { type Params as ThreadParams } from ":pipes/thread_by_id";
import { TRPC_Hydrate, TRPC_SSR, proxyClient } from ":trpc/server";
import { ExchangeProvider } from "@1.modules/exchange.ui/context";
import { thread_recipient } from "@1.modules/inbox.domain/select";
import to from "await-to-js";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { tv } from "tailwind-variants";
import Conversation_Form from "./_client/Conversation_Form";

//

const Thread_Timeline = dynamic(
  () => import("./_client/Infinite_Thread_Timeline"),
  {
    ssr: false,
    loading() {
      return <Loading_Placeholder />;
    },
  },
);

//

export async function generateMetadata(
  { params }: { params: ThreadParams },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `${params.thread_id} :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page({
  params,
}: {
  params: ThreadParams & ExchangeParams;
}) {
  const { thread_id, exchange_id } = params;

  const [thread_err, thread] = await to(
    TRPC_SSR.inbox.thread.by_id.fetch(thread_id),
  );
  if (thread_err) {
    notFound();
  }
  const profile_id = await session_profile_id();
  const participant = thread_recipient({
    participants: thread.participants,
    profile_id,
  });

  await TRPC_SSR.inbox.thread.messages.prefetchInfinite({
    thread_id,
  });
  await TRPC_SSR.exchanges.me.inbox.by_thread_id.prefetch(thread_id);

  await proxyClient.student.me.last_seen_by_thread_id.mutate({
    thread_id,
    type: "EXCHANGE_NEW_MESSAGE",
  });

  const exchange = await TRPC_SSR.exchanges.by_id.fetch(exchange_id);

  const { base, footer, header } = layout();
  return (
    <TRPC_Hydrate>
      <main className={base()}>
        <header className={header()}>
          <SeeProfileAvatarMedia profile={participant} />
        </header>
        <div className="overflow-y-auto py-4 pr-5">
          <ExchangeProvider exchange={exchange}>
            <Thread_Timeline profile_id={profile_id} />
          </ExchangeProvider>
        </div>
        <footer className={footer()}>
          <ExchangeProvider exchange={exchange}>
            <Conversation_Form thread_id={thread_id} />
          </ExchangeProvider>
        </footer>
      </main>
    </TRPC_Hydrate>
  );
}

const layout = tv({
  base: `
    grid
    h-full
    max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))]
    grid-rows-[auto_1fr_auto]
    bg-white
    text-black
    [&>*]:px-7
  `,
  slots: {
    header: "flex flex-row justify-between space-x-3 py-7",
    footer: `
      flex
      min-h-[theme(spacing.24)]
      flex-col
      items-center
      justify-center
      space-y-4
      bg-white
      py-5
      text-black
    `,
  },
});
