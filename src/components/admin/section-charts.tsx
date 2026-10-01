"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import {
  APPLICATION_TREND, BLOG_TRAFFIC, QR_BY_DEVICE, QR_SCAN_TREND, STORE_SALES_TREND,
} from "@/lib/admin-data";
import styles from "./section-charts.module.css";

const AXIS = { stroke: "hsl(var(--muted-foreground))", fontSize: 12 };
const rupees = (v: number) => `₹${(v / 1000).toFixed(0)}K`;

/** Scans split by code type — shows which product people actually scan. */
export function QrScanChart() {
  return (
    <ResponsiveContainer width="100%" height={300} className={styles.qrScanChart}>
      <AreaChart data={QR_SCAN_TREND} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} />
        <Legend iconType="circle" />
        <Area type="monotone" name="Menu" dataKey="menu" stackId="1" stroke="#8BB72C" fill="#8BB72C" fillOpacity={0.22} strokeWidth={2} />
        <Area type="monotone" name="Profile" dataKey="profile" stackId="1" stroke="#1F3B56" fill="#1F3B56" fillOpacity={0.22} strokeWidth={2} />
        <Area type="monotone" name="Review" dataKey="review" stackId="1" stroke="#6D961F" fill="#6D961F" fillOpacity={0.22} strokeWidth={2} />
        <Area type="monotone" name="Payment" dataKey="payment" stackId="1" stroke="#C2C2C2" fill="#C2C2C2" fillOpacity={0.3} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function QrDeviceChart() {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie data={QR_BY_DEVICE} dataKey="value" nameKey="name" innerRadius={54} outerRadius={88} paddingAngle={3} stroke="none">
          {QR_BY_DEVICE.map((d) => <Cell key={d.name} fill={d.color} />)}
        </Pie>
        <Tooltip wrapperClassName={styles.tooltip} formatter={(v: number, n: string) => [`${v}%`, n]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function StoreSalesChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={STORE_SALES_TREND} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis tickFormatter={rupees} tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} formatter={(v: number) => [rupees(v), "Revenue"]} />
        <Bar dataKey="revenue" fill="#8BB72C" radius={[8, 8, 0, 0]} barSize={34} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BlogTrafficChart() {
  return (
    <ResponsiveContainer width="100%" height={260} className={styles.blogTrafficChart}>
      <LineChart data={BLOG_TRAFFIC} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} />
        <Legend iconType="circle" />
        <Line type="monotone" name="Views" dataKey="views" stroke="#8BB72C" strokeWidth={2.5} dot={{ r: 3 }} />
        <Line type="monotone" name="Read to the end" dataKey="reads" stroke="#1F3B56" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}


/** Applications received against those approved — the gap is the real signal. */
export function ApplicationTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={280} className={styles.applicationTrendChart}>
      <BarChart data={APPLICATION_TREND} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis tickLine={false} axisLine={false} {...AXIS} />
        <Tooltip wrapperClassName={styles.tooltip} />
        <Legend iconType="circle" />
        <Bar dataKey="received" name="Received" fill="#C2C2C2" radius={[6, 6, 0, 0]} barSize={22} />
        <Bar dataKey="approved" name="Approved" fill="#8BB72C" radius={[6, 6, 0, 0]} barSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
