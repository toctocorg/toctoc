//

import { TRPC_React } from ":trpc/client";
import type { BookmarkButton_Props } from "@1.modules/bookmark.ui/BookmarkButton";
import { useExchange } from "@1.modules/exchange.ui/Card/context";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { button } from "@1.ui/react/button/atom";
import { Bookmark } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import { useSession } from "next-auth/react";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";

//

export function Exchange_Bookmark() {
  const exchange = useExchange();
  const { data: session } = useSession();
  const is_studient = session?.profile.role === PROFILE_ROLES.Enum.STUDIENT;
  const query = TRPC_React.bookmarks.check.useQuery({
    target_id: exchange.id,
    type: "exchange",
  });

  if (!is_studient) {
    return null;
  }

  return match(query)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(error);
      return null;
    })
    .with({ status: "loading" }, () => <Spinner className="h-4 w-4" />)
    .with({ status: "success", data: P.select() }, (is_in_bookmarks) => (
      <BookmarkItem_Toggle_Mutation
        className="px-0"
        target_id={exchange.id}
        type="exchange"
        variants={{ is_in_bookmarks }}
      />
    ))
    .exhaustive();
}

function BookmarkItem_Toggle_Mutation(props: BookmarkButton_Props) {
  const { className, target_id, type, variants } = props;
  const toggle = TRPC_React.bookmarks.toggle.useMutation();
  const utils = TRPC_React.useUtils();
  const { base, icon } = style({ ...variants });
  return (
    <button
      className={base({ className, intent: "light" })}
      onClick={async () => {
        await toggle.mutateAsync({ target_id, type });
        await utils.bookmarks.check.invalidate({ target_id, type });
        await utils.bookmarks.exchanges.find.invalidate();
      }}
    >
      <Bookmark className={icon()} />
    </button>
  );
}
const style = tv({
  extend: button,
  base: "h-5 w-5",
  variants: {
    is_in_bookmarks: {
      true: { icon: "text-success" },
    },
  },
  slots: {
    icon: "h-5 w-5 text-white",
  },
});