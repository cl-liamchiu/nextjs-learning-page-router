import Link from "next/link";
import HomeworkLayout from "@/components/homework/homework-layout";
import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import { HWData } from "@/lib/homework/3/data";

const Homework3IndexPage = () => {
  return (
    <HomeworkLayout>
      <HomeworkContent>
        <HomeworkDescription {...HWData} />
        <div className="text-center">
          <Link
            href="/homework/3/post-board"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            Go to Post Board
          </Link>
        </div>
      </HomeworkContent>
    </HomeworkLayout>
  );
};

export default Homework3IndexPage;
