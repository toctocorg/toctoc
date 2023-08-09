"use client";

import { School } from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useMemo, type ComponentPropsWithoutRef } from "react";

//

export function Avatar(
  props: ComponentPropsWithoutRef<"img"> & { u?: string | number | undefined },
) {
  const { className, u, ...other_props } = props;

  const { data: session } = useSession();
  const id = u ?? session?.user?.profile.id;

  const image = useMemo(() => `/api/v1/avatars/u/${id}`, [id]);

  return (
    <img
      className={clsx("rounded-full object-cover", className)}
      src={image}
      {...other_props}
    />
  );
}

export function AvatarMediaVertical(props: ComponentPropsWithoutRef<"figure">) {
  const { className, ...other_props } = props;
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <figure
      className={clsx("flex flex-col items-center", className)}
      {...other_props}
    >
      <Avatar className="h-14 w-14" />
      <figcaption>
        <h4
          className="mb-2 mt-3 text-xl font-bold text-Cerulean"
          title={session.user!.name!}
        >
          {session.user?.name}
        </h4>
        <small className="block text-center text-xs text-Dove_Gray">
          <School className="mr-1.5 inline-block w-4" />
          <span>{session.user?.profile.attributes?.university}</span>
        </small>
      </figcaption>
    </figure>
  );
}

export function AvatarMediaHorizontal(
  props: ComponentPropsWithoutRef<"figure">,
) {
  const { className, ...other_props } = props;
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <figure
      className={clsx("flex items-center space-x-7", className)}
      {...other_props}
    >
      <Avatar className="h-14 w-14" />
      <figcaption>
        <h4
          className="text-xl font-bold text-Cerulean"
          title={session.user!.name!}
        >
          {session.user?.name}
        </h4>
        <small className="block text-sm text-Dove_Gray">
          <School className="mr-1.5 inline-block w-6" />
          <span>{session.user?.profile.attributes?.university}</span>
        </small>
      </figcaption>
    </figure>
  );
}
