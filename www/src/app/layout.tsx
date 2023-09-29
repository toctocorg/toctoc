//

import { $1 } from "@1/core/$1";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import Providers from "./(index)/Providers";
import { fromServer } from "./api/v1";
import { API_TOKEN } from "./api/v1/OpenAPI.repository";
import "./globals.css";
import { Register_OpenAPI } from "./layout.client";

const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://toc-toc.org"),
  title: "Toc-Toc",
  description: "Réseau d'échanges étudiant",
  icons: { icon: "/favicon.svg" },
};

//

// @$1.server_injection([
//   {
//     token: API_TOKEN,
//     useValue: fromServer,
//   },
// ])
// @$1.container(createChildContainer(root_container))

@$1.module({
  registrationFn: async () => [
    {
      token: API_TOKEN,
      useValue: fromServer,
    },
  ],
  scope: "server-only",
})
export class Root_Module {
  static Provider = RootLayout;
}

export default Root_Module.Provider;

//

export async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={clsx(
          roboto.className,
          "antialiased",
          "bg-[#F5F8FA]",
          "text-base",
        )}
      >
        <NextTopLoader color="#fff" showSpinner={false} />
        <Providers>
          <Register_OpenAPI>{children}</Register_OpenAPI>
        </Providers>

        <Analytics />

        <Script
          src={`/stalker.js?id=${process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"]}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = [];
            function gtag(){dataLayer.push(arguments);}

            gtag('js', new Date());

            gtag('config', '${process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"]}', {
                page_path: window.location.pathname,
                transport_url: window.location.origin + '/api/stalker',
                first_party_collection: true,
            });
          `,
          }}
        />
      </body>
    </html>
  );
}
