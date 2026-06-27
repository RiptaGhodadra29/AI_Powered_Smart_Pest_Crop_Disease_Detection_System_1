import { useId } from "react";
import { cn } from "./cn";

/*
  Tiny, dependency-free SVG charts.
  Built for small dashboard widgets — responsive via viewBox, accessible via
  role="img" + <title>, and themed with the brand palette. No chart library.
*/

/* ---------- Area / line trend ---------- */
export const AreaChart = ({
  data = [],
  height = 160,
  className,
  stroke = "#16a34a",
  fill = "#16a34a",
  label = "Trend over time",
}) => {
  const gradId = useId();
  const W = 100;
  const H = 40;
  const pad = 2;

  const values = data.map((d) => d.value);
  const max = Math.max(1, ...values);
  const stepX = data.length > 1 ? (W - pad * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = H - pad - (d.value / max) * (H - pad * 2);
    return [x, y];
  });

  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area =
    points.length > 0
      ? `M ${pad},${H - pad} ` +
        points.map(([x, y]) => `L ${x},${y}`).join(" ") +
        ` L ${pad + (data.length - 1) * stepX},${H - pad} Z`
      : "";

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-neutral-400"
        style={{ height }}
      >
        No data yet
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      style={{ height }}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.28" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={pad}
          x2={W - pad}
          y1={H * g}
          y2={H * g}
          stroke="currentColor"
          strokeWidth="0.15"
          className="text-neutral-200"
        />
      ))}

      <path d={area} fill={`url(#${gradId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

/* ---------- Donut ---------- */
export const Donut = ({ segments = [], size = 132, label = "Breakdown" }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        role="img"
        aria-label={label}
        className="-rotate-90"
      >
        <title>{label}</title>
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-neutral-100"
        />
        {total > 0 &&
          segments.map((s) => {
            const dash = (s.value / total) * circumference;
            const seg = (
              <circle
                key={s.label}
                cx="20"
                cy="20"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth="6"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += dash;
            return seg;
          })}
      </svg>

      <ul className="space-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-neutral-600">{s.label}</span>
            <span className="font-semibold text-neutral-900">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ---------- Horizontal bar list ---------- */
export const BarList = ({ items = [], barColor = "bg-brand-500" }) => {
  const max = Math.max(1, ...items.map((i) => i.value));

  if (items.length === 0) {
    return <p className="text-sm text-neutral-400">No data yet</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-neutral-700">{item.label}</span>
            <span className="shrink-0 font-semibold tabular-nums text-neutral-900">
              {item.value}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className={cn("bar-fill h-full rounded-full", barColor)}
              style={{ "--w": `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
