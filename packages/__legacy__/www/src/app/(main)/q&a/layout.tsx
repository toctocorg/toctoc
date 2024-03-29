///

import { NextTsyringe } from "@1/next-tsyringe";
import { Grid } from "@1/ui/components/Grid";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { AsideWithTitle } from "~/components/layouts/holy/aside";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";
import { Main_Module } from "../layout";
import { CategoriesList, QAFilter } from "./page.client";

@NextTsyringe.module({
  parent: Main_Module,
})
export class QA_Module {
  static Provider = QA_Layout;
}
export default QA_Module.Provider;

//
//
//

export async function QA_Layout({
  children,
  see_also,
}: PropsWithChildren<{ see_also: React.ReactNode }>) {
  const container = await NextTsyringe.injector(Main_Module);

  const queryClient = await container
    .resolve(Get_Category_UseCase)
    .prefetch("question");
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Grid className="col-span-full">
        <AsideWithTitle title="Question-Réponse">
          <QAFilter />

          <hr className="my-10" />

          <CategoriesList />
        </AsideWithTitle>
        <div className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
          {children}
        </div>
        <aside className="col-span-3 mt-10 hidden lg:px-10 xl:block">
          {see_also}
        </aside>
      </Grid>
    </Hydrate>
  );
}
