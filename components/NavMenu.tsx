import Link from "next/link";
import { useRouter } from "next/router";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const NavMenu = () => {
  const { pathname } = useRouter();
  console.log({ pathname });
  let tabs = [
    { name: "Index", href: "/" },
    { name: "Sign Up", href: "/auth/sign_up" },
    { name: "Log In", href: "/auth/log_in" },
  ];
  return (
    <div className="top-10 absolute">
      <div className="block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              className={classNames(
                pathname === tab.href
                  ? "bg-nord3 text-nord6 dark:bg-nord3 dark:text-nord4"
                  : "text-nord3 hover:bg-nord4 dark:text-nord4 dark:hover:bg-nord1",
                "px-3 py-2 font-medium text-sm rounded-md"
              )}
              aria-current={pathname === tab.href ? "page" : undefined}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

const Linky = ({ text }: { text: string }) => (
  <span className="text-xl underline">{text}</span>
);
