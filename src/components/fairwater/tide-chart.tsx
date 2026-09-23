import { useEffect, useRef, useState } from "react";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { time: string; height: number };

export function TideChart({ samples, now }: { samples: Point[]; now: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const from = now - 2 * 3600000;
  const to = now + 22 * 3600000;
  const data = samples
    .map((s) => ({ t: new Date(s.time).getTime(), height: Number(s.height.toFixed(2)) }))
    .filter((s) => s.t >= from && s.t <= to);
  if (data.length < 2) return null;
  const ticks = [0, 6, 12, 18].map((h) => {
    const d = new Date(now);
    d.setHours(h, 0, 0, 0);
    return d.getTime();
  });

  return (
    <div ref={host} className="h-36 w-full">
      {size.w > 0 && size.h > 0 ? (
      <ResponsiveContainer width={size.w} height={size.h}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="t"
            type="number"
            domain={[from, to]}
            ticks={ticks}
            tickFormatter={(v: number) =>
              new Date(v).toLocaleTimeString([], { hour: "numeric" })
            }
            tick={{ fill: "var(--color-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={["dataMin - 0.4", "dataMax + 0.4"]} />
          <Tooltip
            labelFormatter={(v) =>
              new Date(Number(v)).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
            }
            formatter={(value) => [`${Number(value).toFixed(1)} ft`, "Tide"]}
          />
          <ReferenceLine x={now} stroke="var(--color-accent)" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="height"
            stroke="var(--color-nearshore)"
            fill="var(--color-nearshore)"
            fillOpacity={0.22}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      ) : null}
    </div>
  );
}
