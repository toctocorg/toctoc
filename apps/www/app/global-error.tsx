"use client";

import * as Sentry from "@sentry/nextjs";
// import Error from "next/error";
import { Error_Layout } from ":components/Error_Layout";
import { MenuBurger } from ":components/burger";
import { BigBar } from ":components/shell/BigBar";
import { ErrorOccur } from "@1.ui/react/error";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";

//

const SerkelsLogo = dynamic(() => import(":components/shell/SerkelsLogo"), {
  ssr: false,
  loading() {
    return <VisuallyHidden>Serkels</VisuallyHidden>;
  },
});

//
export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className={`bg-[#F5F8FA] text-base text-black antialiased`}>
        <main className="flex min-h-screen flex-col">
          <BigBar>
            <MenuBurger />
            <Link href="/">
              <SerkelsLogo />
            </Link>
          </BigBar>

          <div className="flex-grow">
            <Error_Layout className="min-h-[100dvh]">
              <ErrorOccur
                error={error}
                debug={process.env.NODE_ENV === "development"}
              />
            </Error_Layout>
          </div>
        </main>
      </body>
    </html>
  );
}
