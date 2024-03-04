import { useMediaQuery } from "./useMediaQuery";

export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");
