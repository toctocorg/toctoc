//

import dynamic from "next/dynamic";

//

const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

const content = `
# Politique d'utilisation


`;

export default function Page() {
  return (
    <main className="prose lg:prose-xl container mx-auto my-32">
      <ReactMarkdown>{content}</ReactMarkdown>
    </main>
  );
}