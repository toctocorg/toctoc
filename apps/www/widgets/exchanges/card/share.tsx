//

import { Share_Button } from ":components/Share_Button";
import { useExchange } from "@1.modules/exchange.ui/Card/context";
import { Share } from "@1.ui/react/icons";

//

export function Exchange_Share() {
  const exchange = useExchange();
  const href = `${window.location.origin}/exchanges?q=${exchange.title
    .split(" ")
    .join("+")}`;
  return (
    <Share_Button className="-mr-4" href={href}>
      <Share className="h-5 w-5 text-white" />
    </Share_Button>
  );
}
