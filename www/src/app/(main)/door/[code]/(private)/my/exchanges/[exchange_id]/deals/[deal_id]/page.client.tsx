"use client";

import { useIsFetching } from "@tanstack/react-query";
import { useRef, type PropsWithChildren } from "react";
import { useDebounce, useScroll } from "react-use";
import tw from "tailwind-styled-components";
import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";
import { Deal_QueryKeys } from "~/modules/exchange/queryKeys";
import { useDeal_Value } from "../Deal.context";

//

const SCROLLABLE_PART_THRESHOLD = 88;

//

export function Thread_Avatar() {
  const [deal] = useDeal_Value();
  if (!deal) return null;
  return <Avatar_Show_Profile profile={deal.profile} />;
}

export function Scrollable_Part({ children }: PropsWithChildren) {
  const [deal] = useDeal_Value();
  const query_count = useIsFetching({
    queryKey: Deal_QueryKeys.messages(deal.get("id")),
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { x, y } = useScroll(messagesEndRef);

  useDebounce(
    () => {
      if (!messagesEndRef.current) return;
      const { scrollHeight, scrollTop, clientHeight } = messagesEndRef.current;
      const is_near_bottom =
        Math.floor(scrollHeight - clientHeight - scrollTop) <
        SCROLLABLE_PART_THRESHOLD;

      if (is_near_bottom) {
        messagesEndRef.current.scrollTo({
          top: scrollHeight,
          behavior: "smooth",
        });
      }
    },
    666,
    [y, messagesEndRef.current, query_count],
  );

  // useEffect(() => {
  //   if (!messagesEndRef.current) return;
  //   setTimeout(() => {
  //     if (!messagesEndRef.current) return;

  //     messagesEndRef.current.scrollTo({
  //       top: messagesEndRef.current.scrollHeight,
  //     });
  //   }, 123);
  // }, [messagesEndRef.current]);

  return (
    <div className=" -mr-6 overflow-y-auto py-4 pr-5" ref={messagesEndRef}>
      {children}
    </div>
  );
}
export const Scrollable_Part_ = tw.div`
  -mr-6
  overflow-y-auto
  py-4
  pr-5
`;
