import { CheckCircle2, Clock, TrendingUp, Code, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

function ProblemCard({ problem, solvedProblem }) {
  const navigate = useNavigate();
  const { tags, title, difficulty, _id, description, likes, submissions } = problem;

  // Check if problem is solved
  const isSolved = solvedProblem?.some((sp) => sp._id === _id);

  // Difficulty configurations with enhanced styling
  const difficultyConfig = {
    easy: {
      text: "text-zinc-300",
      bg: "bg-zinc-800/80",
      border: "border-zinc-700/80",
      glow: "shadow-zinc-800/20",
      icon: "⚪"
    },
    medium: {
      text: "text-zinc-400", 
      bg: "bg-zinc-900/80",
      border: "border-zinc-800/80",
      glow: "shadow-zinc-900/10",
      icon: "⚪"
    },
    hard: {
      text: "text-white font-bold",
      bg: "bg-zinc-700/80", 
      border: "border-zinc-600/80",
      glow: "shadow-zinc-700/20",
      icon: "⚫"
    }
  };

  const config = difficultyConfig[difficulty] || difficultyConfig.medium;

  // Handle tag display - show first few tags if multiple
  const displayTags = Array.isArray(tags) ? tags.slice(0, 3) : [tags];
  const hasMoreTags = Array.isArray(tags) && tags.length > 3;

  // Dynamic time estimates based on difficulty
  const getTimeEstimate = (difficulty) => {
    const timeEstimates = {
      easy: "5-15 min",
      medium: "15-30 min", 
      hard: "30-60 min"
    };
    return timeEstimates[difficulty] || "15-30 min";
  };

  // Get time estimate for current problem
  const timeEstimate = getTimeEstimate(difficulty);

  // Tag colors for different categories
  const getTagColor = (tag) => {
    return "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white";
  };

  return (
    <div 
      onClick={() => navigate(`/problem/${_id}`)}
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-zinc-900/40"
    >
      {/* Main Card Container */}
      <div className={`relative bg-gradient-to-br from-[#0e0e11] to-[#141417] backdrop-blur-sm rounded-2xl border transition-all duration-300 ${
        isSolved 
          ? 'border-zinc-700/60 shadow-lg shadow-black/20' 
          : 'border-zinc-800/80 group-hover:border-zinc-700'
      }`}>
        
        {/* Solved Status Indicator */}
        {isSolved && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle2 size={14} className="text-white" />
          </div>
        )}

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/10 to-zinc-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        <div className="relative p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              {/* Problem Title */}
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold tracking-tight transition-colors duration-200 text-white group-hover:text-zinc-200">
                  {title}
                </h3>
                {isSolved && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded-full border border-zinc-700">
                    <CheckCircle2 size={12} className="text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-300">Solved</span>
                  </div>
                )}
              </div>

              {/* Problem Description Preview */}
              {description && (
                <p className="text-sm text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                </p>
              )}

              {/* Tags Section */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Code size={14} className="text-slate-500" />
                {displayTags.map((tag, index) => (
                  <span
                    key={index}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all duration-200 hover:scale-105 ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
                {hasMoreTags && (
                  <span className="text-xs text-zinc-500 bg-zinc-900/60 px-2 py-1 rounded-full border border-zinc-800">
                    +{Array.isArray(tags) ? tags.length - 3 : 0} more
                  </span>
                )}
              </div>
            </div>

            {/* Right Side - Difficulty Badge */}
            <div className="flex flex-col items-end gap-3 ml-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 group-hover:scale-105 ${config.bg} ${config.border} ${config.text} shadow-lg ${config.glow}`}>
                <span className="text-sm">{config.icon}</span>
                <span className="text-sm font-bold capitalize tracking-wide">
                  {difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
            <div className="flex items-center gap-6 text-xs text-zinc-500">
              {likes !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-zinc-500" />
                  <span>{likes || 0} likes</span>
                </div>
              )}
              {submissions !== undefined && (
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-zinc-600" />
                  <span>{submissions || 0} submissions</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-zinc-500" />
                <span className="font-medium text-zinc-400">
                  {timeEstimate}
                </span>
              </div>
            </div>

            {/* Action Indicator */}
            <div className="flex items-center gap-2 text-zinc-500 group-hover:text-white transition-colors duration-200">
              <span className="text-xs font-medium">Solve Problem</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>

        {/* Progress Bar for Solved Problems */}
        {isSolved && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-600 rounded-b-2xl" />
        )}
      </div>
    </div>
  );
}

export default ProblemCard;