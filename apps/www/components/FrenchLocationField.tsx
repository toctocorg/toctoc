"use client";

import { TRPC_React } from ":trpc/client";
import type { Location } from "@1.modules/core/Location";
import { select } from "@1.ui/react/form/atom";
import { Spinner } from "@1.ui/react/spinner";
import { useDebouncedCallback } from "@react-hookz/web";
import type { QueryObserverSuccessResult } from "@tanstack/react-query";
import { type FieldAttributes } from "formik";
import { useState } from "react";
import {
  Button,
  ComboBox,
  FieldError,
  Group,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
} from "react-aria-components";
import { tv } from "tailwind-variants";

//

export function FrenchLocationField(
  props: FieldAttributes<{ use_formik?: boolean }> & {
    value: string;
    onChange: (value: string) => void;
  },
) {
  const [location, set_location] = useState(
    String(props.defaultValue ?? "Paris"),
  );

  const query_info = TRPC_React.locations.useQuery(
    { location },
    { keepPreviousData: true, staleTime: Infinity },
  );
  const handleChange = useDebouncedCallback<any>(
    (value: string) => {
      set_location(value);
      props.onChange(value);
    },
    [set_location],
    100,
    600,
  );

  return (
    <fieldset className="w-full" disabled={props.disabled}>
      <ComboBox
        onInputChange={handleChange}
        items={query_info.data}
        formValue="text"
        className="relative"
      >
        {query_info.isFetching && !query_info.isLoading && (
          <Text slot="description">
            <Spinner className="absolute -left-6 top-2.5 size-4" />
          </Text>
        )}
        <Group className="flex bg-white bg-opacity-90 shadow-md ring-1 ring-black/10 transition focus-within:bg-opacity-100 focus-visible:ring-2 focus-visible:ring-black">
          <Input
            className="w-full flex-1 border-none bg-transparent px-3 py-2 text-base leading-5 text-gray-900 outline-none"
            defaultValue={location}
            value={props.value}
            onChange={(e) => handleChange(e.target.value)}
          />
          <Button className="pressed:bg-sky-100 flex items-center border-0 border-l border-solid border-l-sky-200 bg-transparent px-3 text-gray-700 transition">
            {">"}
          </Button>
        </Group>
        <FieldError>Erreur</FieldError>
        <Popover className="w-[--trigger-width] bg-white p-1 outline-none">
          <ListBox>
            <FrenchLocationField.SuccessFlat
              {...props}
              className="py-2 pl-2 pr-4 outline-none"
              query_info={query_info as QueryObserverSuccessResult<Location[]>}
            />
          </ListBox>
        </Popover>
      </ComboBox>
    </fieldset>
  );
}

FrenchLocationField.Error = function Error() {
  return (
    <ListBoxItem
      className={select({ className: "bg-transparent text-danger" })}
    >
      Une erreur est survenue. Veuillez réessayer.
    </ListBoxItem>
  );
};
FrenchLocationField.SuccessFlat = function SuccessFlat(
  props: FieldAttributes<{}> & {
    query_info: QueryObserverSuccessResult<Location[]>;
  },
) {
  const {
    query_info: { data },
    ref,
    ...other_props
  } = props;
  const { className, name, disabled } = other_props;

  return data?.map(({ nom, departement }) => (
    <ListBoxItem
      key={nom + departement.code}
      id={nom}
      textValue={nom}
      className={item({ className })}
      {...{ name, disabled }}
    >
      {nom}
      <span>
        {departement.nom}-{departement.code}
      </span>
    </ListBoxItem>
  ));
};

const item = tv({ base: `flex justify-between` });
