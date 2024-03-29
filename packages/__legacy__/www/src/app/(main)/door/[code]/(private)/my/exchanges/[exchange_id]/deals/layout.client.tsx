"use client";

import { useInject } from "@1/next-tsyringe";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { createStateContext } from "react-use";
import { tv } from "tailwind-variants";
import type { InjectionToken } from "tsyringe";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import { AsideBar } from "~/components/layouts/holy/aside";

//

const [useDeal_Route_Context, Deal_Route_Provider] = createStateContext({
  deal_id: NaN,
});

export { Deal_Route_Provider, useDeal_Route_Context };

export function Deals_Aside_Nav({ children }: PropsWithChildren) {
  const exchange_id = useInject(
    Symbol.for("ROUTE_EXCHANGE_ID_TOKEN") as InjectionToken<number>,
  );
  const pathname = usePathname();

  const [{ door_id }] = useDoor_Value();
  const is_active =
    pathname === `/@${door_id}/my/exchanges/${exchange_id}/deals`;

  console.log(
    "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals/layout.client.tsx",
    { exchange_id },
  );
  return (
    <AsideBar className={navbar({ $alone: is_active })}>{children}</AsideBar>
  );
}

const navbar = tv({
  // base: "col-span-full h-full max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))] flex-col overflow-hidden pt-8 pt-8",
  base: ["col-span-full"],
  variants: {
    $alone: {
      true: "block px-4 md:col-span-4 md:col-start-4 lg:col-span-4",
      // false: "-mx-8 md:hidden lg:flex",
    },
  },
});
