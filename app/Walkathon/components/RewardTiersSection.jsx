"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const RewardTiersSection = ({
    rewardTiers = [],
    milestonesReached = [],
    rewardsClaimed = [],
    onClaimReward,
    isClaiming = false,
    showHeader = true,
}) => {
    const getStatus = (tier) => {
        const milestoneValue = tier.stepMilestone || tier.milestone || 0;
        const isReached = milestonesReached.includes(milestoneValue);
        const isClaimed = rewardsClaimed.some(claimed => {
            if (typeof claimed === 'number') return claimed === milestoneValue;
            if (typeof claimed === 'object') return claimed.milestone === milestoneValue || claimed === milestoneValue;
            return false;
        });

        if (isClaimed) return "claimed";
        if (isReached) return "available";
        return "locked";
    };

    return (
        <div className="w-full px-4 py-2">
            {showHeader && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-5"
                >
                    <span className="text-2xl">🎯</span>
                    <div>
                        <h3 className="text-white font-semibold">Milestones</h3>
                        <p className="text-gray-500 text-xs">{rewardTiers.length} rewards to unlock</p>
                    </div>
                </motion.div>
            )}

            <div className="space-y-3 pb-4">
                <AnimatePresence mode="sync">
                    {rewardTiers.map((tier, index) => {
                        const status = getStatus(tier);
                        const canClaim = status === "available";
                        const milestoneValue = tier.stepMilestone || tier.milestone || 0;

                        return (
                            <motion.div
                                key={tier.stepMilestone}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-2xl border
                                    transition-all duration-200
                                    ${status === "claimed"
                                        ? "bg-emerald-500/10 border-emerald-500/20"
                                        : status === "available"
                                            ? "bg-gradient-to-r from-orange-500/15 to-orange-600/10 border-orange-500/30 shadow-lg shadow-orange-500/10"
                                            : "bg-white/5 border-white/5"
                                    }
                                `}
                            >
                                <motion.div
                                    whileHover={{ scale: canClaim ? 1.1 : 1 }}
                                    className={`
                                        w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0
                                        ${status === "claimed"
                                            ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20"
                                            : status === "available"
                                                ? "bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20"
                                                : "bg-white/10"
                                        }
                                    `}
                                >
                                    {status === "claimed" ? (
                                        <span className="text-white font-bold">✓</span>
                                    ) : (
                                        <span className={status === "available" ? "" : "opacity-50"}>🚶</span>
                                    )}
                                </motion.div>

                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm truncate ${status === "claimed" ? "text-emerald-400" : status === "available" ? "text-white" : "text-gray-400"}`}>
                                        {milestoneValue.toLocaleString()} Steps
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400 text-xs font-medium">+{tier.coinReward}</span>
                                            <img src="/dollor.png" alt="Coins" className="w-4 h-4" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400 text-xs font-medium">+{tier.xpReward}</span>
                                            <img src="/xp.svg" alt="XP" className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {canClaim && (
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onClaimReward(tier.stepMilestone)}
                                        disabled={isClaiming}
                                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl text-xs shadow-lg shadow-orange-500/30 disabled:opacity-50"
                                    >
                                        {isClaiming ? "..." : "Claim"}
                                    </motion.button>
                                )}

                                {status === "claimed" && (
                                    <span className="px-3 py-1.5 bg-emerald-500/20 rounded-lg">
                                        <span className="text-emerald-400 text-xs font-semibold">✓ Done</span>
                                    </span>
                                )}

                                {status === "locked" && (
                                    <span className="text-gray-600 text-lg">🔒</span>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
