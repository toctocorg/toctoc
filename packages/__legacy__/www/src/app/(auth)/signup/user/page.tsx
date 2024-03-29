//

import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { UserForm } from "./UserForm";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Studient :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  return (
    <Suspense>
      <UserForm />
    </Suspense>
  );
}

//
