"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { CHANNEL_SPLIT, FUNNEL, LEADS_TREND, SCAN_TREND } from "@/lib/dashboard-data";
import styles from "./charts.module.css";

const AXIS = { stroke: "hsl(var(--muted-foreground))", fontSize: 12 };

export function LeadsTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={LEADS_TREND} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8BB72C" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#8BB72C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} cursor={{ stroke: "hsl(var(--border))" }} />
        <Area type="monotone" dataKey="leads" stroke="#8BB72C" strokeWidth={2.5} fill="url(#leadFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CplChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={LEADS_TREND} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} formatter={(v: number) => [`₹${v}`, "Cost per lead"]} />
        <Line type="monotone" dataKey="cpl" stroke="#1F3B56" strokeWidth={2.5} dot={{ r: 3, fill: "#1F3B56" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ChannelSplitChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={CHANNEL_SPLIT} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3} stroke="none">
          {CHANNEL_SPLIT.map((c) => (
            <Cell key={c.name} fill={c.color} />
          ))}
        </Pie>
        <Tooltip wrapperClassName={styles.tooltip} formatter={(v: number, n: string) => [`${v} leads`, n]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function FunnelChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={FUNNEL} layout="vertical" margin={{ top: 4, right: 16, left: 24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis type="category" dataKey="stage" tickLine={false} axisLine={false} width={80} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} cursor={{ fill: "hsl(var(--muted))" }} />
        <Bar dataKey="count" fill="#8BB72C" radius={[0, 8, 8, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ScanTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={SCAN_TREND} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} cursor={{ fill: "hsl(var(--muted))" }} />
        <Bar dataKey="scans" fill="#1F3B56" radius={[8, 8, 0, 0]} barSize={34} />
      </BarChart>
    </ResponsiveContainer>
  );
}
