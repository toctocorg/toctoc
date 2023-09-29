//

import Nest from "react-nest";
import { ROUTE_EXCHANGE_ID_TOKEN } from "../../register";
import { Exchange_Provider } from "../Deal_Provider";
import { register } from "../register";
import { Deals_Nav } from "./page.client";

export default async function Page({ params }: { params: any }) {
  const container = await register({ params });
  const exchange_id = container.resolve(ROUTE_EXCHANGE_ID_TOKEN);

  console.log(
    "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals/@nav/page.tsx",
    params,
    exchange_id,
  );
  return (
    <Nest>
      <Exchange_Provider id={exchange_id} />
      <Deals_Nav />
    </Nest>
  );
}
