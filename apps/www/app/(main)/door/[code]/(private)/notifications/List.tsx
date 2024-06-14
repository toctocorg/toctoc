"use client";

import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import { TRPC_React } from ":trpc/client";
import type { RouterOutput } from "@1.infra/trpc";
import { Button } from "@1.ui/react/button";
import { card } from "@1.ui/react/card/atom";
import type { InfiniteQueryObserverSuccessResult } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { P, match } from "ts-pattern";

//

type FindNotification = RouterOutput["notification"]["find"];
type Notification = RouterOutput["notification"]["find"]["data"][number];
export function AsyncListInfinite() {
  const query_info = TRPC_React.notification.find.useInfiniteQuery(
    {},
    {
      getPreviousPageParam: (d) => d.prevCursor,
      refetchInterval: 10_000,
    },
  );

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => {
      return <Loading_Placeholder />;
    })
    .with({ status: "success" }, (success_info) => (
      <List query_info={success_info} />
    ))
    .exhaustive();
}

function List({
  query_info,
}: {
  query_info: InfiniteQueryObserverSuccessResult<FindNotification, unknown>;
}) {
  const { data, isFetchingPreviousPage, hasPreviousPage, fetchPreviousPage } =
    query_info;
  const flatten_pages = data.pages
    .map((page) => page.data)
    .reverse()
    .flat();

  return (
    <>
      <ul className="space-y-6">
        {flatten_pages.map((notification) => (
          <li key={notification.id}>
            <Card notification={notification} />
          </li>
        ))}
      </ul>
      {match({ isFetchingPreviousPage, hasPreviousPage })
        .with({ isFetchingPreviousPage: true }, () => <Loading_Placeholder />)
        .with({ hasPreviousPage: true }, () => (
          <LoadMore onClick={fetchPreviousPage} />
        ))
        .otherwise(() => null)}
    </>
  );
}

function Card({ notification }: { notification: Notification }) {
  return match(notification)
    .with({ type: "INBOX_NEW_MESSAGE" }, (inbox_notif) => (
      <InboxNewMessage notification={inbox_notif} />
    ))
    .with({ type: "EXCHANGE_NEW_MESSAGE" }, (inbox_notif) => (
      <ExchangeNewMessage notification={inbox_notif} />
    ))
    .otherwise(() => {
      console.error(`Unknown notification type ${notification.type}`);
      return null;
    });
}

function ExchangeNewMessage({ notification }: { notification: Notification }) {
  const session = useSession();
  if (!session.data) return null;
  const {
    data: {
      profile: { id: my_profile_id },
    },
  } = session;
  const { base, body } = card();
  const { id, created_at, read_at, exchange_message } = notification;

  if (!exchange_message) return null;
  if (!exchange_message.message) return null;
  if (!exchange_message.exchange) return null;
  if (!exchange_message.exchange_id) return null;

  const {
    exchange_id,
    exchange: {
      owner: { profile_id },
      title,
    },
    message: {
      author: { name },
      thread_id,
    },
  } = exchange_message;
  return (
    <Link id={id} href={`/@~/exchanges/inbox/${exchange_id}/${thread_id}`}>
      <div
        className={base({ className: read_at ? "bg-transparent" : "bg-white" })}
      >
        <div className={body()}>
          <time
            className="float-right text-xs text-gray-500"
            dateTime={created_at.toUTCString()}
            title={created_at.toUTCString()}
          >
            {format(created_at, "Pp", { locale: fr })}
          </time>
          <b>{name}</b> vous a envoyé un nouveau message sur{" "}
          {my_profile_id === profile_id ? "votre " : "l'"}échange{" "}
          <i>“{title}”</i>
        </div>
      </div>
    </Link>
  );
}

function InboxNewMessage({ notification }: { notification: Notification }) {
  const { base, body } = card();
  const { id, created_at, read_at, inbox_message } = notification;

  if (!inbox_message) return null;
  if (!inbox_message.message) return null;

  const {
    message: {
      author: { name },
      thread_id,
    },
  } = inbox_message;
  return (
    <Link id={id} href={`/@~/inbox/${thread_id}`}>
      <div
        className={base({ className: read_at ? "bg-transparent" : "bg-white" })}
      >
        <div className={body()}>
          <time
            className="float-right text-xs text-gray-500"
            dateTime={created_at.toUTCString()}
            title={created_at.toUTCString()}
          >
            {format(created_at, "Pp", { locale: fr })}
          </time>
          <b>{name}</b> vous a envoyé un nouveau message
        </div>
      </div>
    </Link>
  );
}

function LoadMore({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="mx-auto my-6 block"
      state="ghost"
      intent="light"
      onPress={onClick}
    >
      Charger plus de notifications.
    </Button>
  );
}
