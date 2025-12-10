
'use client';

import { AITutor } from '@/components/dashboard/ai-tutor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Atom, Bot, BrainCircuit, Code, FlaskConical, Gamepad2, Sigma } from 'lucide-react';
import Link from 'next/link';

export default function ClubsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Atom />
                        Clubs & Activities
                    </CardTitle>
                    <CardDescription>
                        Explore, learn, and collaborate in our various school clubs.
                    </CardDescription>
                </CardHeader>
            </Card>

             <Tabs defaultValue="tutor" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="tutor" className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        AI Tutor
                    </TabsTrigger>
                     <TabsTrigger value="math">
                        <Link href="/dashboard/maths-club-v2" className="flex items-center gap-2">
                            <Sigma className="h-4 w-4" /> Math Club
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="science">
                        <Link href="/dashboard/science-club-v2" className="flex items-center gap-2">
                            <FlaskConical className="h-4 w-4" /> Science Club
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="coding">
                        <Link href="/dashboard/coding-club" className="flex items-center gap-2">
                            <Code className="h-4 w-4" /> Coding Club
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="think-tank">
                        <Link href="/dashboard/think-tank" className="flex items-center gap-2">
                            <BrainCircuit className="h-4 w-4" /> Think Tank
                        </Link>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tutor" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Chat takes up 2 columns */}
                        <div className="lg:col-span-2">
                            <AITutor />
                        </div>

                        {/* Sidebar with Tips */}
                        <div className="space-y-4">
                            <Card className="bg-primary/10 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-primary text-lg">How to use</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-primary/90 space-y-2">
                                    <p>🔹 Ask for help with <strong>Homework</strong>.</p>
                                    <p>🔹 Request a <strong>Quiz</strong> on a specific topic.</p>
                                    <p>🔹 Ask for a <strong>Study Schedule</strong>.</p>
                                    <p>🔹 Ask to <strong>Summarize</strong> a complex topic.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
                {/* Other tab contents would go here if we were consolidating all clubs */}
            </Tabs>
        </div>
    );
}
