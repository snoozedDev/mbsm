import React, { useEffect } from "react";
import "react-image-crop/lib/ReactCrop.scss";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../style/fonts.scss";
import "../style/global.scss";
import "../style/nord.scss";
import "../style/preload.scss";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.body.className = "";
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
