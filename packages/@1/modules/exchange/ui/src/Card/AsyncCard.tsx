//

import { type Exchange } from "@1.modules/exchange.domain";
import { card } from "@1.ui/react/card/atom";
import type { UseQueryResult } from "@tanstack/react-query";
import ContentLoader from "react-content-loader";
import { P, match } from "ts-pattern";
import { Provider as Exchange_ValueProvider } from "./context";

//

export function Exchange_AsyncCard({
  info,
  children,
}: {
  info: UseQueryResult<Exchange>;
  children: (props: { exchange: Exchange }) => React.ReactNode;
}) {
  return match(info)
    .with({ status: "error" }, ({ error }) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loader />)
    .with({ status: "success", data: P.select() }, (exchange) => (
      <Exchange_ValueProvider exchange={exchange}>
        {children({ exchange })}
      </Exchange_ValueProvider>
    ))
    .exhaustive();
}

export function Loader() {
  const { base, body, header } = card();
  return (
    <div className={base()}>
      <div className={body()}>
        <header className={header()}>
          <ContentLoader
            speed={2}
            width={400}
            height={44}
            viewBox="0 0 400 44"
            backgroundColor="#f5f8fa"
            foregroundColor="#ecebeb"
          >
            <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
            <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
            <circle cx="20" cy="20" r="20" />
          </ContentLoader>
        </header>
        <article>
          <ContentLoader
            speed={2}
            width={400}
            height={60}
            viewBox="0 0 400 60"
            backgroundColor="#f5f8fa"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="3" ry="3" width="410" height="6" />
            <rect x="0" y="16" rx="3" ry="3" width="380" height="6" />
            <rect x="0" y="32" rx="3" ry="3" width="178" height="6" />
          </ContentLoader>
        </article>
      </div>
    </div>
  );
}
