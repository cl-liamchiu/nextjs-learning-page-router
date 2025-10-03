import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { PostProvider } from "@/lib/homework/3/context/post-provider";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHomework3Route = router.pathname.startsWith("/homework/3");

  const content = <Component {...pageProps} />;

  if (isHomework3Route) {
    return <PostProvider>{content}</PostProvider>;
  }

  return content;
}
