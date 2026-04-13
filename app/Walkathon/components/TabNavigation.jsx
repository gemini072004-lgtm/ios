"use client";
import React from "react";
import { motion } from "framer-motion";

/**
 * Tab Navigation Component
 * Simple tab switcher using URL hash
 */
export const TabNavigation = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: "milestones", label: "Milestones", icon: "🎯" },
        { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
    ];

    return (
        <div className="w-full px-4 py-3">
            <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/10">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                            activeTab === tab.id
                                ? tab.id === "milestones"
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                                    : "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
