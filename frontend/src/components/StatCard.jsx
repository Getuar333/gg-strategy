import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/30',
    purple: 'from-purple-600/20 to-purple-600/5 border-purple-500/30',
    green: 'from-green-600/20 to-green-600/5 border-green-500/30',
    orange: 'from-orange-600/20 to-orange-600/5 border-orange-500/30'
  };

  const iconColorClasses = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    orange: 'text-orange-400'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-md p-6 rounded-xl transition-all`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`text-4xl ${iconColorClasses[color]} opacity-50`}>
          <Icon />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
