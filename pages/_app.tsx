import FontFaceObserver from "fontfaceobserver";
import React, { useEffect, useState } from "react";
import "react-image-crop/lib/ReactCrop.scss";
import { Provider } from "react-redux";
import { ScreenLoader } from "../components/Common/ScreenLoader";
import { store } from "../redux/store";
import "../style/fonts.scss";
import "../style/global.scss";
import "../style/nord.scss";
import "../style/preload.scss";

const App = ({ Component, pageProps }) => {
  const [fontsLoaded, setFontsLoaded] = useState(0);
  const fonts = [
    new FontFaceObserver("NotoSansJP-Regular"),
    new FontFaceObserver("NotoSansJP-Light"),
    new FontFaceObserver("NotoSansJP-Medium"),
    new FontFaceObserver("NotoSansJP-Bold"),
    new FontFaceObserver("NotoSansJP-Black"),
  ];

  useEffect(() => {
    preloadFonts();
    document.body.className = "";
  }, []);

  const preloadFonts = () => {
    fonts.forEach((font) => {
      font.load().then(function () {
        setFontsLoaded((current) => current + 1);
      });
    });
    setTimeout(() => {
      setFontsLoaded(fonts.length);
    }, 500);
  };

  return (
    <Provider store={store}>
      {fontsLoaded >= fonts.length ? (
        <Component {...pageProps} />
      ) : (
        <ScreenLoader />
      )}
    </Provider>
  );
};

export default App;
