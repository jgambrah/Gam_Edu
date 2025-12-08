'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Clapperboard, Loader2, LogIn, Mic, MicOff, Send, Video, VideoOff, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateLivePollAction, explainConceptAction } from '@/ai/flows/live-classroom';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

type Message = {
    sender: 'user' | 'ai' | 'system' | 'poll';
    name?: string;
    text: string;
    pollData?: any;
};

// --- SUB-COMPONENTS ---

function VideoPlaceholder() {
    return (
        <div className="relative aspect-video w-full bg-slate-900 rounded-lg flex items-center justify-center text-slate-400">
            <Video className="h-16 w-16" />
            <div className="absolute bottom-4 left-4 flex gap-2">
                <Button size="icon" variant="secondary"><Mic className="h-4 w-4"/></Button>
                <Button size="icon" variant="secondary"><Video className="h-4 w-4"/></Button>
            </div>
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">LIVE</span>
        </div>
    );
}

function TeacherTools({ onNewPoll }: { onNewPoll: (pollData: any) => void }) {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGeneratePoll = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        try {
            const result = await generateLivePollAction(topic);
            if (result.success && result.data) {
                toast({ title: "Live Poll Generated!", description: "The poll has been sent to the chat." });
                onNewPoll(result.data);
            } else {
                throw new Error(result.error || "Failed to generate poll.");
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: "AI Error", description: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Wand2/> Teacher Tools</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Live Poll Topic</Label>
                    <Input placeholder="e.g., Photosynthesis" value={topic} onChange={e => setTopic(e.target.value)} />
                </div>
                <Button onClick={handleGeneratePoll} disabled={isLoading || !topic} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Generate Live Poll
                </Button>
            </CardContent>
        </Card>
    );
}

function StudentTools() {
    const [concept, setConcept] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [explanation, setExplanation] = useState<{ definition: string; analogy: string} | null>(null);
    const { toast } = useToast();

     const handleExplain = async () => {
        if (!concept.trim()) return;
        setIsLoading(true);
        setExplanation(null);
        try {
            const result = await explainConceptAction(concept);
            if (result.success && result.data) {
                setExplanation(result.data);
            } else {
                throw new Error(result.error || "Failed to get explanation.");
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: "AI Error", description: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Bot/> Private Tutor</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>Confused about a concept?</Label>
                    <Input placeholder="e.g., Mitochondria" value={concept} onChange={e => setConcept(e.target.value)} />
                </div>
                <Button onClick={handleExplain} disabled={isLoading || !concept} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Explain to Me
                </Button>
                 {explanation && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md space-y-2 animate-in fade-in">
                        <p><strong>Definition:</strong> {explanation.definition}</p>
                        <p><strong>Analogy:</strong> {explanation.analogy}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function PollMessage({ pollData }: { pollData: any }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-bold mb-2">📊 Live Poll: {pollData.question}</h4>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption} disabled={isSubmitted}>
                {pollData.options.map((opt: string, i: number) => (
                    <div key={i} className={cn("flex items-center space-x-2 p-2 rounded-md", isSubmitted && opt === pollData.correctOption && "bg-green-100")}>
                        <RadioGroupItem value={opt} id={`poll-opt-${i}`} />
                        <Label htmlFor={`poll-opt-${i}`} className="font-normal">{opt}</Label>
                    </div>
                ))}
            </RadioGroup>
            <Button onClick={() => setIsSubmitted(true)} disabled={!selectedOption || isSubmitted} size="sm" className="mt-4">
                Submit Vote
            </Button>
        </div>
    );
}

// --- VIEWS (Lobby vs Classroom) ---

function Lobby({ onJoinSession }: { onJoinSession: (code: string) => void }) {
    const { role } = useRole();
    const [sessionCode, setSessionCode] = useState('');

    return (
        <div className="flex items-center justify-center h-[80vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Clapperboard/> Live Classroom</CardTitle>
                    <CardDescription>Join or create a live lecture session.</CardDescription>
                </CardHeader>
                <CardContent>
                    {role === 'Student' ? (
                        <div className="space-y-2">
                            <Label htmlFor="session-code">Enter Session Code</Label>
                            <Input id="session-code" value={sessionCode} onChange={(e) => setSessionCode(e.target.value)} placeholder="e.g., 123456" />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">As a teacher, you can start a new session for your students to join.</p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => onJoinSession(sessionCode || 'teach-123')}>
                        <LogIn className="mr-2 h-4 w-4"/> {role === 'Student' ? 'Join Session' : 'Create New Session'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

function Classroom({ sessionCode, onLeave }: { sessionCode: string; onLeave: () => void }) {
    const { user } = useUser();
    const { role } = useRole();
    const [messages, setMessages] = useState<Message[]>([{ sender: 'system', text: 'Welcome to the classroom!'}]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: 'user', name: user?.displayName || 'Me', text: input }]);
        setInput('');
    };

    const handleNewPoll = (pollData: any) => {
        setMessages([...messages, { sender: 'poll', text: 'New Poll', pollData }]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Live Classroom</h1>
                    <p className="text-muted-foreground">Session Code: <span className="font-mono bg-muted px-2 py-1 rounded">{sessionCode}</span></p>
                </div>
                <Button variant="destructive" onClick={onLeave}>Leave Session</Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <VideoPlaceholder />
                    {role === 'Teacher' && <TeacherTools onNewPoll={handleNewPoll} />}
                    {role === 'Student' && <StudentTools />}
                </div>

                <Card className="flex flex-col max-h-[80vh]">
                    <CardHeader><CardTitle>Class Chat</CardTitle></CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {messages.map((msg, i) => (
                           msg.sender === 'system' ? <p key={i} className="text-xs text-center text-muted-foreground"><em>{msg.text}</em></p> :
                           msg.sender === 'poll' ? <PollMessage key={i} pollData={msg.pollData} /> :
                           <div key={i} className={cn("flex items-start gap-3", msg.sender === 'user' && 'justify-end')}>
                                {msg.sender !== 'user' && <Avatar className="h-8 w-8"><AvatarFallback><Bot/></AvatarFallback></Avatar>}
                                <div className={cn("p-3 rounded-lg max-w-[80%]", msg.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-background")}>
                                    <p className="text-xs font-bold mb-1">{msg.name || "CampusBot"}</p>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                           </div>
                        ))}
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                        <div className="flex w-full gap-2">
                            <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." />
                            <Button onClick={handleSend}><Send className="h-4 w-4"/></Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function LiveClassroomPage() {
    const [sessionCode, setSessionCode] = useState<string | null>(null);

    const handleJoin = (code: string) => {
        setSessionCode(code || 'teach-123'); // Default for demo
    };

    const handleLeave = () => {
        setSessionCode(null);
    };

    return (
        <div>
            {sessionCode ? (
                <Classroom sessionCode={sessionCode} onLeave={handleLeave} />
            ) : (
                <Lobby onJoinSession={handleJoin} />
            )}
        </div>
    );
}
