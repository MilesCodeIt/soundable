import { Fragment } from "react";
import { DefaultSeo } from "next-seo";

// SEO
import SeoProps from "../next-seo.config";

// Styles
import "styles/globals.css";

// SWR
import { SWRConfig } from "swr";

export default function SoundableApp ({ Component, pageProps }) {

  const fetcher = async (url) => {
    const res = await fetch(url);

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
  
      // Attach extra info to the error object.
      error.body = await res.json();
      error.status = res.status;
      throw error;
    }

    return res.json();
  };

  return (
    <Fragment>
      <DefaultSeo
        {...SeoProps}
      />
      <SWRConfig 
        value={{
          refreshInterval: 5000,
          fetcher
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </Fragment>
  );
}
