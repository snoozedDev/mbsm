import { SettingsNavigator } from "@/components/settings-navigator";
import { settingsPageMap } from "@/components/settings-page-map";
import { Separator } from "@/components/ui/separator";
import { typedObjectKeys } from "@/lib/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = { params: { slug: keyof typeof settingsPageMap } };

export const generateMetadata = async ({
  params: { slug },
}: Props): Promise<Metadata> => {
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} • Settings • MBSM`,
  };
};

const SettingsPage = async ({ params: { slug } }: Props) => {
  if (!typedObjectKeys(settingsPageMap).includes(slug)) return redirect("/404");
  return (
    <div className="flex flex-col self-center p-4 max-w-5xl w-full">
      <div className="space-y-0.5">
        <h2 className="text-4xl font-medium tracking-wide mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Manage your user and account settings.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex items-stretch max-md:flex-col my-4 w-full">
        <SettingsNavigator
          values={typedObjectKeys(settingsPageMap)}
          value={slug}
        />
        <main className="flex-grow space-y-4 flex flex-col md:ml-4">
          {settingsPageMap[slug]}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
