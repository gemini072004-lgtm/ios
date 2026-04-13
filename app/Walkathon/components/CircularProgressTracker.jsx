"use client";
import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";

/**
 * Circular Progress Tracker - iOS Native Style
 * Animated circular progress with step count
 */
export const CircularProgressTracker = ({
    totalSteps = 0,
    currentLevel = 1,
    levelProgress = 0,
    levelMax = 3,
    nextMilestone = null,
    milestones = [],
    rewardsClaimed = [],
    progressPercentage = 0,
}) => {
    const [animatedSteps, setAnimatedSteps] = useState(0);
    
    // Use backend progressPercentage if available, otherwise calculate
    const maxMilestone = milestones.length > 0 
        ? milestones[milestones.length - 1]?.stepMilestone || 10000
        : 10000;
    const progressPercent = progressPercentage > 0 
        ? progressPercentage 
        : Math.min((totalSteps / maxMilestone) * 100, 100);
    
    // Spring animation for steps counter
    const springSteps = useSpring(0, { stiffness: 60, damping: 15 });
    
    useEffect(() => {
        springSteps.set(totalSteps);
        const unsubscribe = springSteps.on("change", (latest) => {
            setAnimatedSteps(Math.round(latest));
        });
        return unsubscribe;
    }, [totalSteps, springSteps]);
    
    // Circle dimensions
    const size = 240;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div className="w-full px-4 py-6">
            {/* Main Progress Circle */}
            <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
                className="relative flex items-center justify-center mx-auto"
                style={{ width: size, height: size }}
            >
                {/* Background Glow Effect */}
                <div 
                    className="absolute inset-0 rounded-full opacity-30 blur-2xl"
                    style={{
                        background: `radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%)`
                    }}
                />
                
                {/* SVG Progress Ring */}
                <svg
                    width={size}
                    height={size}
                    className="absolute transform -rotate-90"
                >
                    {/* Background Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth={strokeWidth}
                    />
                    
                    {/* Animated Progress Arc */}
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: progressOffset }}
                        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                    
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="50%" stopColor="#fb923c" />
                            <stop offset="100%" stopColor="#fdba74" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center Content */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Steps Count */}
                    <motion.div
                        key={animatedSteps}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-6xl font-bold text-white tracking-tight tabular-nums">
                            {animatedSteps.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 mt-1 uppercase tracking-widest font-medium">
                            steps
                        </span>
                    </motion.div>

                    {/* Next Milestone Badge */}
                    <AnimatePresence>
                        {nextMilestone && (
                            <motion.div
                                initial={{ y: 10, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 10, opacity: 0, scale: 0.9 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="mt-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                            >
                                <span className="text-xs text-gray-300">
                                    Next: <span className="text-orange-400 font-semibold">
                                        {(nextMilestone.stepMilestone || 0).toLocaleString()} steps
                                    </span>
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Level Progress */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 mx-4"
            >
                <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">Level {currentLevel}</span>
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                            {levelProgress}/{levelMax} claimed
                        </span>
                    </div>
                </div>
                
                {/* Progress Pills */}
                <div className="flex items-center gap-3">
                    {Array.from({ length: levelMax }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 300 }}
                            className={`h-3 flex-1 rounded-full transition-all duration-500 ${
                                i < levelProgress
                                    ? "bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg shadow-orange-500/30"
                                    : "bg-white/10"
                            }`}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 mx-4 grid grid-cols-2 gap-3"
            >
                {/* Milestones Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <span className="text-orange-400 text-sm">🏆</span>
                        </div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Milestones</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{milestones.length}</div>
                </div>
                
                {/* Claimed Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <span className="text-green-400 text-sm">✓</span>
                        </div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Claimed</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{rewardsClaimed.length}</div>
                </div>
            </motion.div>
        </div>
    );
};
