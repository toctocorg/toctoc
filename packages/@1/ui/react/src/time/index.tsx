//

import type { Entity_Timestamps } from "@1.modules/core/domain";
import { isEqual as date_isEqual, formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import type { ComponentProps } from "react";

//

export function TimeInfo({ timestamps }: { timestamps: Entity_Timestamps }) {
  const { created_at, updated_at } = timestamps;
  const has_been_edited = !date_isEqual(created_at, updated_at);

  const time_distance = formatDistance(created_at, new Date(), {
    locale: fr,
  });

  //

  if (has_been_edited) {
    return (
      <div className="mt-3 text-xs">
        <time
          dateTime={updated_at.toUTCString()}
          title={updated_at.toUTCString()}
        >
          {time_distance}
        </time>
        {" • "}
        <time
          dateTime={created_at.toUTCString()}
          title={created_at.toUTCString()}
        >
          editée
        </time>
      </div>
    );
  }

  return (
    <time
      className="mt-3 text-xs"
      dateTime={created_at.toUTCString()}
      title={created_at.toUTCString()}
    >
      {time_distance}
    </time>
  );
}

export function TimeAgo({
  timestamp,
  ...time_props
}: { timestamp: Date } & ComponentProps<"time">) {
  const time_distance = formatDistance(timestamp, new Date(), {
    locale: fr,
  });

  return (
    <time
      dateTime={timestamp.toUTCString()}
      title={timestamp.toUTCString()}
      {...time_props}
    >
      {time_distance}
    </time>
  );
}
