"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { REVENUE_TREND, SPEND_BY_CLIENT, UTILISATION } from "@/lib/admin-data";
import styles from "./charts.module.css";

const AXIS = { stroke: "hsl(var(--muted-foreground))", fontSize: 12 };
const lakhs = (v: number) => `₹${(v / 100000).toFixed(1)}L`;

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300} className={styles.revenueChart}>
      <AreaChart data={REVENUE_TREND} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
        <defs>
          <linearGradient id="rev1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8BB72C" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#8BB72C" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis tickFormatter={lakhs} tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} formatter={(v: number) => lakhs(v)} />
        <Legend iconType="circle" />
        <Area type="monotone" name="Retainers" dataKey="retainer" stackId="1" stroke="#8BB72C" strokeWidth={2} fill="url(#rev1)" />
        <Area type="monotone" name="Projects" dataKey="projects" stackId="1" stroke="#1F3B56" strokeWidth={2} fill="#1F3B56" fillOpacity={0.28} />
        <Area type="monotone" name="SaaS" dataKey="saas" stackId="1" stroke="#C2C2C2" strokeWidth={2} fill="#C2C2C2" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SpendByClientChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={SPEND_BY_CLIENT} layout="vertical" margin={{ top: 4, right: 16, left: 40, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis type="number" tickFormatter={lakhs} tickLine={false} axisLine={false} {...AXIS} />
        <YAxis type="category" dataKey="client" width={110} tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} cursor={{ fill: "hsl(var(--muted))" }} formatter={(v: number) => [lakhs(v), "Spend"]} />
        <Bar dataKey="spend" fill="#8BB72C" radius={[0, 8, 8, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function UtilisationChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={UTILISATION} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="team" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis unit="%" domain={[0, 100]} tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} cursor={{ fill: "hsl(var(--muted))" }} formatter={(v: number) => [`${v}% booked`, "Capacity"]} />
        <Bar dataKey="booked" fill="#1F3B56" radius={[8, 8, 0, 0]} barSize={38} />
      </BarChart>
    </ResponsiveContainer>
  );
}
