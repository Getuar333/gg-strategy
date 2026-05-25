import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

export const NotificationItem = ({ notification, onClose, onMarkAsRead }) => {
  const getIcon = () => {
    switch (notification.notification_type) {
      case 'task_reminder':
      case 'meeting_reminder':
        return <FiClock className="w-5 h-5" />;
      case 'task_due':
      case 'meeting_approaching':
        return <FiAlertCircle className="w-5 h-5" />;
      default:
        return <FiCheck className="w-5 h-5" />;
    }
  };

  const getColorClass = () => {
    switch (notification.notification_type) {
      case 'task_reminder':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'meeting_reminder':
        return 'bg-purple-500/10 border-purple-500/30';
      case 'task_due':
        return 'bg-orange-500/10 border-orange-500/30';
      case 'meeting_approaching':
        return 'bg-red-500/10 border-red-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 border rounded-lg backdrop-blur-md ${getColorClass()} flex items-start gap-3`}
    >
      <div className="text-lg mt-1">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{notification.title}</h3>
        <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
      </div>
      <div className="flex gap-2">
        {!notification.is_read && (
          <button
            onClick={onMarkAsRead}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Mark as read"
          >
            <FiCheck className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="Close"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationItem;
