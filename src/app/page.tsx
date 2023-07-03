import { Noto_Sans_JP } from "next/font/google";

const noto = Noto_Sans_JP({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={
        "flex min-h-screen flex-col items-center justify-between py-24 px-4"
      }
    >
      <h1 className="text-3xl sm:text-7xl">not ready yet (next)</h1>
    </main>
  );
}
