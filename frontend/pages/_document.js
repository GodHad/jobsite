import Document, { Html, Head, Main, NextScript } from 'next/document'
import * as React from "react";
import { ServerStyleSheets } from '@material-ui/core';
import Script from "next/script"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" />
          <link href="/assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
          <link href="/assets/css/style.bundle.css" rel="stylesheet" type="text/css" />
          <link href="/assets/css/global-styles.css" rel="stylesheet" type="text/css" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          />
        </Head>

        <body>
          <Script src="/assets/plugins/global/plugins.bundle.js"></Script>
          <Script src="/assets/js/scripts.bundle.js"></Script>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument


MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () => {
    return originalRenderPage({
      enchanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });
  };
  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};