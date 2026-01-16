"use client";

import React from "react";
import Wrapper from "@/components/Wrapper";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-20">
            <Wrapper>
                <div className="pt-20 pb-12 text-center space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter"
                    >
                        Get in <span className="text-orange-600">Touch.</span>
                    </motion.h1>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
                        Have a question or just want to say hi? We'd love to hear from you. Our team typically responds within 24 hours.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <Card className="rounded-[30px] border-none shadow-sm dark:bg-zinc-900">
                            <CardContent className="p-8 flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Email us</p>
                                    <p className="font-bold text-gray-900 dark:text-white">support@buypoint.com</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-[30px] border-none shadow-sm dark:bg-zinc-900">
                            <CardContent className="p-8 flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Call us</p>
                                    <p className="font-bold text-gray-900 dark:text-white">+234 (800) BUY-POINT</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-[30px] border-none shadow-sm dark:bg-zinc-900">
                            <CardContent className="p-8 flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Visit us</p>
                                    <p className="font-bold text-gray-900 dark:text-white">Lagos, Nigeria</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-[40px] border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-zinc-900 overflow-hidden">
                            <CardContent className="p-10 lg:p-16 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 ml-1">Full Name</label>
                                        <Input className="h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 border-none shadow-none focus-visible:ring-2 focus-visible:ring-orange-500/20" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 ml-1">Email Address</label>
                                        <Input className="h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 border-none shadow-none focus-visible:ring-2 focus-visible:ring-orange-500/20" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 ml-1">Your Message</label>
                                    <Textarea className="min-h-[150px] rounded-[30px] bg-gray-50 dark:bg-zinc-800 border-none shadow-none focus-visible:ring-2 focus-visible:ring-orange-500/20 p-6" placeholder="How can we help you today?" />
                                </div>
                                <Button className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center gap-3">
                                    Send Message <Send size={20} />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}
