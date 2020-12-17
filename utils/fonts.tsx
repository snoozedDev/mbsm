import FontFaceObserver from "fontfaceobserver";
import { useState } from "react";

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  const notoSansJP = new FontFaceObserver("Noto Sans JP");

  notoSansJP.load().then(() => {
    setFontsLoaded(true);
  });
  return [fontsLoaded];
};
