import { AccountLayoutProvider } from "@/components/account/account-provider";
import { db } from "@mbsm/db-layer";
import { redirect } from "next/navigation";
import { UserPageProps } from "./page";

const AccountLayout = async ({
  children,
  params,
}: UserPageProps & {
  children: React.ReactNode;
}) => {
  const account = await db.query.account.findFirst({
    where: (model, { eq, and, isNull }) =>
      and(eq(model.handle, params.handle), isNull(model.deletedAt)),
    with: { avatar: true },
  });
  if (!account) return redirect("/");

  return (
    <AccountLayoutProvider account={account}>
      <div className="flex self-center space-x-4 p-4 max-w-5xl w-full relative">
        <main className="flex-grow space-y-4">{children}</main>
        <aside className="max-md:hidden w-full self-start max-w-xs sticky top-20">
          {/* <UserCard user={user} /> */}
          <div>{account.handle}</div>
        </aside>
      </div>
    </AccountLayoutProvider>
  );
};

export default AccountLayout;
