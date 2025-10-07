import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import HomeworkLayout from "@/components/homework/homework-layout";
import { PostProvider } from "@/lib/homework/3/context/post-provider";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHomework3Route = router.pathname.startsWith("/homework/3");
  const isHomeworkPage = router.pathname.startsWith("/homework");

  const content = <Component {...pageProps} />;

  if (isHomework3Route) {
    return (
      <HomeworkLayout>
        <PostProvider>{content}</PostProvider>
      </HomeworkLayout>
    );
  }

  if (isHomeworkPage) {
    return <HomeworkLayout>{content}</HomeworkLayout>;
  }

  return content;
}
