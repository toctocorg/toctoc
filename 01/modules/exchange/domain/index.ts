//

import { Entity, Ok, Result } from "@1/core/domain";
import { z } from "zod";
import type { Category } from "../../category/domain";
import type { Profile } from "../../profile/domain";
import { Type, type TypeProps } from "./Type.value";

//

export interface Exchange_Props {
  id: number;
  // done: boolean;

  available_places: number;
  category: Category;
  createdAt: Date;
  description: string;
  in_exchange_of: Category | undefined;
  is_online: boolean;
  location?: string;
  places: number;
  profile: Profile;
  slug: string;
  title: string;
  type: Type;
  updatedAt: Date;
  when: Date;
}

export class Exchange extends Entity<Exchange_Props> {
  private constructor(props: Exchange_Props) {
    super(props);
  }

  static override create(props: Exchange_Props): Result<Exchange, Error> {
    return Ok(new Exchange(props));
  }

  get profile() {
    return this.props.profile;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
  get title() {
    return this.props.title;
  }
  get description() {
    return this.props.description;
  }
  get type() {
    return this.props.type.get("value");
  }
  get is_online() {
    return this.props.is_online;
  }
  get location() {
    return this.props.location;
  }
  get category() {
    return this.props.category;
  }
  get in_exchange_of() {
    return this.props.in_exchange_of;
  }
  get when() {
    return this.props.when;
  }
}

//

export interface Exchange_CreateProps {
  type: TypeProps["value"];
  is_online: boolean;
  in_exchange_of?: string | undefined;
}

export const Exchange_Create_Schema = z.object(
  {
    places: z.coerce.number({ description: "places" }).min(1).max(100),
    is_online: z.coerce.boolean({ description: "is_online" }),
    title: z.string().trim().nonempty(),
    description: z.string().trim().nonempty(),
    location: z.string().trim().optional(),
    when: z.coerce.date(),
    type: Type.schema,
    category: z.coerce.number(),
    in_exchange_of: z.coerce.number().optional(),
  },
  { description: "exchange" },
);

export interface Exchange_CreateProps_
  extends Pick<
    Exchange_Props,
    | "available_places"
    | "description"
    | "is_online"
    | "location"
    | "places"
    | "title"
  > {
  category: string;
  in_exchange_of?: string | undefined;
  type: TypeProps["value"];
  when: string;
}
