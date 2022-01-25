import { Fragment } from "react";
import { DefaultSeo } from "next-seo";

// SEO
import SeoProps from "../next-seo.config";

// Styles.
import "styles/globals.css";

export default function SoundableApp ({ Component, pageProps }) {
  return (
    <Fragment>
      <DefaultSeo
        {...SeoProps}
      />
      <Component {...pageProps} />
    </Fragment>
  );
}