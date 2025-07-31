import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const InterviewSetup = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Chat Interview",
      description: "Text-based interview with AI",
      icon: "💬",
      path: "/chat-interview"
    },
    {
      title: "Video Interview",
      description: "Face-to-face virtual interview",
      icon: "🎥",
      path: "/video-interview"
    },
    {
      title: "Voice Interview",
      description: "Audio-only conversation",
      icon: "🎙️",
      path: "/voice-interview"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col justify-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-16"
      >
        Interview Modes
      </motion.h1>
      
      <motion.div 
        className="max-w-6xl mx-auto flex flex-row justify-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {options.map((option, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover="hover"
            onClick={() => navigate(option.path)}
            className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 cursor-pointer 
                      shadow-lg w-full max-w-xs border border-gray-600 flex flex-col items-center
                      relative overflow-hidden"
          >
            {/* Animated background element */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0"
              whileHover={{ opacity: 0.3 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Icon with animation */}
            <motion.span 
              className="text-6xl mb-6"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {option.icon}
            </motion.span>
            
            <h2 className="text-2xl font-bold mb-3 text-center">{option.title}</h2>
            <p className="text-gray-300 text-center mb-4">{option.description}</p>
            
            {/* Animated button */}
            <motion.div
              className="mt-4 px-6 py-2 bg-blue-600 rounded-full text-sm font-medium"
              whileHover={{ scale: 1.1, backgroundColor: "#3b82f6" }}
              whileTap={{ scale: 0.95 }}
            >
              Select
            </motion.div>
            
            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 border-2 border-blue-500 rounded-2xl pointer-events-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 0.5, 0], scale: [0.9, 1.05, 1.1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default InterviewSetup;