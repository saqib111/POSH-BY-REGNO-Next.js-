/** @format */
"use client";

import React from "react";
import {
    Activity,
    ShieldCheck,
    Crown,
    Zap,
    ShoppingBag,
    Palette,
} from "lucide-react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    Cell,
} from "recharts";

import { useDarkMode } from "@/src/hooks/useDarkMode";

const salesData = [
    { name: "Mon", value: 420 },
    { name: "Tue", value: 380 },
    { name: "Wed", value: 520 },
    { name: "Thu", value: 780 },
    { name: "Fri", value: 610 },
    { name: "Sat", value: 950 },
    { name: "Sun", value: 1200 },
];

const materialData = [
    { name: "Nappa Leather", val: 85, color: "#d97706" },
    { name: "Suede Finish", val: 45, color: "#6366f1" },
    { name: "Exotic Skin", val: 30, color: "#f43f5e" },
    { name: "Grain Text", val: 65, color: "#10b981" },
];

function CustomTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: any[];
}) {
    if (active && payload && payload.length) {
        return (
            <div className='rounded-2xl px-4 py-2 bg-white/90 dark:bg-slate-950/90 border border-slate-200/60 dark:border-white/10 shadow-2xl backdrop-blur-xl'>
                <p className='text-[10px] font-black uppercase tracking-[0.22em] text-amber-600'>
                    {payload[0].value} Units
                </p>
            </div>
        );
    }
    return null;
}

function StatCard({
    label,
    value,
    sub,
    color,
    icon,
}: {
    label: string;
    value: string;
    sub: string;
    color: "amber" | "indigo" | "emerald" | "rose";
    icon: React.ReactNode;
}) {
    const theme = {
        amber: {
            iconWrap:
                "text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200/60 dark:border-amber-500/20",
            accentText: "text-amber-600 dark:text-amber-400",
            accentDot: "bg-amber-500",
            ring: "group-hover:ring-2 group-hover:ring-amber-600/15",
        },
        indigo: {
            iconWrap:
                "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200/60 dark:border-indigo-500/20",
            accentText: "text-indigo-600 dark:text-indigo-400",
            accentDot: "bg-indigo-500",
            ring: "group-hover:ring-2 group-hover:ring-indigo-600/15",
        },
        emerald: {
            iconWrap:
                "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/20",
            accentText: "text-emerald-600 dark:text-emerald-400",
            accentDot: "bg-emerald-500",
            ring: "group-hover:ring-2 group-hover:ring-emerald-600/15",
        },
        rose: {
            iconWrap:
                "text-rose-600 bg-rose-50 dark:bg-rose-500/10 border-rose-200/60 dark:border-rose-500/20",
            accentText: "text-rose-600 dark:text-rose-400",
            accentDot: "bg-rose-500",
            ring: "group-hover:ring-2 group-hover:ring-rose-600/15",
        },
    }[color];

    return (
        <div
            className={`
        group relative overflow-hidden
        bg-white dark:bg-[#0B1120]
        p-8 rounded-[2.5rem]
        border border-slate-200/60 dark:border-white/10
        shadow-sm transition-all duration-500
        hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/50
        dark:hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.55)]
        ${theme.ring}
      `}
        >
            <div className='relative flex justify-between items-start mb-6'>
                <div
                    className={`relative p-4 rounded-2xl border group-hover:scale-110 transition-all duration-500 ${theme.iconWrap}`}
                >
                    {icon}
                    <div className='absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white dark:bg-[#0B1120] flex items-center justify-center'>
                        <div
                            className={`h-2.5 w-2.5 rounded-full ${theme.accentDot} animate-pulse`}
                        />
                    </div>
                </div>

                <div className='flex flex-col items-end'>
                    <span className='text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]'>
                        {label}
                    </span>
                    <h4 className='text-3xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white'>
                        {value}
                    </h4>
                    <span
                        className={`mt-2 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-white/6 text-[9px] font-black uppercase tracking-[0.22em] ${theme.accentText}`}
                    >
                        live
                    </span>
                </div>
            </div>

            <div className='relative flex items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${theme.accentDot}`}
                    />
                    <p
                        className={`text-[10px] font-black uppercase tracking-[0.22em] ${theme.accentText}`}
                    >
                        {sub}
                    </p>
                </div>
                <div className='text-[10px] font-black uppercase tracking-[0.22em] text-slate-400'>
                    trend
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { darkMode } = useDarkMode();

    return (
        <div className='space-y-12'>
            {/* Header & Identity */}
            <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-6'>
                <div className='space-y-2'>
                    <div className='flex items-center gap-3'>
                        <span className='inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-600/10 border border-amber-600/20'>
                            <Crown size={16} className='text-amber-600' />
                        </span>
                        <span className='text-[10px] font-black uppercase tracking-[0.55em] text-slate-400'>
                            Leather Atelier Core
                        </span>
                    </div>

                    <h1 className='text-5xl lg:text-6xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none'>
                        Maison{" "}
                        <span className='font-thin text-slate-300 dark:text-slate-800 italic underline decoration-amber-600/30'>
                            Analytics
                        </span>
                    </h1>
                </div>

                <div className='hidden lg:block text-right'>
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.22em]'>
                        Global Status
                    </p>
                    <p className='text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white'>
                        Authorized Access
                    </p>
                </div>
            </div>

            {/* 4-Card Luxury Grid */}
            <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
                <StatCard
                    label='Total Boutique Sales'
                    value='$14.2k'
                    sub='+8% Revenue'
                    color='amber'
                    icon={<ShoppingBag size={22} />}
                />
                <StatCard
                    label='Artisan Output'
                    value='184'
                    sub='Leather Units'
                    color='indigo'
                    icon={<Zap size={22} />}
                />
                <StatCard
                    label='Material Grade'
                    value='99.8'
                    sub='Premium Hide'
                    color='emerald'
                    icon={<ShieldCheck size={22} />}
                />
                <StatCard
                    label='Global Demand'
                    value='High'
                    sub='Waitlist Active'
                    color='rose'
                    icon={<Activity size={22} />}
                />
            </section>

            {/* Interactive Chart Section */}
            <section className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
                {/* Sales Velocity */}
                <div
                    className='
            xl:col-span-2
            relative overflow-hidden
            bg-white dark:bg-[#0B1120]
            rounded-[3rem] p-10
            border border-slate-200/60 dark:border-white/10
            shadow-sm
            transition-all duration-500
            hover:-translate-y-1
            hover:shadow-2xl hover:shadow-slate-200/50
            dark:hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.55)]
          '
                >
                    <div className='pointer-events-none absolute -inset-10 opacity-0 hover:opacity-100 transition duration-700'>
                        <div className='absolute -top-10 -right-10 h-60 w-60 rounded-full bg-amber-600/10 blur-3xl' />
                    </div>

                    <div className='relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10'>
                        <div>
                            <h3 className='text-xl font-black uppercase italic tracking-widest text-slate-900 dark:text-white'>
                                Sales Velocity
                            </h3>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-[0.22em] mt-1'>
                                Weekly Boutique Performance
                            </p>
                        </div>

                        <div
                            className='
                w-fit
                px-4 py-2 rounded-full
                bg-slate-50 dark:bg-white/6
                border border-slate-200/60 dark:border-white/10
                text-[10px] font-black uppercase tracking-[0.22em]
                text-slate-600 dark:text-slate-300
              '
                        >
                            7 Day Trend
                        </div>
                    </div>

                    <div className='relative h-72 w-full'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient
                                        id='luxeGold'
                                        x1='0'
                                        y1='0'
                                        x2='0'
                                        y2='1'
                                    >
                                        <stop
                                            offset='5%'
                                            stopColor='#d97706'
                                            stopOpacity={0.22}
                                        />
                                        <stop
                                            offset='95%'
                                            stopColor='#d97706'
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray='0'
                                    vertical={false}
                                    stroke={darkMode ? "#1f2937" : "#e2e8f0"}
                                />

                                <XAxis
                                    dataKey='name'
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 10,
                                        fontWeight: "900",
                                        fill: "#94a3b8",
                                    }}
                                    dy={15}
                                />
                                <YAxis hide domain={["auto", "auto"]} />

                                <Tooltip
                                    cursor={{
                                        stroke: "#d97706",
                                        strokeWidth: 1,
                                    }}
                                    content={<CustomTooltip />}
                                />

                                <Area
                                    type='monotone'
                                    dataKey='value'
                                    stroke='#d97706'
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill='url(#luxeGold)'
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Material Portfolio */}
                <div
                    className='
            relative overflow-hidden
            rounded-[3rem] p-10
            bg-slate-900 text-white
            dark:bg-white dark:text-black
            border border-white/10 dark:border-slate-200/60
            shadow-2xl
            transition-all duration-500
            hover:-translate-y-1
          '
                >
                    <div className='absolute -bottom-14 -right-14 w-56 h-56 bg-amber-500/10 rounded-full blur-[70px]' />
                    <div className='absolute -top-16 -left-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-[70px]' />

                    <div className='relative z-10 flex flex-col h-full'>
                        <div className='mb-8 flex justify-between items-start'>
                            <div>
                                <h3 className='text-xl font-black uppercase tracking-tighter italic leading-tight mb-2'>
                                    Material <br /> Portfolio
                                </h3>
                                <p className='text-[10px] font-bold opacity-70 uppercase tracking-[0.22em]'>
                                    Skin Composition
                                </p>
                            </div>

                            <div className='h-11 w-11 rounded-2xl flex items-center justify-center bg-white/10 dark:bg-black/4 border border-white/15 dark:border-black/10'>
                                <Palette size={22} className='text-amber-500' />
                            </div>
                        </div>

                        <div className='flex-1 mt-2'>
                            <ResponsiveContainer width='100%' height={180}>
                                <BarChart
                                    data={materialData}
                                    layout='vertical'
                                    margin={{ left: -20 }}
                                >
                                    <XAxis type='number' hide />
                                    <YAxis
                                        dataKey='name'
                                        type='category'
                                        hide
                                    />
                                    <Tooltip
                                        cursor={{ fill: "transparent" }}
                                        content={<CustomTooltip />}
                                    />
                                    <Bar
                                        dataKey='val'
                                        radius={[0, 10, 10, 0]}
                                        barSize={10}
                                    >
                                        {materialData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>

                            <div className='grid grid-cols-1 gap-3 mt-6'>
                                {materialData.map((item) => (
                                    <div
                                        key={item.name}
                                        className='
                      flex items-center justify-between
                      pb-2
                      border-b border-white/10 dark:border-black/10
                    '
                                    >
                                        <div className='flex items-center gap-2'>
                                            <div
                                                className='w-1.5 h-1.5 rounded-full'
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className='text-[10px] font-black uppercase tracking-[0.22em] opacity-75'>
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className='text-[11px] font-black italic opacity-90'>
                                            {item.val}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className='
                mt-8 w-full h-14
                rounded-2xl
                bg-white/10 dark:bg-black/4
                border border-white/20 dark:border-black/10
                text-[10px] font-black uppercase tracking-[0.22em]
                transition-all duration-300
                hover:bg-amber-600 hover:text-white hover:border-amber-600/40
                active:scale-[0.99]
                focus:outline-none focus:ring-2 focus:ring-amber-600/20
              '
                        >
                            Material Audit
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
