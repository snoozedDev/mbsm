import { ThreeDConstruction } from "@/components/3d-construction";
import { ConvexTest } from "@/components/convex-test";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MBSM",
  description: "under construction",
};

export default async function Home() {
  return (
    <main className="flex flex-col items-center pt-12 md:pt-24 px-4">
      <ConvexTest />
      <h1 className="text-xl md:text-3xl font-medium text-center">
        nothing here
      </h1>
      <h2 className="text-lg mt-3">wanna sit down?</h2>
      <ThreeDConstruction />
    </main>
  );
}
