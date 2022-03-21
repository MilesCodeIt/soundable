import { Fragment } from "react";

// SEO
import { DefaultSeo } from "next-seo";
import SeoProps from "../next-seo.config";

// Styles
import "styles/globals.scss";

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
