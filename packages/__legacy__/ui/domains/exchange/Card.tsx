//

import { tv } from "tailwind-variants";

//

export const card = tv({
  base: [
    "overflow-hidden rounded-xl bg-white text-black",
    "shadow-[5px_5px_10px_#7E7E7E33]",
  ],
  slots: {
    body: "p-6",
    header: "mb-4 flex flex-1 justify-between",
  },
});
