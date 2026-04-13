"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { HomeIndicator } from "@/components/HomeIndicator";
import { LeaderboardSection } from "../components/LeaderboardSection";
import { getWalkathonLeaderboard } from "@/lib/api";

export default function LeaderboardPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [totalParticipants, setTotalParticipants] = useState(0);
    const [weekKey, setWeekKey] = useState("");

    useEffect(() => {
        async function loadData() {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await getWalkathonLeaderboard(token);
                if (response.success && response.data) {
                    setLeaderboard(response.data.leaderboard || []);
                    setTotalParticipants(response.data.totalParticipants || 0);
                    setWeekKey(response.data.weekKey || "");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [token]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
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
                <h1 className="font-semibold text-white">Leaderboard</h1>
                <div className="w-10" />
            </div>

            <LeaderboardSection
                leaderboard={leaderboard}
                userRank={userRank}
                totalParticipants={totalParticipants}
                weekKey={weekKey}
                showHeader={true}
            />

            <HomeIndicator activeTab="home" />
        </div>
    );
}
