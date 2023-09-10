///

import { Grid } from "@1/ui/components/Grid";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { AppFooter } from "~/components/AppFooter.server";
import { UserBar } from "~/components/UserBar";
import { AsideWithTitle } from "~/components/layouts/holy/aside";
import { get_StrapiRepository } from "~/core";
import { Categories_Repository } from "~/modules/categories/Categories_Repository";
import { getQueryClient } from "../../core/getQueryClient";
import { CategoriesList, SearchForm } from "./(page)";

export default async function Layout({ children }: PropsWithChildren) {
  const strapi_repository = await get_StrapiRepository();
  const repository = new Categories_Repository(strapi_repository);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: Categories_Repository.keys.exchange(),
    queryFn: () => repository.exchange(),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid>
        <Hydrate state={dehydratedState}>
          <AsideWithTitle title="Échanges">
            <SearchForm />
            {/* <ExhangesFilter /> */}
            <hr className="my-10" />

            <CategoriesList />
          </AsideWithTitle>
          {children}
        </Hydrate>
      </Grid>
      <AppFooter />
    </div>
  );
}
