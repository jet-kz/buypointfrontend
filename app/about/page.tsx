"use client";

import React from "react";
import Wrapper from "@/components/Wrapper";
import { motion } from "framer-motion";
import { Shield, Sparkles, Truck, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
            {/* Hero Section */}
            <div className="relative h-[400px] bg-zinc-900 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
                </div>
                <div className="relative z-10 text-center space-y-4 px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl lg:text-7xl font-black text-white tracking-tighter"
                    >
                        Redefining <span className="text-orange-500">Retail.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-lg lg:text-xl max-w-2xl mx-auto font-medium"
                    >
                        Buypoint is more than a marketplace. It's a curated experience designed for the modern collector and everyday shopper alike.
                    </motion.p>
                </div>
            </div>

            <Wrapper>
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Our Story</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                            Founded in 2024, Buypoint emerged from a simple idea: that quality should be accessible without compromise. We spent years building relationships with the best brands and craftsmen to bring you a selection that is both diverse and meticulously vetted.
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                            Today, we serve thousands of customers globally, delivering not just products, but a promise of excellence and reliability in every package.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-[30px] flex flex-col items-center justify-center p-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                                <Shield size={24} />
                            </div>
                            <h3 className="font-bold dark:text-white">Trusted Quality</h3>
                        </div>
                        <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-[30px] flex flex-col items-center justify-center p-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <Truck size={24} />
                            </div>
                            <h3 className="font-bold dark:text-white">Fast Delivery</h3>
                        </div>
                        <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-[30px] flex flex-col items-center justify-center p-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                                <Sparkles size={24} />
                            </div>
                            <h3 className="font-bold dark:text-white">Elite Service</h3>
                        </div>
                        <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-[30px] flex flex-col items-center justify-center p-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                                <Users size={24} />
                            </div>
                            <h3 className="font-bold dark:text-white">2k+ Clients</h3>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}
