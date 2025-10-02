"use client";

import { useRef, useState } from "react";
import HomeworkLayout from "@/components/homework/homework-layout";
import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import { HWData } from "@/lib/homework/2/data";

const Homework2Page = () => {
  const [components, setComponents] = useState<number[]>([]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const addComponent = () => {
    const nextNum = components.length > 0 ? Math.max(...components) + 1 : 1;
    setComponents([...components, nextNum]);
  };

  const removeComponent = (index?: number) => {
    if (typeof index === "number") {
      setComponents((prev) => prev.filter((_, i) => i !== index));
    } else {
      setComponents((prev) => prev.slice(0, -1));
    }
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const dragFrom = dragItem.current;
    const dragTo = dragOverItem.current;
    if (dragFrom === null || dragTo === null || dragFrom === dragTo) return;
    const updated = [...components];
    const [removed] = updated.splice(dragFrom, 1);
    updated.splice(dragTo, 0, removed);
    setComponents(updated);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <HomeworkLayout>
      <HomeworkContent>
        <HomeworkDescription {...HWData} />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            className="rounded-lg bg-cyan-400 px-6 py-3 font-bold text-base text-gray-800 shadow-md transition-colors hover:bg-blue-400"
            onClick={addComponent}
          >
            Add Component
          </button>
          <button
            className="rounded-lg bg-red-400 px-6 py-3 font-bold text-base text-white shadow-md transition-colors hover:bg-red-600"
            onClick={() => removeComponent()}
          >
            Remove Component
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {components.map((comp, index) => (
            <div
              key={index}
              className="mx-auto w-full max-w-xs cursor-pointer rounded border border-gray-200 bg-white px-4 py-4 shadow-sm transition-shadow hover:shadow-md"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(event) => event.preventDefault()}
            >
              Component {comp}
              <button
                className="float-right rounded bg-red-400 px-3 py-1 text-sm text-white transition-colors hover:bg-red-600"
                onClick={() => removeComponent(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </HomeworkContent>
    </HomeworkLayout>
  );
};

export default Homework2Page;
