"use client";

import { useEffect, useRef, useState } from "react";

const getCanvasSize = () => {
  if (typeof window !== "undefined") {
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    return isMobile ? 300 : 500;
  }
  return 500;
};

const CanvasImageEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const rotationRef = useRef(0);
  const blurRef = useRef(0);
  const [filename, setFilename] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState(500);

  useEffect(() => {
    setCanvasSize(getCanvasSize());
  }, []);

  const drawImage = (img: HTMLImageElement, rot: number, blurVal: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();
    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.filter = `blur(${blurVal}px)`;

    const scale = Math.min(canvasSize / img.width, canvasSize / img.height, 1);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        imageRef.current = img;
        rotationRef.current = 0;
        blurRef.current = 0;
        drawImage(img, 0, 0);
        setImageLoaded(true);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    setFileKey((k) => k + 1);
    setFilename(file.name);
  };

  const handleRotate = () => {
    if (!imageRef.current) return;
    rotationRef.current = (rotationRef.current + 90) % 360;
    drawImage(imageRef.current, rotationRef.current, blurRef.current);
  };

  const handleBlur = () => {
    if (!imageRef.current) return;
    blurRef.current = Math.min(blurRef.current + 2, 20);
    drawImage(imageRef.current, rotationRef.current, blurRef.current);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    drawImage(imageRef.current, rotationRef.current, blurRef.current);
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-lg mx-auto mt-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Canvas Image Editor</h2>
      <div className="mb-4 flex items-center justify-center">
        <label
          htmlFor="file-input"
          className="cursor-pointer px-2 py-1 rounded bg-gray-600 text-gray-100 text-sm mr-0 shadow-sm inline-block"
        >
          選擇檔案
        </label>
        <input
          key={fileKey}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="file-input"
          className="hidden"
        />
        <span className="text-sm text-white rounded px-2 py-1 min-w-32 text-left inline-block">
          {filename || "未選擇任何檔案"}
        </span>
      </div>
      <div className="mb-4">
        <button
          onClick={handleRotate}
          disabled={!imageLoaded}
          className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Rotate 90°
        </button>
        <button
          onClick={handleBlur}
          disabled={!imageLoaded}
          className="mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Blur
        </button>
        <button
          onClick={handleDownload}
          disabled={!imageLoaded}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Download
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="border border-gray-300"
        style={{ background: "#232323" }}
      />
    </div>
  );
};

export default CanvasImageEditor;
