"use client";

import { useEffect, useRef, useState } from "react";
import useCenterZoomCanvas from "@/lib/homework/5/use-center-zoom-canvas";
import styles from "./image-zoom-demo.module.scss";

const getCanvasSize = () => {
  if (typeof window !== "undefined") {
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    return isMobile ? 300 : 500;
  }
  return 500;
};

const ImageZoomDemo = () => {
  const [filename, setFilename] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const [canvasSize, setCanvasSize] = useState(500);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCanvasSize(getCanvasSize());
  }, []);

  const {
    handleFile,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    reset,
  } = useCenterZoomCanvas(canvasRef, canvasSize, canvasSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      handleWheel(event);
    };
    canvas.addEventListener("wheel", wheelHandler, { passive: false });
    return () => canvas.removeEventListener("wheel", wheelHandler);
  }, [handleWheel]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Image Zoom Demo</h2>
      <div className={styles.fileControls}>
        <label htmlFor="file-input" className={styles.fileLabel}>
          選擇檔案
        </label>
        <input
          key={fileKey}
          type="file"
          accept="image/*"
          onChange={(event) => {
            handleFile(event);
            setFileKey((key) => key + 1);
            setFilename(event.target.files?.[0]?.name || "");
          }}
          id="file-input"
          className={styles.fileInput}
        />
        <span className={styles.fileName}>{filename || "未選擇任何檔案"}</span>
      </div>
      <div className={styles.hint}>
        Use mouse wheel to zoom (cursor-centered), drag to pan
      </div>
      <div className={styles.canvasWrapper}>
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className={styles.canvas}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        />
      </div>
      <div className={styles.actions}>
        <button onClick={reset} className={styles.resetButton}>
          Reset View
        </button>
      </div>
    </div>
  );
};

export default ImageZoomDemo;
