"use client";
import { FadeFromBelow } from "@/components/containers/fade-from-below";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserQuery } from "@/queries/authQueries";

const AccountsSettingsPage = () => {
  const { data: user, isLoading } = useUserQuery();

  return (
    <FadeFromBelow>
      {isLoading ? (
        <h1>loading</h1>
      ) : (
        <Card>
          <div className="py-12 px-6 flex flex-col items-center">
            <h3 className="text-xl font-medium tracking-wide">{`You don't have any accounts yet`}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {`You can't post or comment without an account.`}
            </p>
            <Button asChild className="mt-6">
              <a href="/accounts/add">Create Account</a>
            </Button>
          </div>
        </Card>
      )}
    </FadeFromBelow>
  );
};

export default AccountsSettingsPage;
