import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedMetricCardProps {
  title: string;
  value: string | number;
  detail: string;
  accent: string;
  icon: React.ReactNode;
}

const AnimatedMetricCard: React.FC<AnimatedMetricCardProps> = ({ title, value, detail, accent, icon }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{detail}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-cyan-200">{icon}</div>
      </div>
    </motion.div>
  );
};

export default AnimatedMetricCard;
