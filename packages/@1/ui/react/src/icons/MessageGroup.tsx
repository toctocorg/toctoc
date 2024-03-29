//

import type { SVGProps } from "react";

export function MessageGroup(props: SVGProps<any>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36.27 36.27"
      {...props}
    >
      <path
        className="fill-current"
        d="M34.643,9.254H32.829V23.762a1.819,1.819,0,0,1-1.813,1.813H9.254v1.813a3.638,3.638,0,0,0,3.627,3.627H31.016L38.27,38.27V12.881A3.638,3.638,0,0,0,34.643,9.254ZM29.2,18.321V5.627A3.638,3.638,0,0,0,25.575,2H5.627A3.638,3.638,0,0,0,2,5.627V29.2l7.254-7.254H25.575A3.638,3.638,0,0,0,29.2,18.321Z"
        fill="currentColor"
      />
    </svg>
  );
}
