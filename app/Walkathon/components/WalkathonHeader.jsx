"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Walkathon Header Component - iOS Native Style
 * Animated header with back button and title
 */
export const WalkathonHeader = ({ title = "Walkathon Challenge" }) => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center justify-between w-full px-4 py-4"
        >
            {/* Back Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 transition-all"
                aria-label="Go back"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white"
                >
                    <path
                        d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
                        fill="currentColor"
                    />
                </svg>
            </motion.button>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                className="font-bold text-white text-lg tracking-tight"
            >
                {title}
            </motion.h1>

            {/* Placeholder for symmetry */}
            <div className="w-10 h-10" />
        </motion.header>
    );
};
