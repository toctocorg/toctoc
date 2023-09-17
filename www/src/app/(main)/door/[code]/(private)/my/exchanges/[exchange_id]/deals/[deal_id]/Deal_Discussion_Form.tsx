"use client";

import { useIsFetching } from "@tanstack/react-query";
import { Field, Form, Formik, type FieldAttributes } from "formik";
import tw from "tailwind-styled-components";
import { useContainer } from "~/core/react";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";
import { Deal_QueryKeys } from "~/modules/exchange/queryKeys";
import { useDeal_Value } from "../Deal.context";

//

export function Deal_Discussion_Form() {
  const [deal] = useDeal_Value();

  const query_count = useIsFetching({
    queryKey: Deal_QueryKeys.messages(deal.get("id")),
  });

  const container = useContainer()
    .createChildContainer()
    .registerInstance(Deal_Message_Repository.DEAL_ID_TOKEN, deal.get("id"));

  const {
    create: { useMutation },
  } = container.resolve(Deal_Message_Controller);

  const { mutate: send_message } = useMutation();

  return (
    <Formik
      initialValues={{
        message: "",
      }}
      enableReinitialize
      onSubmit={async (value, formik) => {
        send_message(value.message);
        formik.resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="w-full">
          <Input
            name="message"
            disabled={isSubmitting || query_count > 0}
            placeholder="Envoie un Message…"
          />
        </Form>
      )}
    </Formik>
  );
}

const Input = tw((props: FieldAttributes<unknown>) => <Field {...props} />)`
  block
  w-full
  rounded-2xl
  border
  border-[#33333333]
  px-4
  py-3
  text-sm
  xl:max-w-[400px]
`;
