"use client";

import { TRPC_React } from ":trpc/client";
import { DotIndicator } from "@1.modules/notification.ui/DotIndicator";
import { badge } from "@1.ui/react/badge/atom";
import { useAsync, useUpdateEffect } from "@react-hookz/web";

//

export function Notification_DotIndicator() {
  const utils = TRPC_React.useUtils();
  const { data: count_unread } = TRPC_React.notification.count_unread.useQuery(
    {},
    { refetchInterval: 1_000 * 30 },
  );

  const [, { execute }] = useAsync(() =>
    Promise.all([
      utils.notification.count_unread.invalidate({
        type: "EXCHANGE_NEW_MESSAGE",
      }),
      utils.notification.count_unread.invalidate({ type: "INBOX_NEW_MESSAGE" }),
    ]),
  );

  useUpdateEffect(() => {
    execute();
  }, [count_unread]);

  if (!count_unread) return null;
  if (count_unread <= 0) return null;

  return <DotIndicator />;
}

export function MessageNews_DotIndicator() {
  const { data: count_unread } = TRPC_React.notification.count_unread.useQuery({
    type: "INBOX_NEW_MESSAGE",
  });

  if (!count_unread) return null;
  if (count_unread <= 0) return null;

  return <DotIndicator />;
}

export function ExchangeNews_DotIndicator() {
  const { data: count_unread } = TRPC_React.notification.count_unread.useQuery({
    type: "EXCHANGE_NEW_MESSAGE",
  });

  if (!count_unread) return null;
  if (count_unread <= 0) return null;

  return <DotIndicator />;
}

export function NewsInMessage_Indicator() {
  const { data: count_unread } = TRPC_React.notification.count_unread.useQuery({
    type: "INBOX_NEW_MESSAGE",
  });
  return <Notification_CountIndicator count={count_unread} />;
}

export function NewsInExchange_Indicator() {
  const { data: count_unread } = TRPC_React.notification.count_unread.useQuery({
    type: "EXCHANGE_NEW_MESSAGE",
  });
  return <Notification_CountIndicator count={count_unread} />;
}

export function Notification_CountIndicator({
  count,
}: {
  count: number | undefined;
}) {
  if (!count) return null;
  if (count <= 0) return null;

  return (
    <span className={badge({ className: "text-sm", color: "danger" })}>
      {count}
    </span>
  );
}
