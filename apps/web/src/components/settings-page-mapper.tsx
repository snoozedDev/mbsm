"use client";

import { AnimatePresence } from "framer-motion";
import { settingsPageMap } from "./settings-page-map";

export const SettingsPageMapper = ({
  slug,
}: {
  slug: keyof typeof settingsPageMap;
}) => {
  return <AnimatePresence>{settingsPageMap[slug]}</AnimatePresence>;
};
