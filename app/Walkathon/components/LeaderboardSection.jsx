"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LeaderboardSection = ({
    leaderboard = [],
    userRank = null,
    totalParticipants = 0,
    showHeader = true,
    weekKey = "",
}) => {
    const displayLeaderboard = [...leaderboard];

    if (
        userRank &&
        userRank.rank > 10 &&
        !displayLeaderboard.find((entry) => entry.userId === userRank.userId)
    ) {
        displayLeaderboard.push(userRank);
    }

    const getRankBadge = (rank) => {
        if (rank === 1) return { bg: "bg-gradient-to-br from-yellow-400 to-amber-500", shadow: "shadow-amber-500/40", text: "text-amber-900" };
        if (rank === 2) return { bg: "bg-gradient-to-br from-gray-300 to-gray-500", shadow: "shadow-gray-400/30", text: "text-gray-800" };
        if (rank === 3) return { bg: "bg-gradient-to-br from-orange-400 to-orange-600", shadow: "shadow-orange-500/30", text: "text-white" };
        return { bg: "bg-white/10", shadow: "", text: "text-gray-400" };
    };

    const Avatar = ({ entry, isCurrentUser }) => {
        const [imgError, setImgError] = useState(false);
        const initials = entry.displayName?.charAt(0)?.toUpperCase() || "?";
        const hasValidImage = entry.avatar && entry.avatar.startsWith('http') && !imgError;

        return (
            <div className={`
                w-12 h-12 rounded-full flex items-center justify-center overflow-hidden
                border-2 shadow-lg
                ${isCurrentUser 
                    ? "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-400" 
                    : "bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500"
                }
            `}>
                {hasValidImage ? (
                    <img
                        src={entry.avatar}
                        alt={entry.displayName}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span className={`font-bold text-lg ${isCurrentUser ? 'text-white' : 'text-gray-200'}`}>
                        {initials}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="w-full px-4 py-4">
            {showHeader && (
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Weekly Rankings</h3>
                            <p className="text-gray-500 text-sm">{totalParticipants} walkers this week</p>
                        </div>
                    </div>
                </div>
            )}

            {displayLeaderboard.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <span className="text-4xl">👟</span>
                    </div>
                    <p className="text-white font-semibold text-lg">No activity yet</p>
                    <p className="text-gray-500 text-sm mt-2">Start walking to join the leaderboard!</p>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {displayLeaderboard.map((entry, index) => {
                            const isCurrentUser = userRank && entry.userId === userRank.userId;
                            const rank = entry.rank || index + 1;
                            const badge = getRankBadge(rank);

                            return (
                                <motion.div
                                    key={entry.userId || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                                    whileHover={{ scale: 1.01 }}
                                    className={`
                                        flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer
                                        shadow-lg transition-all duration-200
                                        ${isCurrentUser 
                                            ? "bg-gradient-to-r from-orange-500/25 to-orange-600/10 border border-orange-500/40 shadow-orange-500/10" 
                                            : "bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-white/5 hover:border-white/10"
                                        }
                                    `}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                                            ${badge.bg} ${badge.text} shadow-lg ${badge.shadow}
                                        `}
                                    >
                                        {rank <= 3 ? (
                                            <span className="text-lg">{rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}</span>
                                        ) : (
                                            rank
                                        )}
                                    </motion.div>

                                    <Avatar entry={entry} isCurrentUser={isCurrentUser} />

                                    <div className="flex-1 min-w-0">
                                        <p className={`font-bold text-base truncate ${isCurrentUser ? "text-orange-400" : "text-white"}`}>
                                            {isCurrentUser ? "You" : entry.displayName || "Anonymous"}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-gray-500 text-sm">👟</span>
                                            <span className="text-gray-400 text-sm font-medium">
                                                {(entry.totalSteps || 0).toLocaleString()} steps
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <motion.span 
                                            whileHover={{ scale: 1.05 }}
                                            className={`
                                                px-3 py-1.5 rounded-xl font-bold text-sm
                                                ${isCurrentUser 
                                                    ? "bg-orange-500 text-white" 
                                                    : "bg-emerald-500/20 text-emerald-400"
                                                }
                                            `}
                                        >
                                            #{rank}
                                        </motion.span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {userRank && userRank.rank > 0 && !displayLeaderboard.find(e => e.userId === userRank.userId) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gradient-to-r from-orange-500/20 to-orange-600/10 rounded-2xl border border-orange-500/30"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <span className="text-white font-bold">#{userRank.rank}</span>
                            </div>
                            <div>
                                <p className="text-white font-bold">Your Position</p>
                                <p className="text-gray-400 text-xs">Keep walking!</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-orange-400 font-black text-xl">#{userRank.rank}</p>
                            <p className="text-gray-500 text-xs">of {totalParticipants}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
