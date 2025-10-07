import { useEffect, useState } from "react";

export default function Page() {
  const [timeData, setTimeData] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const time = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
    setTimeData(time);
  }, []);

  return (
    <div>
      <h1>CSR (Client Side Rendering)</h1>
      <ul>
        <li>本頁使用 CSR（Client Side Rendering）技術，時間每秒更新。</li>
        <li>重新整理頁面會立即獲得最新時間。</li>
      </ul>
      <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{timeData}</div>
    </div>
  );
}
