//

import { input } from "@1.ui/react/form/atom";
import type { Metadata, ResolvingMetadata } from "next";
import { tv } from "tailwind-variants";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Report :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default function Page() {
  const { form, label } = style();
  return (
    <main className="container prose mx-auto my-32 lg:prose-xl">
      <h1>Signalement</h1>

      <form className={form()}>
        <label className={label()}>
          <div className="flex-1">Email address</div>
          <input
            className={input({ className: "w-fit flex-grow opacity-50" })}
          />
        </label>
      </form>
    </main>
  );
}

//

const style = tv({
  base: "container mx-auto my-10 flex max-w-4xl flex-col justify-center",
  slots: {
    form: "flex flex-col justify-center space-y-10",
    label: "col-span-full flex items-center space-x-1",
  },
});
