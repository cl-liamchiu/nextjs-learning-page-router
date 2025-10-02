"use client";

import HomeworkLayout from "@/components/homework/homework-layout";
import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import CanvasImageEditor from "@/lib/homework/4/canvas-image-editor";
import { HWData } from "@/lib/homework/4/data";

const Homework4Page = () => {
  return (
    <HomeworkLayout>
      <HomeworkContent>
        <HomeworkDescription {...HWData} />
        <CanvasImageEditor />
      </HomeworkContent>
    </HomeworkLayout>
  );
};

export default Homework4Page;
