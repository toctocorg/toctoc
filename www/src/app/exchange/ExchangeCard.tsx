//

import { AvatarMediaHorizontal } from "@/components/Avatar";
import { Exchange } from "@1/ui/icons";
import clsx from "clsx";
import { P, match } from "ts-pattern";
import { ExchangeViewModel } from "./models/ExchangeViewModel";

//

export function ExchangeCard({ exchange }: { exchange: ExchangeViewModel }) {
  
  return (
    <div className="overflow-hidden rounded-xl bg-white text-black shadow-[5px_5px_10px_#7E7E7E33]">
      <div className="p-6">
        <header className="mb-4 flex justify-between">
          <AvatarMediaHorizontal
            u={exchange.profile.id}
            university={exchange.profile.university}
            username={exchange.profile.name}
          />
          <time
            className="mt-3 text-xs"
            dateTime={exchange.updatedAt.toUTCString()}
            title={exchange.updatedAt.toUTCString()}
          >
            {exchange.updatedAt.toLocaleDateString("fr")}
          </time>
        </header>
        <hr className="my-2" />
        <div className="items-center justify-between text-xs text-[#707070] sm:flex">
          <div className="inline-flex">
            <span
              className={clsx("min-w-[100px] font-bold uppercase ", {
                "text-Eminence": exchange.type === "proposal",
                "text-Congress_Blue": exchange.type === "research",
              })}
            >
              {match(exchange.type)
                .with("proposal", () => "Proposition")
                .with("research", () => "Recherche")
                .exhaustive()}
            </span>
            <span className="font-bold">
              📍
              {match(exchange.is_online)
                .with(true, () => "En ligne")
                .with(false, () => exchange.location)
                .exhaustive()}
            </span>
          </div>
          <div className=" flex items-center justify-between">
            <span className="whitespace-nowrap font-bold uppercase">
              {exchange.category.name}
            </span>
            <Exchange
              className={clsx("mx-1 w-5", {
                "text-Chateau_Green": !Boolean(exchange.in_exchange_of),
                "text-Gamboge": Boolean(exchange.in_exchange_of),
              })}
            />
            <span className="whitespace-nowrap font-bold">
              {match(exchange.in_exchange_of)
                .with(undefined, () => "Sans échange")
                .with(P._, (category) => category.name)
                .exhaustive()}
            </span>
          </div>
        </div>
        <hr className="my-2" />
        <article>
          <h3 className="my-5 text-2xl font-bold">{exchange.title}</h3>
          <p>{exchange.description}</p>
        </article>
      </div>
      <footer
        className={clsx("mt-4 px-5 py-3 text-white", {
          "bg-Eminence": exchange.type === "proposal",
          "bg-Congress_Blue": exchange.type === "research",
        })}
      >
        <div className="flex justify-between">
          <button className="block">🔖</button>
          <button className="block rounded-full bg-Chateau_Green px-7 text-white">
            Demander
          </button>
          <button className="block">↗️</button>
        </div>
      </footer>
    </div>
  );
}
