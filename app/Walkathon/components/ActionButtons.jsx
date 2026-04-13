"use client";
import React from "react";
import { motion } from "framer-motion";

/**
 * Action Buttons Component - iOS Native Style
 * Animated buttons with haptic-style feedback
 */
export const ActionButtons = ({
    isJoined = false,
    hasAvailableRewards = false,
    availableRewards = [],
    onJoin,
    onClaimAll,
    isJoining = false,
    isClaiming = false,
    nextMilestone = null,
    totalSteps = 0,
}) => {
    // Debug logging helper
    const logAction = (label, data) => {
        console.log(`[🔘 ACTION] ${label}`, data);
    };

    const getButtonText = () => {
        if (!isJoined) {
            return "Join Now";
        }
        if (hasAvailableRewards && availableRewards.length > 0) {
            const totalXP = availableRewards.reduce(
                (sum, reward) => sum + (reward.xpReward || 0),
                0
            );
            return `Claim +${totalXP} XP`;
        }
        if (nextMilestone) {
            const stepsNeeded = nextMilestone.stepMilestone - totalSteps;
            return `${stepsNeeded.toLocaleString()} steps to goal`;
        }
        return "Keep Walking!";
    };

    const handleClick = () => {
        if (!isJoined) {
            logAction("Join Button Clicked", { timestamp: new Date().toISOString() });
            onJoin?.();
        } else if (hasAvailableRewards && availableRewards.length > 0) {
            logAction("Claim All Button Clicked", {
                availableRewardsCount: availableRewards.length,
                totalXP: availableRewards.reduce((sum, r) => sum + (r.xpReward || 0), 0),
                timestamp: new Date().toISOString()
            });
            onClaimAll?.();
        }
    };

    const isButtonActive = !isJoined || (hasAvailableRewards && availableRewards.length > 0);
    const hasRewards = hasAvailableRewards && availableRewards.length > 0;
    const totalXP = availableRewards.reduce((sum, reward) => sum + (reward.xpReward || 0), 0);

    return (
        <div className="w-full px-4 space-y-3">
            {/* Main Action Button - iOS Style */}
            <motion.button
                whileHover={isButtonActive ? { scale: 1.02, y: -2 } : {}}
                whileTap={isButtonActive ? { scale: 0.96 } : {}}
                onClick={handleClick}
                disabled={!isButtonActive || isJoining || isClaiming}
                className={`
                    relative w-full py-4 rounded-2xl font-bold text-lg overflow-hidden
                    transition-all duration-300
                    ${isButtonActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/25 active:shadow-orange-500/10"
                        : "bg-white/5 text-gray-500 cursor-not-allowed"
                    }
                    ${isJoining || isClaiming ? "opacity-70" : ""}
                `}
            >
                {/* Shine Effect for Active Button */}
                {isButtonActive && !isJoining && !isClaiming && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                        style={{ width: "50%", height: "100%" }}
                    />
                )}

                {isJoining ? (
                    <span className="flex items-center justify-center gap-3">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span className="text-white/90">Joining...</span>
                    </span>
                ) : isClaiming ? (
                    <span className="flex items-center justify-center gap-3">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span className="text-white/90">Claiming...</span>
                    </span>
                ) : (
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {hasRewards && <span className="text-xl">🎁</span>}
                        {getButtonText()}
                    </span>
                )}
            </motion.button>

            {/* Progress Info Card - iOS Style */}
            {isJoined && nextMilestone && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                <span className="text-orange-400 text-sm">🎯</span>
                            </div>
                            <span className="text-gray-400 text-sm">Next Goal</span>
                        </div>
                        <span className="text-white font-semibold">
                            {(nextMilestone.stepMilestone || 0).toLocaleString()} steps
                        </span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Reward</span>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-semibold">
                                +{(nextMilestone.xpReward || 0)} XP
                            </span>
                            {nextMilestone.coinReward > 0 && (
                                <span className="px-2 py-1 bg-yellow-900/30 text-yellow-600 rounded-lg text-sm font-semibold">
                                    +{nextMilestone.coinReward} 💰
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{totalSteps.toLocaleString()} steps</span>
                            <span>{(nextMilestone.stepMilestone || 0).toLocaleString()} steps</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ 
                                    width: `${Math.min((totalSteps / (nextMilestone.stepMilestone || 1)) * 100, 100)}%` 
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Auto-Sync Indicator */}
            {isJoined && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-2 py-2"
                >
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-green-500"
                    />
                    <span className="text-gray-500 text-xs">Auto-syncing with Apple Health</span>
                </motion.div>
            )}
        </div>
    );
};
