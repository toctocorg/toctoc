///

import { AsideBar } from "@/layouts/holy/aside";
import type { PropsWithChildren } from "react";
import { Exchange_Messaging } from "./Exchange_Messaging";

export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { exchange_id: string } }>) {
  const exchange_id = Number(params.exchange_id);
  return (
    <>
      <AsideBar>
        <div className="sticky top-[calc(theme(spacing.14)_+_theme(spacing.6))]">
          <Exchange_Messaging exchange_id={exchange_id} />
        </div>
      </AsideBar>
      {children}
    </>
  );
}
