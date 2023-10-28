//

import type { Message } from "@1.modules/inbox.domain";
import { PROFILE_UNKNOWN, type Profile } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Fragment } from "react";
import { match } from "ts-pattern";
import { ProfileMessages } from "./ProfileMessages";

//

export function Timeline({
  profile_id,
  query_info,
}: {
  profile_id: string;
  query_info: UseInfiniteQueryResult<{ data: Message }, unknown>;
}) {
  const { data, isFetchingNextPage, hasPreviousPage, fetchPreviousPage } =
    query_info;

  if (!data) return null;
  const { pages } = data;

  const flatten_pages = pages
    .map((page) => page.data)
    .reverse()
    .flat();

  const grouped_by_day_and_profile = flatten_pages.reduceRight(
    (group, message) => {
      const [day_time] = group.at(-1) ?? [];
      const { author, created_at } = message;

      if (!isSameDay(day_time ?? NaN, created_at)) {
        group.push([created_at, []]);
      }

      const [, messagesByProfile] = group.at(-1)!;

      const [{ id: last_id }] = messagesByProfile.at(-1) ?? [PROFILE_UNKNOWN];

      if (last_id !== author.id) {
        messagesByProfile.push([author, []]);
      }

      const [, messages] = messagesByProfile.at(-1)!;
      messages!.push(message);

      return group;
    },
    [] as [Date, [Omit<Profile, "bio">, Message[]][]][],
  );

  return (
    <>
      {match({ isFetchingNextPage, hasPreviousPage })
        .with({ isFetchingNextPage: true }, () => <Spinner />)
        .with({ hasPreviousPage: true }, () => (
          <LoadMore onClick={fetchPreviousPage} />
        ))
        .otherwise(() => null)}
      {grouped_by_day_and_profile.map(([day, messages_by_profile]) => {
        return (
          <Fragment key={String(day)}>
            <MessageTime date={day} />
            {messages_by_profile.map(([profile, messages], index) => {
              return (
                <ProfileMessages
                  key={`${Number(day)}_${profile.id}_${index}`}
                  is_you={profile.id === profile_id}
                  profile={profile}
                  messages={messages}
                />
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
}

function MessageTime({ date }: { date: Date }) {
  const utc = date.toUTCString();
  return (
    <time
      className="block p-4 text-center text-sm text-gray-500"
      dateTime={utc}
      title={utc}
    >
      {format(date, "Pp", { locale: fr })}
    </time>
  );
}

function LoadMore({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="mx-auto block"
      state="ghost"
      intent="light"
      onPress={onClick}
    >
      Charger plus de messages.
    </Button>
  );
}
