"use client";

import { useRef, useState } from "react";
import HomeworkLayout from "@/components/homework/homework-layout";
import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import { HWData } from "@/lib/homework/2/data";
import styles from "./homework2.module.scss";

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
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonAdd}`}
            onClick={addComponent}
          >
            Add Component
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonRemove}`}
            onClick={() => removeComponent()}
          >
            Remove Component
          </button>
        </div>
        <div className={styles.list}>
          {components.map((comp, index) => (
            <div
              key={index}
              className={styles.componentCard}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(event) => event.preventDefault()}
            >
              <span className={styles.componentLabel}>Component {comp}</span>
              <button
                type="button"
                className={styles.removeButton}
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
