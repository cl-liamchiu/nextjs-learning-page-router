"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./canvas-image-editor.module.scss";

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
    <div className={styles.container}>
      <h2 className={styles.title}>Canvas Image Editor</h2>
      <div className={styles.fileRow}>
        <label htmlFor="file-input" className={styles.fileLabel}>
          選擇檔案
        </label>
        <input
          key={fileKey}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="file-input"
          className={styles.fileInput}
        />
        <span className={styles.fileName}>{filename || "未選擇任何檔案"}</span>
      </div>
      <div className={styles.controls}>
        <button
          onClick={handleRotate}
          disabled={!imageLoaded}
          className={`${styles.actionButton} ${styles.rotateButton}`}
        >
          Rotate 90°
        </button>
        <button
          onClick={handleBlur}
          disabled={!imageLoaded}
          className={`${styles.actionButton} ${styles.blurButton}`}
        >
          Blur
        </button>
        <button
          onClick={handleDownload}
          disabled={!imageLoaded}
          className={`${styles.actionButton} ${styles.downloadButton}`}
        >
          Download
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className={styles.canvas}
      />
    </div>
  );
};

export default CanvasImageEditor;
