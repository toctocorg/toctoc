//

import { Id } from "@1/core/domain";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { P, match } from "ts-pattern";
import { useUserData } from "~/modules/user";
import { User_Repository_Legacy } from "~/modules/user/User_Repository";
import { useDoorProfile } from "./layout.client";

//

export function AddContact() {
  const {
    update: { useMutation },
  } = useUserData();
  const { info } = useMutation();
  const session_context = useSession();
  const profile = useDoorProfile();

  const query_client = useQueryClient();

  const contacts = (
    session_context.data?.user?.profile.attributes?.contacts?.data ?? []
  ).map(({ id }) => ({ id: Number(id) }));
  const is_a_contact = contacts.some((contact) =>
    profile.id.equal(Id(contact.id)),
  );

  const toggle_add_contact = useCallback(async () => {
    const contacts_ids = is_a_contact
      ? contacts.filter((contact) => !profile.id.equal(Id(contact.id)))
      : contacts.concat([{ id: Number(profile.id.value()) }]);

    await info.mutateAsync({
      contacts: { set: contacts_ids },
    });

    query_client.invalidateQueries(User_Repository_Legacy.keys.contacts());

    session_context.status = "loading";
    setTimeout(async () => {
      await session_context.update();
      info.reset();
    }, 666);
  }, [profile.id.value(), is_a_contact]);

  //

  return match([info, session_context])
    .with([{ status: "loading" }, P._], [P._, { status: "loading" }], () => (
      <Spinner className="h-5 w-5" />
    ))
    .otherwise(() => (
      <Button onPress={toggle_add_contact}>
        {is_a_contact ? "Supprimer" : "Ajouter "}
      </Button>
    ));
}
