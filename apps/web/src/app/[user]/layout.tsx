import { UserCard } from "@/components/user-card";
import { fakeGetUser } from "@/tmp/fakeFetch";
import { redirect } from "next/navigation";
import { UserPageProps } from "./page";

const UserLayout = async ({
  children,
  params,
}: UserPageProps & {
  children: React.ReactNode;
}) => {
  const user = await fakeGetUser(params.user);
  if (!user) return redirect("/");

  return (
    <div className="flex self-center space-x-4 p-4 max-w-5xl w-full relative">
      <main className="flex-grow space-y-4">{children}</main>
      <aside className="max-md:hidden w-full self-start max-w-xs sticky top-20">
        <UserCard user={user} />
      </aside>
    </div>
  );
};

export default UserLayout;
