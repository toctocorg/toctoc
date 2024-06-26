"use client";

import { PLATFORMS_MAP, useUserAgent } from ":components/hooks/useUserAgent";
import type { Params } from ":pipes/thread_by_id";
import { TRPC_React } from ":trpc/client";
import { useEnterToSubmit } from "@1.ui/react/form";
import { SendButton } from "@1.ui/react/form/SendButton";
import { input } from "@1.ui/react/form/atom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

//

const form_zod_schema = z.object({
  message: z.string().trim().min(1),
});
type FormValues = z.infer<typeof form_zod_schema>;

export default function Conversation_Form({ thread_id }: Params) {
  const browser = useUserAgent();

  const { register, handleSubmit, formState, setValue, setFocus } =
    useForm<FormValues>({
      resolver: zodResolver(form_zod_schema),
    });
  const { mutateAsync } = TRPC_React.inbox.thread.send.useMutation();
  const on_submit: SubmitHandler<FormValues> = async ({ message: content }) => {
    if (content === "") return;

    await mutateAsync({ content, thread_id });
    setValue("message", "");
    setFocus("message");
  };

  if (browser.getPlatformType() === PLATFORMS_MAP.desktop)
    useEnterToSubmit({
      is_submitting: formState.isSubmitting,
      on_submit: handleSubmit(on_submit),
    });

  useLayoutEffect(() => {
    setFocus("message");
  }, [setFocus]);

  return (
    <form className="relative w-full" onSubmit={handleSubmit(on_submit)}>
      <textarea
        {...register("message")}
        autoComplete="off"
        className={input({
          className: `
            peer
            max-h-32
            min-h-16
            w-full
            resize-none
            rounded-2xl
            pr-14
          `,
        })}
        readOnly={formState.isSubmitting}
        placeholder="Envoie un Message…"
      ></textarea>
      <SendButton isSubmitting={formState.isSubmitting} />
    </form>
  );
}
