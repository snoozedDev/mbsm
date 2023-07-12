import Image from "next/image";
import Link from "next/link";

export const SiteHeader = () => {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur">
      <div className="container flex h-14 items-center">
        <Link href={"/"}>
          <Image alt="icon" src={"/icon_white.svg"} width={48} height={1} />
        </Link>
      </div>
    </header>
  );
};
