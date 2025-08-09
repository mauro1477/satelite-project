import { useTelemetry } from "./useTelemetry";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Stat({ label, value, unit }) {
  return (
    <div style={{ padding: 12, borderRadius: 12, border: "1px solid #eee", minWidth: 180 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>
        {value ?? "—"}{unit ? ` ${unit}` : ""}
      </div>
    </div>
  );
}

export default function App() {
  const { latest, series } = useTelemetry(300);

  const formatted = series.map((d) => ({
    t: new Date(d.timestamp).toLocaleTimeString(),
    altitude: d.altitude_km,
    velocity: d.velocity_kms,
    temp: d.temperature_c,
    batt: d.battery_voltage
  }));

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <h1>🛰️ Satellite Telemetry</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Stat label="Altitude" value={latest?.altitude_km?.toFixed?.(2)} unit="km" />
        <Stat label="Velocity" value={latest?.velocity_kms?.toFixed?.(3)} unit="km/s" />
        <Stat label="Battery" value={latest?.battery_voltage?.toFixed?.(2)} unit="V" />
        <Stat label="Temperature" value={latest?.temperature_c?.toFixed?.(1)} unit="°C" />
      </div>

      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" minTickGap={24} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="altitude" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" minTickGap={24} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="velocity" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
