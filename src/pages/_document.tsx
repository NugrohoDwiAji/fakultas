import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <link rel="shortcut icon" href="/img/ubg.png" type="image/x-icon" />
      <title>Pasca Sarjana | Universitas Bumigora</title>
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
