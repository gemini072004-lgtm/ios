"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { HomeIndicator } from "@/components/HomeIndicator";
import { RewardTiersSection } from "../components/RewardTiersSection";
import { getWalkathonProgress, claimWalkathonReward } from "@/lib/api";

export default function MilestonesPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(null);
    const [totalSteps, setTotalSteps] = useState(0);
    const [isClaiming, setIsClaiming] = useState(false);

    const loadProgress = useCallback(async () => {
        if (!token) return;
        try {
            const response = await getWalkathonProgress(token);
            if (response.success && response.data) {
                setProgress(response.data.progress);
                setTotalSteps(response.data.progress?.totalSteps || 0);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadProgress();
    }, [loadProgress]);

    const handleClaimReward = useCallback(async (milestone) => {
        if (!token || isClaiming) return;
        try {
            setIsClaiming(true);
            const response = await claimWalkathonReward(milestone, token);
            if (response.success && response.data?.success) {
                await loadProgress();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsClaiming(false);
        }
    }, [token, isClaiming, loadProgress]);

    const milestonesReached = progress?.milestonesReached || [];
    const rewardsClaimed = (progress?.rewardsClaimed || []).map(r => 
        typeof r === 'object' ? r.milestone : r
    );

    const rewardTiers = [
        { stepMilestone: 1000, xpReward: 10, coinReward: 5 },
        { stepMilestone: 2500, xpReward: 25, coinReward: 15 },
        { stepMilestone: 5000, xpReward: 50, coinReward: 30 },
        { stepMilestone: 7500, xpReward: 75, coinReward: 50 },
        { stepMilestone: 10000, xpReward: 100, coinReward: 75 },
        { stepMilestone: 15000, xpReward: 150, coinReward: 100 },
        { stepMilestone: 20000, xpReward: 200, coinReward: 150 }
    ];

    const completedCount = milestonesReached.length;
    const totalCount = rewardTiers.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-black pb-[100px]">
            <div className="flex items-center justify-between px-4 py-4 bg-black/80 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10">
                <button
                    onClick={() => router.push('/Walkathon')}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"/>
                    </svg>
                </button>
                <h1 className="font-semibold text-white">Milestones</h1>
                <div className="w-10" />
            </div>

            <div className="px-4 py-5">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-5 border border-white/10"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white text-3xl font-bold">{totalSteps.toLocaleString()}</p>
                            <p className="text-gray-500 text-sm mt-1">Total Steps</p>
                        </div>
                        <div className="text-right">
                            <p className="text-orange-400 text-2xl font-bold">{completedCount}/{totalCount}</p>
                            <p className="text-gray-500 text-sm">Completed</p>
                        </div>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                        />
                    </div>
                    <p className="text-gray-500 text-xs mt-2 text-right">{Math.round(progressPercent)}% Complete</p>
                </motion.div>
            </div>

            <RewardTiersSection
                rewardTiers={rewardTiers}
                milestonesReached={milestonesReached}
                rewardsClaimed={rewardsClaimed}
                onClaimReward={handleClaimReward}
                isClaiming={isClaiming}
            />

            <HomeIndicator activeTab="home" />
        </div>
    );
}
