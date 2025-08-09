import { useEffect, useMemo, useRef, useState } from "react";

export function useTelemetry(maxPoints = 300) {
  const [latest, setLatest] = useState(null);
  const [series, setSeries] = useState([]);
  const wsRef = useRef(null);
  const url = useMemo(
    () => import.meta.env.VITE_WS_URL,
    []
  );

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.log("WS connected:", url);
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        setLatest(data);
        setSeries((prev) => {
          const next = [...prev, data];
          if (next.length > maxPoints) next.shift();
          return next;
        });
      } catch (e) {
        console.warn("Bad message:", e);
      }
    };
    ws.onerror = (e) => console.error("WS error:", e);
    ws.onclose = () => console.log("WS closed");

    return () => ws.close();
  }, [url, maxPoints]);

  return { latest, series };
}
