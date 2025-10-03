// pages/api/time.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const now = new Date();
  res.status(200).json({
    datetime: now.toISOString(), // ISO 格式時間
    timestamp: now.getTime(),    // Unix timestamp (毫秒)
    local: now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }) // 台灣時間
  });
}
