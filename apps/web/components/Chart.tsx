"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  LineSeries,
  UTCTimestamp,
} from "lightweight-charts";

type Trade = {
  price: number;
  qty: number;
};

export default function Chart({ trades }: { trades: Trade[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;

    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: ref.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#000" },
        textColor: "#00ffcc",
      },
      grid: {
        vertLines: { color: "rgba(0,255,255,0.03)" },
        horzLines: { color: "rgba(0,255,255,0.03)" },
      },
      rightPriceScale: {
        borderColor: "rgba(0,255,255,0.2)",
      },
      timeScale: {
        borderColor: "rgba(0,255,255,0.2)",
      },
    });

    // ✅ v5 API (INI KUNCI NYA)
    const series = chart.addSeries(LineSeries, {
      color: "#00ffcc",
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const now = Math.floor(Date.now() / 1000) as UTCTimestamp;

    // ✅ INITIAL DATA (HARUS ADA)
    series.setData([
      { time: (now - 3) as UTCTimestamp, value: 50 },
      { time: (now - 2) as UTCTimestamp, value: 52 },
      { time: (now - 1) as UTCTimestamp, value: 51 },
    ]);

    // ✅ AUTO RESIZE
    const resize = () => {
      if (!ref.current) return;

      chart.applyOptions({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      });
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, []);

  // 🔗 SYNC DENGAN TRADES (REAL FEEL)
  useEffect(() => {
    if (!seriesRef.current || trades.length === 0) return;

    const t = trades[0];

    seriesRef.current.update({
      time: Math.floor(Date.now() / 1000) as UTCTimestamp,
      value: t.price,
    });
  }, [trades]);

  return <div ref={ref} className="w-full h-full" />;
}
