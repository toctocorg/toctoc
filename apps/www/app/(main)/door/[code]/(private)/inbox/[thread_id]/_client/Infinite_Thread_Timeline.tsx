"use client";

import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import { TRPC_React } from ":trpc/client";
import type { Message } from "@1.modules/inbox.domain";
import { Timeline } from "@1.modules/inbox.ui/conversation/Timeline";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useCallback, useLayoutEffect, useRef } from "react";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

export default function Infinite_Thread_Timeline({
  profile_id,
}: {
  profile_id: string;
}) {
  const utils = TRPC_React.useUtils();
  const scroll_target_ref = useRef<HTMLDivElement>(null);

  const params = z
    .object({ thread_id: z.string() })
    .parse(useParams(), { path: ["useParams()"] });
  const { thread_id } = params;

  const last_seen_thread_update =
    TRPC_React.student.me.last_seen_by_thread_id.useMutation();
  const query_info = TRPC_React.inbox.thread.messages.useInfiniteQuery(
    {
      thread_id,
    },
    {
      getPreviousPageParam: (d) => d.prevCursor,
    },
  ) as UseInfiniteQueryResult<{ data: Message }>;

  const thread_seen = useCallback(async () => {
    await utils.inbox.find.refetch();
    await utils.inbox.by_thread_id.invalidate(thread_id);
    await utils.inbox.thread.by_id.invalidate(thread_id);
    await utils.notification.invalidate();
  }, [last_seen_thread_update, utils]);

  useLayoutEffect(() => {
    last_seen_thread_update.mutate({ thread_id, type: "INBOX_NEW_MESSAGE" });
  }, [scroll_target_ref]);

  useLayoutEffect(() => {
    if (!scroll_target_ref.current) {
      return;
    }

    thread_seen();
    scroll_target_ref.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [query_info.isFetching, scroll_target_ref]);

  const { data: session, status } = useSession();

  TRPC_React.inbox.thread.on_new_message.useSubscription(
    { token: session?.header.NEXTAUTH_TOKEN!, thread_id },
    {
      enabled: status === "authenticated",
      onData() {
        utils.inbox.thread.messages.invalidate({ thread_id });
      },
      onError(err) {
        console.error(
          "TRPC_React.inbox.thread.on_new_message > Subscription error:",
          err,
        );
        // we might have missed a message - invalidate cache
        utils.inbox.thread.messages.invalidate({ thread_id });
      },
    },
  );

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => {
      return <Loading_Placeholder />;
    })
    .with({ status: "success" }, () => (
      <>
        <Timeline query_info={query_info} profile_id={profile_id} />
        <div ref={scroll_target_ref}></div>
      </>
    ))
    .exhaustive();
}
