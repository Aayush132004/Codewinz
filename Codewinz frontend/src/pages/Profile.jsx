import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../../utils/axiosClient';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

// Custom Tooltip Component
const CustomTooltip = ({ content, position, visible }) => {
  if (!visible || !content) return null;
  return (
    <div
      className="fixed bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50"
      style={{
        left: position.x + 10,
        top: position.y + 10,
      }}
    >
      {content}
    </div>
  );
};

// Saiyan Rating System
const getSaiyanInfo = (score) => {
  if (score >= 2000) return {
    level: 'Ultra Instinct',
    color: 'from-white via-zinc-300 to-zinc-400',
    bgColor: 'bg-zinc-900/40',
    borderColor: 'border-zinc-400',
    textColor: 'text-zinc-200',
    glowColor: 'shadow-zinc-500/30',
    image: `assets/ultra.webp`, // Ultra Instinct Goku
    aura: 'animate-pulse'
  };
  if (score >= 1500) return {
    level: 'Super Saiyan God',
    color: 'from-zinc-200 via-zinc-400 to-zinc-500',
    bgColor: 'bg-zinc-900/30',
    borderColor: 'border-zinc-500',
    textColor: 'text-zinc-300',
    glowColor: 'shadow-zinc-500/20',
    image: '/assets/SSGOD.jpg', // SSG Goku
    aura: 'animate-bounce'
  };
  if (score >= 1000) return {
    level: 'Super Saiyan 3',
    color: 'from-zinc-300 via-zinc-500 to-zinc-600',
    bgColor: 'bg-zinc-900/20',
    borderColor: 'border-zinc-600',
    textColor: 'text-zinc-400',
    glowColor: 'shadow-zinc-600/20',
    image: '/assets/SS3.jpg', // SS3 Goku
    aura: 'animate-pulse'
  };
  if (score >= 600) return {
    level: 'Super Saiyan 2',
    color: 'from-zinc-400 via-zinc-600 to-zinc-700',
    bgColor: 'bg-zinc-900/20',
    borderColor: 'border-zinc-700',
    textColor: 'text-zinc-400',
    glowColor: 'shadow-zinc-700/20',
    image: '/assets/superSaiyan2.jpg', // SS2 Goku
    aura: ''
  };
  if (score >= 300) return {
    level: 'Super Saiyan',
    color: 'from-zinc-500 via-zinc-700 to-zinc-800',
    bgColor: 'bg-zinc-900/10',
    borderColor: 'border-zinc-800',
    textColor: 'text-zinc-500',
    glowColor: 'shadow-zinc-800/15',
    image: `/assets/superSaiyan.jpg`, // SS1 Goku
    aura: ''
  };
  return {
    level: 'Human',
    color: 'from-zinc-600 via-zinc-800 to-zinc-900',
    bgColor: 'bg-zinc-950/10',
    borderColor: 'border-zinc-900',
    textColor: 'text-zinc-600',
    glowColor: 'shadow-zinc-900/10',
    image: '/assets/baseGoku.webp', // Base Goku
    aura: ''
  };
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for custom heatmap tooltip
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const response = await axiosClient.get("/user/profile");
        const {
          name,
          email,
          profile,
          questionsSolved,
          totalQuestions,
          loginStreak,
          heatmap,
          topics,
          score,
          rating,
          problemSolved
        } = response.data;
        
        // Convert heatmap Map/Object to array format
        const heatmapArray = Object.entries(heatmap || {}).map(([date, count]) => ({
          date,
          count
        }));
        
        // Convert topics Map/Object to array format for the chart
        const topicsArray = Object.entries(topics || {}).map(([name, solved]) => ({
          name,
          solved
        }));

        setUser({ 
          name, 
          email, 
          profile, 
          questionsSolved, 
          totalQuestions,
          loginStreak,
          heatmap: heatmapArray,
          topics: topicsArray,
          score: score || 0,
          rating: rating || 'Human',
          problemSolved: problemSolved || []
        });

      } catch (err) {
        console.error("Error fetching user data:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  // Function to get heatmap color intensity
  const getHeatmapColor = (count) => {
    if (!count || count === 0) return 'bg-gray-800';
    if (count < 3) return 'bg-green-900';
    if (count < 6) return 'bg-green-700';
    if (count < 9) return 'bg-green-500';
    return 'bg-green-400';
  };

  // Prepare data for heatmap grid display
  const prepareHeatmapGrid = () => {
    const weeks = [];
    const today = dayjs();
    const startDate = today.subtract(1, 'year').startOf('week');
    
    // Convert heatmap to object for easy lookup
    const heatmapObj = (user?.heatmap || []).reduce((acc, item) => {
      acc[item.date] = item.count;
      return acc;
    }, {});

    // Create 53 weeks (52 weeks + current week)
    for (let week = 0; week < 53; week++) {
      const weekStart = startDate.add(week, 'week');
      const weekDays = [];
      
      // Create 7 days for each week (Sun-Sat)
      for (let day = 0; day < 7; day++) {
        const currentDate = weekStart.add(day, 'day');
        const dateStr = currentDate.format('YYYY-MM-DD');
        const count = heatmapObj[dateStr] || 0;
        
        weekDays.push({
          date: currentDate,
          count,
          isFuture: currentDate.isAfter(today, 'day'),
        });
      }
      
      weeks.push(weekDays);
    }
    
    return weeks;
  };

  const heatmapWeeks = prepareHeatmapGrid();
  const monthLabels = [];
  let lastMonth = null;

  // Generate month labels for heatmap
  for (let week = 0; week < heatmapWeeks.length; week++) {
    const firstDay = heatmapWeeks[week][0].date;
    const month = firstDay.month();
    
    if (month !== lastMonth && firstDay.weekday() === 0) {
      monthLabels.push({
        weekIndex: week,
        monthName: firstDay.format('MMM'),
      });
      lastMonth = month;
    }
  }

  // Heatmap tooltip event handlers
  const handleMouseEnterHeatmap = (e, count, date, isFuture) => {
    if (isFuture) {
      setTooltipContent('');
      setShowTooltip(false);
      return;
    }
    setTooltipContent(`${count} submissions on ${date.format('MMM D, YYYY')}`);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const handleMouseLeaveHeatmap = () => {
    setShowTooltip(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-zinc-400"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center text-zinc-400 text-lg">
        Failed to load user profile.
      </div>
    );
  }

  const saiyanInfo = getSaiyanInfo(user.score);

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 flex flex-col items-center p-6 sm:p-10 pt-24">
      {/* Profile Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-[#101012] rounded-2xl shadow-2xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-zinc-800"
      >
        {/* Profile Info Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-zinc-700 shadow-xl flex-shrink-0">
            <img 
              src={user.profile || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user?.email || 'user')}`} 
              alt="Profile" 
              className="w-full h-full object-cover" 
              onError={(e) => e.target.src = "https://placehold.co/150x150/2d3748/e2e8f0?text=Profile"}
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-white leading-tight">{user.name}</h1>
            <p className="text-md text-zinc-400 mt-1">{user.email}</p>
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
              <div className="badge badge-lg bg-zinc-800 text-zinc-300 border-zinc-700 shadow-md">
                <span className="font-semibold">{user.questionsSolved}</span> Solved
              </div>
              <div className="badge badge-lg bg-zinc-700 text-white border-zinc-600 shadow-md">
                <span className="font-semibold">{user.loginStreak}</span> Day Streak 🔥
              </div>
            </div>
          </div>
        </div>

        {/* Saiyan Rating Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${saiyanInfo.bgColor} ${saiyanInfo.borderColor} border-2 rounded-2xl p-6 shadow-2xl ${saiyanInfo.glowColor} ${saiyanInfo.aura} min-w-[280px]`}
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
              <img 
                src={getSaiyanInfo(user.score).image||"https://i.pinimg.com/736x/f4/8c/29/f48c29b8a7d3e1f5c6a9b2d7e4f8c1a6.jpg"}
                alt={saiyanInfo.level}
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = "https://placehold.co/80x80/2d3748/e2e8f0?text=🥋"}
              />
            </div>
            <div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${saiyanInfo.color} bg-clip-text text-transparent`}>
                {saiyanInfo.level}
              </h3>
              <p className={`${saiyanInfo.textColor} text-sm font-semibold`}>Contest Rating</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-3xl font-bold ${saiyanInfo.textColor}`}>{user.score}</span>
                <span className="text-yellow-400 text-lg">⚡</span>
              </div>
            </div>
          </div>
          
          {/* Power Level Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className={saiyanInfo.textColor}>Power Level</span>
              <span className={saiyanInfo.textColor}>{user.score}/2000</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${saiyanInfo.color} h-2 rounded-full transition-all duration-1000`}
                style={{ width: `${Math.min(100, (user.score / 2000) * 100)}%` }}
              ></div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 w-full max-w-5xl">
        {/* Questions Solved Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card bg-[#101012] rounded-2xl shadow-xl border border-zinc-800"
        >
          <div className="card-body p-6">
            <h2 className="text-lg font-semibold text-zinc-400 mb-2">Problems Solved</h2>
            <AnimatePresence mode="wait">
              <motion.h1
                key={user.questionsSolved}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-extrabold text-white"
              >
                {user.questionsSolved}
              </motion.h1>
            </AnimatePresence>
            <p className="text-zinc-500 mt-2">Out of {user.totalQuestions} problems</p>
            <div className="w-full bg-zinc-800 rounded-full h-3 mt-4">
              <div
                className="bg-zinc-700 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(user.questionsSolved / user.totalQuestions) * 100 || 0}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Login Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card bg-[#101012] rounded-2xl shadow-xl border border-zinc-800"
        >
          <div className="card-body p-6">
            <h2 className="text-lg font-semibold text-zinc-400 mb-2">Login Streak</h2>
            <motion.h1
              key={user.loginStreak}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="text-5xl font-extrabold text-white"
            >
              {user.loginStreak} <span className="text-2xl">🔥</span>
            </motion.h1>
            <p className="text-zinc-500 mt-2">Days in a row</p>
            <div className="w-full bg-zinc-800 rounded-full h-3 mt-4">
              <div
                className="bg-zinc-700 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (user.loginStreak / 30) * 100)}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Contest Score Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`card rounded-2xl shadow-xl border-2 ${saiyanInfo.borderColor} ${saiyanInfo.bgColor}`}
        >
          <div className="card-body p-6">
            <h2 className={`text-lg font-semibold ${saiyanInfo.textColor} mb-2`}>Contest Score</h2>
            <motion.h1
              key={user.score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className={`text-5xl font-extrabold bg-gradient-to-r ${saiyanInfo.color} bg-clip-text text-transparent`}
            >
              {user.score}
            </motion.h1>
            <p className={`${saiyanInfo.textColor} mt-2`}>{saiyanInfo.level} Level</p>
            <div className="w-full bg-zinc-800 rounded-full h-3 mt-4">
              <div
                className={`bg-gradient-to-r ${saiyanInfo.color} h-3 rounded-full transition-all duration-1000 ${saiyanInfo.aura}`}
                style={{ width: `${Math.min(100, (user.score / 2000) * 100)}%` }}
              ></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Submission Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full max-w-5xl bg-[#101012] rounded-2xl shadow-xl p-6 mt-10 border border-zinc-800"
      >
        <h2 className="text-lg font-bold text-white mb-4 font-bold">Submission Activity (Last 12 Months)</h2>
        <div className="flex items-start gap-1">
          {/* Day labels (vertical) */}
          <div className="flex flex-col gap-1 mt-6">
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
              <div key={i} className="h-4 flex items-center justify-end pr-2">
                <span className="text-xs text-gray-400">{day}</span>
              </div>
            ))}
          </div>
          
          {/* Main heatmap grid */}
          <div className="flex-1 overflow-x-auto custom-scrollbar-horizontal pb-2">
            <div className="flex gap-1">
              {heatmapWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1 relative">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-4 h-4 rounded-sm transition-all duration-200 cursor-pointer hover:scale-110 ${
                        day.isFuture ? 'bg-gray-900' : getHeatmapColor(day.count)
                      }`}
                      onMouseEnter={(e) => handleMouseEnterHeatmap(e, day.count, day.date, day.isFuture)}
                      onMouseLeave={handleMouseLeaveHeatmap}
                    />
                  ))}
                  
                  {/* Month labels */}
                  {monthLabels.some(ml => ml.weekIndex === weekIndex) && (
                    <div className="absolute -top-5 left-0 text-xs text-gray-400 whitespace-nowrap">
                      {monthLabels.find(ml => ml.weekIndex === weekIndex)?.monthName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-400 mt-4">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-sm bg-gray-800"></div>
            <div className="w-4 h-4 rounded-sm bg-green-900"></div>
            <div className="w-4 h-4 rounded-sm bg-green-700"></div>
            <div className="w-4 h-4 rounded-sm bg-green-500"></div>
            <div className="w-4 h-4 rounded-sm bg-green-400"></div>
          </div>
          <span>More</span>
        </div>
      </motion.div>

      {/* Topic-wise Problems Solved Graph */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="w-full max-w-5xl bg-[#101012] rounded-2xl shadow-xl p-6 mt-10 border border-zinc-800"
      >
        <h2 className="text-lg font-bold text-white mb-4">Problems Solved by Topic</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={user.topics}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#222226" />
            <XAxis dataKey="name" stroke="#cbd5e0" tick={{ fill: '#a0aec0', fontSize: 12 }} />
            <YAxis stroke="#cbd5e0" tick={{ fill: '#a0aec0', fontSize: 12 }} />
            <RechartsTooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                backgroundColor: '#101012', 
                border: '1px solid #27272a', 
                borderRadius: '12px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)' 
              }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', color: '#a0aec0' }} />
            <Bar 
              dataKey="solved" 
              fill="url(#colorGradient)" 
              name="Solved Problems" 
              radius={[6, 6, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e4e4e7" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#52525b" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Power Level Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="w-full max-w-5xl bg-[#101012] rounded-2xl shadow-xl p-6 mt-10 border border-zinc-800"
      >
        <h2 className="text-lg font-bold text-white mb-6">Power Level Milestones</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { level: 'Human', score: 0 },
            { level: 'Super Saiyan', score: 300 },
            { level: 'Super Saiyan 2', score: 600 },
            { level: 'Super Saiyan 3', score: 1000 },
            { level: 'Super Saiyan God', score: 1500 },
            { level: 'Ultra Instinct', score: 2000 }
          ].map((milestone, index) => {
            const isAchieved = user.score >= milestone.score;
            const isCurrent = user.score >= milestone.score && 
              (index === 5 || user.score < [0, 300, 600, 1000, 1500, 2000][index + 1]);
            
            return (
              <motion.div
                key={milestone.level}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  isCurrent 
                    ? 'border-zinc-400 bg-zinc-900/60 shadow-lg shadow-white/5' 
                    : isAchieved 
                    ? 'border-zinc-800 bg-zinc-900/20' 
                    : 'border-zinc-900 bg-zinc-950/20'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                )}
                <div className="text-center">
                  <div className={`text-2xl mb-2 ${isAchieved ? 'text-zinc-200' : 'text-gray-600'}`}>
                    {isAchieved ? '🏆' : '🔒'}
                  </div>
                  <h3 className={`text-xs font-bold mb-1 ${isAchieved ? 'text-zinc-200' : 'text-gray-500'}`}>
                    {milestone.level}
                  </h3>
                  <p className={`text-xs ${isAchieved ? 'text-zinc-400' : 'text-gray-600'}`}>
                    {milestone.score} pts
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Next Milestone Progress */}
        <div className="mt-6 p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Next Milestone Progress</h3>
          {(() => {
            const nextMilestone = [300, 600, 1000, 1500, 2000].find(score => user.score < score);
            if (!nextMilestone) {
              return (
                <div className="text-center py-4">
                  <span className="text-2xl">🎉</span>
                  <p className="text-white font-bold mt-2">Ultra Instinct Achieved!</p>
                  <p className="text-gray-400 text-sm">You've reached the highest power level!</p>
                </div>
              );
            }
            
            const progress = ((user.score % nextMilestone) / nextMilestone) * 100;
            const remaining = nextMilestone - user.score;
            
            return (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">{user.score} / {nextMilestone}</span>
                  <span className="text-zinc-400">{remaining} points to go!</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3">
                  <div
                    className="bg-zinc-750 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${(user.score / nextMilestone) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })()}
        </div>
      </motion.div>

      {/* Recent Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="w-full max-w-5xl bg-[#101012] rounded-2xl shadow-xl p-6 mt-10 border border-zinc-800"
      >
        <h2 className="text-lg font-bold text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/80">
            <div className="text-2xl font-bold text-white">{user.problemSolved?.length || 0}</div>
            <div className="text-xs text-zinc-400">Total Submissions</div>
          </div>
          <div className="text-center p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/80">
            <div className="text-2xl font-bold text-white">{user.questionsSolved}</div>
            <div className="text-xs text-zinc-400">Problems Solved</div>
          </div>
          <div className="text-center p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/80">
            <div className="text-2xl font-bold text-white">{user.loginStreak}</div>
            <div className="text-xs text-zinc-400">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/80">
            <div className="text-2xl font-bold text-white">{Math.round((user.questionsSolved / user.totalQuestions) * 100) || 0}%</div>
            <div className="text-xs text-zinc-400">Completion Rate</div>
          </div>
        </div>
      </motion.div>

      {/* Fun Facts Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="w-full max-w-5xl text-center mt-10 mb-10"
      >
        <div className="bg-[#101012] rounded-2xl p-6 border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-4">💡 Did You Know?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-zinc-400">⚡</span>
              <span>Your current power level puts you in the <strong className="text-zinc-200">{saiyanInfo.level}</strong> tier!</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-zinc-400">🎯</span>
              <span>You've solved <strong className="text-zinc-200">{user.questionsSolved}</strong> out of <strong className="text-zinc-400">{user.totalQuestions}</strong> problems!</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-zinc-400">🔥</span>
              <span>Your longest streak is <strong className="text-zinc-200">{user.loginStreak}</strong> days!</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-zinc-400">🏆</span>
              <span>Contest score: <strong className="text-zinc-200">{user.score}</strong> points earned!</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Render the custom tooltip */}
      <CustomTooltip content={tooltipContent} position={tooltipPosition} visible={showTooltip} />
    </div>
  );
};

export default Profile;