//

import { get_csrf_token } from "@1.modules/auth.next/csrf_token";
import { UserAvatarFilled } from "@1.ui/react/icons";
// import { UserAvatarFilled } from "@1.ui/react/icons";
import { TRPC_SSR } from ":trpc/server";
import {
  PROFILE_ROLES,
  Profile_Schema,
  Studient_Schema,
} from "@1.modules/profile.domain";
import { input } from "@1.ui/react/form/atom";
import type { Metadata, ResolvingMetadata } from "next";
import { tv } from "tailwind-variants";
import { EmailInput, SignInButton } from "./page.client";

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
  const csrfToken = get_csrf_token();

  const categories = await TRPC_SSR.category.exchange.fetch();

  const { base, form, label } = style();
  const profile_names = Profile_Schema.keyof().Enum;
  const studient_names = Studient_Schema.keyof().Enum;

  return (
    <main className={base()}>
      <form className={form()} method="post" action="/api/auth/callback/signin">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <input
          name="role"
          type="hidden"
          defaultValue={PROFILE_ROLES.enum.STUDIENT}
        />

        <div className="mx-auto">
          <UserAvatarFilled className="h-14 w-14 text-gray-400" />
        </div>

        <div className="container mx-auto grid grid-cols-12 gap-5 xl:max-w-4xl">
          <input
            className={input({ className: "col-span-full " })}
            id={profile_names.name}
            name={profile_names.name}
            placeholder="Prenom et Nom"
            required
            type="text"
          />
          <input
            className={input({ className: "col-span-full " })}
            id={studient_names.university}
            name={studient_names.university}
            placeholder="Université"
            required
            type="text"
          />
          <input
            className={input({ className: "col-span-full " })}
            id={studient_names.field_of_study}
            name={studient_names.field_of_study}
            placeholder="Domain d'étude"
            type="text"
          />
          <textarea
            className={input({ className: "col-span-full " })}
            id={profile_names.bio}
            name={profile_names.bio}
            placeholder="À propos"
          />
          <input
            className={input({ className: "col-span-full " })}
            id={studient_names.city}
            name={studient_names.city}
            placeholder="Ville"
            type="text"
          />
          <input
            className={input({ className: "col-span-full" })}
            id={studient_names.language}
            name={studient_names.language}
            placeholder="Langue"
            type="text"
          />
          <select
            className={input({ className: "col-span-full" })}
            name={studient_names.interest}
          >
            <option hidden value={""}>
              Intéressé par
            </option>
            {categories.map(({ name, id }) => (
              <option value={String(id)} key={id}>
                {name}
              </option>
            ))}
          </select>
          <label className={label()}>
            <div className="flex-1">Email address</div>
            <EmailInput
              className={input({ className: "w-fit flex-grow opacity-50" })}
              id="email"
              name="email"
              placeholder="Email"
              required
              type="email"
            />
          </label>
        </div>
        <SignInButton>Terminer</SignInButton>
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
