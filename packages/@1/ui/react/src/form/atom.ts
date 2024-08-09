//

import { tv } from "tailwind-variants";

//

export const label = tv({
  base: `mb-2 block text-base font-medium text-gray-900`,
  variants: {
    tv$color: {
      danger: "border-danger",
      success: "border-success",
    },
    tv$size: {
      base: ` `,
    },
  },
  defaultVariants: {
    tv$size: "base",
  },
});

//

export const input = tv({
  base: `
    block
    w-full
    rounded-sm
    border
    border-solid
    border-Silver_Chalice
    placeholder-Silver_Chalice
    focus:ring-gray-900
    disabled:pointer-events-none
    disabled:opacity-50
   `,
  variants: {
    wrong_value: {
      true: "border-2 border-danger",
    },
    tv$color: {
      success: "border-success",
    },
    tv$size: {
      base: `p-2.5 text-gray-900 focus:border-gray-500`,
      xs: `p-2 text-gray-900 focus:border-gray-500`,
    },
  },
  defaultVariants: {
    tv$size: "base",
  },
});

//

export const fieldset = tv({
  base: `
    flex
    justify-around
    rounded-md
    border
    border-Silver_Chalice
    bg-white
    p-4
    disabled:pointer-events-none
    disabled:opacity-50
    md:flex-row
    md:items-center
    [&>label]:flex
    [&>label]:items-center
    [&>label]:space-x-3
  `,
  variants: {
    horizontal: {
      true: "flex-col items-start gap-4 p-4",
    },
  },
});

export const select = tv({
  base: `
    w-full
    border
    border-Silver_Chalice
    bg-white
    p-2.5
    disabled:pointer-events-none
    disabled:opacity-50
  `,
  variants: {},
});
