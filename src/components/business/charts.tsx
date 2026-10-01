"use client";

import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { ACTION_SPLIT, OUTLET_TREND, SCAN_TREND } from "@/lib/business-data";
import styles from "./charts.module.css";

const AXIS = { stroke: "hsl(var(--muted-foreground))", fontSize: 12 };

export function ScanChart() {
  return (
    <ResponsiveContainer width="100%" height={280} className={styles.scanChart}>
      <AreaChart data={SCAN_TREND} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="scanFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8BB72C" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#8BB72C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} />
        <Legend iconType="circle" />
        <Area type="monotone" name="Scans" dataKey="scans" stroke="#8BB72C" strokeWidth={2.5} fill="url(#scanFill)" />
        <Area type="monotone" name="Unique" dataKey="unique" stroke="#1F3B56" strokeWidth={2} fill="#1F3B56" fillOpacity={0.12} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ActionSplitChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={ACTION_SPLIT} dataKey="value" nameKey="name" innerRadius={56} outerRadius={90} paddingAngle={3} stroke="none">
          {ACTION_SPLIT.map((a) => <Cell key={a.name} fill={a.color} />)}
        </Pie>
        <Tooltip wrapperClassName={styles.tooltip} formatter={(v: number, n: string) => [`${v} taps`, n]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function OutletTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300} className={styles.outletChart}>
      <AreaChart data={OUTLET_TREND} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} />
        <Legend iconType="circle" />
        <Area type="monotone" dataKey="Indiranagar" stroke="#8BB72C" strokeWidth={2.5} fill="#8BB72C" fillOpacity={0.14} />
        <Area type="monotone" dataKey="Koramangala" stroke="#1F3B56" strokeWidth={2.5} fill="#1F3B56" fillOpacity={0.14} />
        <Area type="monotone" dataKey="Whitefield" stroke="#6D961F" strokeWidth={2.5} fill="#6D961F" fillOpacity={0.14} />
        <Area type="monotone" dataKey="Mysuru" stroke="#C2C2C2" strokeWidth={2.5} fill="#C2C2C2" fillOpacity={0.14} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
