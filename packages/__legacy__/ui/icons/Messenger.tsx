//

import type { SVGProps } from "react";

export function Messenger(props: SVGProps<any>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 0C5.373 0 0 4.974 0 11.111a10.8 10.8 0 0 0 4.438 8.633l.031.021V24l4.088-2.242c1.031.295 2.215.464 3.439.464H12c6.627 0 12-4.975 12-11.11S18.627 0 12 0zm1.191 14.963L10.136 11.7l-5.963 3.26L10.732 8l3.131 3.259L19.752 8z"
      />
    </svg>
  );
}
