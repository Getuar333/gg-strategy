import React from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiEdit2, FiMapPin, FiUsers, FiLink } from 'react-icons/fi';

export const MeetingCard = ({ meeting, onEdit, onDelete }) => {
  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.2)' }}
      className="border-l-4 border-purple-500 bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-4 rounded-lg backdrop-blur-sm cursor-pointer transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1 truncate">{meeting.title}</h3>
          {meeting.description && (
            <p className="text-gray-400 text-sm line-clamp-2">{meeting.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3 flex-wrap text-gray-400 text-sm">
            {meeting.location && (
              <span className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                {meeting.location}
              </span>
            )}
            <span>
              {new Date(meeting.meeting_date).toLocaleDateString()} • {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
            </span>
            {meeting.attendees && (
              <span className="flex items-center gap-1">
                <FiUsers className="w-4 h-4" />
                {meeting.attendees.split(',').length} attendees
              </span>
            )}
            {meeting.meeting_link && (
              <a
                href={meeting.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <FiLink className="w-4 h-4" />
                Join
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-blue-500/20 rounded transition-colors"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4 text-blue-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-500/20 rounded transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MeetingCard;
