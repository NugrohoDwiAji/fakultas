import "../styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "../components/layouts/MainLayout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentPath = router.pathname;
  const hideLayout = currentPath.startsWith("/admin") || currentPath === "/login";

  return (
    <MainLayout
      hideFooter={hideLayout}
      hideHeader={hideLayout}
      hideContactHeader={hideLayout}
    >
      <Component {...pageProps} />
    </MainLayout>
  );
}
