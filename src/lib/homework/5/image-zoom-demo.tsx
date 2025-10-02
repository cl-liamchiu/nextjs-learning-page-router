"use client";

import { useEffect, useRef, useState } from "react";
import useCenterZoomCanvas from "@/lib/homework/5/use-center-zoom-canvas";

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
    <div className="max-w-lg mx-auto mt-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Image Zoom Demo</h2>
      <div className="mb-4">
        <label
          htmlFor="file-input"
          className="cursor-pointer px-2 py-1 rounded bg-gray-600 text-gray-100 text-sm mr-0 shadow-sm inline-block mb-4"
        >
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
          className="hidden"
        />
        <span className="text-sm text-white rounded px-2 py-1 min-w-32 text-left inline-block mb-4">
          {filename || "未選擇任何檔案"}
        </span>
      </div>
      <div className="mb-2 text-gray-400">
        Use mouse wheel to zoom (cursor-centered), drag to pan
      </div>
      <div className="inline-block" style={{ overscrollBehavior: "contain" }}>
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="border border-gray-300"
          style={{
            background: "#232323",
            cursor: "grab",
            touchAction: "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        />
      </div>
      <div className="mt-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset View
        </button>
      </div>
    </div>
  );
};

export default ImageZoomDemo;
