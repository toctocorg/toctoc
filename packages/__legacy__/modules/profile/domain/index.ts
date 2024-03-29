//

import { Entity, Result } from "@1/core/domain";
import { ZodError, z } from "zod";
import { z_strapi_entity_data } from "../../common";
import { Entity_Schema } from "../../common/record";

//

export const Profile_PropsSchema = Entity_Schema.augment({
  firstname: z.string(),
  lastname: z.string(),
  about: z.string().default(""),
  university: z.string(),
  image: z_strapi_entity_data(z.any()).optional(),
}).describe("Profile_PropsSchema");

type Props = z.TypeOf<typeof Profile_PropsSchema>;
type Props_Input = z.input<typeof Profile_PropsSchema>;

export class Profile extends Entity<Props> {
  static override create(props: Props_Input): Result<Profile, ZodError> {
    const result = Profile_PropsSchema.safeParse(props, {
      path: ["<Profile.create>", "props"],
    });
    if (result.success) {
      return Result.Ok(new Profile(result.data));
    } else {
      return Result.fail(result.error);
    }
  }

  static zero = z.instanceof(Profile).parse(
    Profile.create({
      firstname: "Utilisateur",
      lastname: "Inconnu",
      university: "",
    }).value(),
    { path: ["Profile.zero"] },
  );

  //

  get firstname() {
    return this.props.firstname;
  }

  get lastname() {
    return this.props.lastname;
  }

  get university() {
    return this.props.university;
  }
  get name() {
    return [this.props.firstname, this.props.lastname].join(" ");
  }

  get url() {
    return `/@${this.props.id}`;
  }
}
