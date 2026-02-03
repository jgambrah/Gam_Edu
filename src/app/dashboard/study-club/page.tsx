'use client';

import { AITutor } from '@/components/dashboard/ai-tutor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudyClubPage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chat takes up 2 columns */}
                <div className="lg:col-span-2">
                    <AITutor />
                </div>

                {/* Sidebar with Tips */}
                <div className="space-y-4">
                    <Card className="bg-indigo-50 border-indigo-200">
                        <CardHeader>
                            <CardTitle className="text-indigo-700 text-lg">How to use</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-indigo-900 space-y-2">
                            <p>🔹 Ask for help with <strong>Homework</strong>.</p>
                            <p>🔹 Request a <strong>Quiz</strong> on a specific topic.</p>
                            <p>🔹 Ask for a <strong>Study Schedule</strong>.</p>
                            <p>🔹 Ask to <strong>Summarize</strong> a complex topic.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
