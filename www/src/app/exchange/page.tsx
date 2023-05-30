//

import { InputSearch } from "@1/ui/components/InputSearch";
import { Footer } from "@1/ui/shell";
import { UserBar } from "../(index)/UserBar";
import { ExchangeList } from "./ExchangeList";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page() {
  const now = await getServerDate();
  return (
    <>
      <UserBar />
      <ExchangePanel />
      <Footer now={now} />
    </>
  );
}

//

function ExchangePanel() {
  return (
    <div className="mt-10 grid justify-between gap-5 px-1 lg:grid-cols-holy-grail">
      <aside className="hidden  lg:block lg:px-10">
        <article>
          <h3 className="font-bold uppercase text-[#00adee]">Échanges</h3>

          <InputSearch />

          <ul></ul>
        </article>
      </aside>
      <main>
        <ExchangeList />
      </main>
      <aside className="lg:px-10">
        <SeeAlso />
      </aside>
    </div>
  );
}

async function getServerDate() {
  return new Date().toISOString();
}
