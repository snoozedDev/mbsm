import { UserFilesPage } from "./pages/user-files-page";
import UserSettingsPage from "./pages/user-settings-page";
import { UserAccountsPage } from "./user-accounts";
import { UserSecurityPage } from "./user-passkeys";

export const settingsPageMap = {
  user: <UserSettingsPage />,
  accounts: <UserAccountsPage />,
  security: <UserSecurityPage />,
  files: <UserFilesPage />,
} as const;
