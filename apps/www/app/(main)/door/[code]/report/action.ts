"use server";

import { trpc } from "@1.modules/auth.next/trpc";
import { create_report } from "@1.modules/profile.domain/report";
import to from "await-to-js";
import { z } from "zod";

//

const create_report_form = create_report.extend({
  attachments: z
    .custom<File>()
    .transform(async (file) => {
      const bytes = await file.arrayBuffer();
      const base64String = Buffer.from(bytes).toString("base64");
      return `data:${file.type};base64,${base64String}`;
    })
    .optional(),
});
export async function report(
  state: z.TypeOf<typeof create_report_form>,
  formData: FormData,
) {
  const validatedFields = await create_report_form.safeParseAsync(
    Object.values(create_report_form.keyof().Enum).reduce(
      (acc, key) => ({ ...acc, [key]: formData.get(key) }),
      {},
    ),
  );

  if (!validatedFields.success) {
    return {
      ...state,
      sucess: false,
      errors: validatedFields.error.flatten().fieldErrors,
      report_error: null,
    };
  }

  const input = validatedFields.data;

  const [report_error] = await to(trpc.profile.me.report.mutate(input));
  if (report_error) {
    return {
      ...state,
      errors: null,
      sucess: false,
      report_error: report_error.message,
    };
  }

  return {
    ...state,
    sucess: true,
    errors: null,
    report_error: null,
  };
}
