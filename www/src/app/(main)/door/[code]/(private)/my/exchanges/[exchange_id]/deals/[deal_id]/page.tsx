//

import type { Metadata, ResolvingMetadata } from "next";
import tw from "tailwind-styled-components";
import { Deal_Provider, Exchange_Provider } from "../Deal_Provider";
import { Deal_Discussion } from "./Deal_Discussion";
import { Deal_Discussion_Form } from "./Deal_Discussion_Form";
import { SendActionGroup } from "./SendActionGroup";
import { Scrollable_Part, Thread_Avatar } from "./page.client";

//

export async function generateMetadata(
  { params }: { params: { deal_id: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `With@${params.deal_id} :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page({
  params,
}: {
  params: { exchange_id: string; deal_id: string };
}) {
  const exchange_id = Number(params.exchange_id);
  const deal_id = Number(params.deal_id);

  return (
    <Main>
      <Sticky_Container>
        <Exchange_Provider id={exchange_id}>
          <Deal_Provider id={deal_id}>
            <Header>
              <Thread_Avatar />
            </Header>

            <Scrollable_Part>
              <Deal_Discussion />
            </Scrollable_Part>

            <Footer>
              <Deal_Discussion_Form />

              <SendActionGroup />
            </Footer>
          </Deal_Provider>
        </Exchange_Provider>
      </Sticky_Container>
    </Main>
  );
}

const Sticky_Container = tw.div`
  sticky
  top-14
  m-auto
  grid
  h-[calc(100vh_-_theme(spacing.24))]
  w-full
  grid-rows-[max-content_1fr_max-content]
  xl:max-w-[80%]
`;

const Main = tw.main`
  col-span-full
  grid
  grid-rows-[max-content_1fr_max-content]
  bg-white
  text-black
  sm:mb-0
  md:col-span-2
  xl:col-span-3
  [&>*]:px-7
`;

const Header = tw.header`
  z-10
  flex
  flex-row
  justify-between
  space-x-3
  bg-white
  py-7
  text-black
`;

const Footer = tw.footer`
  z-10
  flex
  min-h-[110px]
  flex-col
  items-center
  justify-center
  space-y-4
  bg-white
  py-5
  text-black
`;
