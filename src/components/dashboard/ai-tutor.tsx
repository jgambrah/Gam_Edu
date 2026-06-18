'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Loader2, Sparkles, Volume2, VolumeX, Mic, MicOff, 
  BookOpen, Brain, GraduationCap, Compass, HelpCircle, FileText, ChevronRight 
} from 'lucide-react';
import { useUser } from '@/firebase';
import { chatWithAiTutor } from '@/ai/flows/ai-tutor-flow';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';

// Types
type MessageRole = 'user' | 'model';
interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
}

interface AITutorProps {
  teachingStyle?: string;
  difficulty?: string;
  subject?: string;
}

export const AITutor: React.FC<AITutorProps> = ({ 
  teachingStyle = 'Socratic (ask helpful guiding questions rather than giving raw answers directly)', 
  difficulty = 'Junior High School', 
  subject = 'General Studies' 
}) => {
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Voice Speech Synthesis (TTS) State
  const [playingId, setPlayingId] = useState<number | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Speech Recognition (STT) State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const loadingPhases = [
    "Consulting space curriculum...",
    "Dr. Gam is gathering context...",
    "Formulating helpful hints...",
    "Synthesizing customized response..."
  ];

  // 1. Initialize Web Speech APIs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';
        rec.onresult = (e: any) => {
          const result = e.results[0][0].transcript;
          setInputText(prev => (prev.trim() + ' ' + result).trim());
          setIsListening(false);
          toast({
            title: "Voice Input Captured",
            description: `"${result}"`
          });
        };
        rec.onerror = () => setIsListening(false);
        rec.onend = () => setIsListening(false);
        recognitionRef.current = rec;
      }
    }
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  // 2. Cycling Loading Messages
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingPhase(prev => (prev + 1) % loadingPhases.length);
      }, 2000);
    } else {
      setLoadingPhase(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // 3. One-time Greeting
  useEffect(() => {
    if (user && !initialized.current) {
      initialized.current = true;
      setMessages([
        {
          role: 'model',
          content: `Hello ${user.displayName?.split(' ')[0] || 'Scholar'}! 👋 I'm Dr. Gam, your personal AI Tutor. I can help you master Math, Science, English, or History. What concept are we exploring today?`,
          timestamp: Date.now()
        }
      ]);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading || !user || !schoolId) {
      if (!schoolId) {
        toast({ variant: "destructive", title: "Error", description: "School context is missing." });
      }
      return;
    }

    // Stop speech synthesis if playing
    if (synthRef.current) {
      synthRef.current.cancel();
      setPlayingId(null);
    }

    setIsLoading(true);

    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };
    
    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);

    try {
      const historyForApi = currentHistory.slice(-10).map(m => ({ 
          role: m.role, 
          content: m.content
      }));

      const lastMessage = historyForApi.pop(); 
      
      const response = await chatWithAiTutor({
        history: historyForApi,
        message: lastMessage?.content || textToSend,
        userId: user.uid,
        schoolId: schoolId,
        teachingStyle: teachingStyle,
        difficulty: difficulty,
        subject: subject,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to retrieve response.");
      }

      const aiMsg: ChatMessage = {
        role: 'model',
        content: response.text,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
      
    } catch (error: any) {
        console.error("Chat error", error);
        toast({
            variant: "destructive",
            title: "Tutor Connection Error",
            description: "Check your internet or credits balance and try again."
        });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    handleSendMessage(text);
  };

  // Toggle Text-to-Speech
  const handleToggleSpeech = (text: string, id: number) => {
    if (!synthRef.current) {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in this browser."
      });
      return;
    }

    if (playingId === id) {
      synthRef.current.cancel();
      setPlayingId(null);
      return;
    }

    synthRef.current.cancel();
    
    // Strip markdown elements before reading
    const utteranceText = text
      .replace(/[\*\#\`\_]/g, '')
      .replace(/SHOW BOARD:\s*\w+/i, '');

    const utterance = new SpeechSynthesisUtterance(utteranceText);
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    
    setPlayingId(id);
    synthRef.current.speak(utterance);
  };

  // Speech to Text (STT) Trigger
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Search Unavailable",
        description: "Your browser doesn't support speech recognition or mic access is blocked."
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Prompt Starter Cards Configuration
  const subjectStarters: Record<string, { topic: string; prompt: string }[]> = {
    'Mathematics': [
      { topic: 'Quadratic Equations', prompt: 'Can you help me understand how to solve quadratic equations?' },
      { topic: 'Pythagorean Theorem', prompt: 'Explain the Pythagorean theorem with a practical example.' },
      { topic: 'Practice Algebra Quiz', prompt: 'Give me a JHS-level algebra practice question.' }
    ],
    'Science & Tech': [
      { topic: 'Photosynthesis', prompt: 'How does photosynthesis turn sunlight into glucose?' },
      { topic: 'Structure of Atoms', prompt: 'Explain the difference between protons, neutrons, and electrons.' },
      { topic: 'Practice Science Quiz', prompt: 'Give me a quick quiz on the states of matter.' }
    ],
    'English & Arts': [
      { topic: 'Metaphors & Similes', prompt: 'Explain the difference between a metaphor and a simile with examples.' },
      { topic: 'Semicolons Usage', prompt: 'How do I use a semicolon correctly in a sentence?' },
      { topic: 'Grammar Quiz', prompt: 'Test my knowledge on active versus passive voice.' }
    ],
    'History & Geo': [
      { topic: 'Continental Drift', prompt: 'Explain the plate tectonics theory simply.' },
      { topic: 'Ancient Kingdoms', prompt: 'Tell me about the ancient West African trading kingdoms.' },
      { topic: 'World War II Summary', prompt: 'Give me a brief timeline of the major events of WWII.' }
    ]
  };

  const currentSubjectGroup = subjectStarters[subject] || [
    { topic: 'Take a Quiz', prompt: `Can you test my knowledge on ${subject} with a practice question?` },
    { topic: 'Explain a Concept', prompt: `Explain the most important concept in ${subject} simply.` },
    { topic: 'Tutor Study Schedule', prompt: `Help me create a study schedule to master ${subject}.` }
  ];

  return (
    <div className="flex flex-col h-[76vh] w-full bg-slate-900 border border-indigo-500/20 rounded-2xl shadow-2xl shadow-indigo-950/20 overflow-hidden relative backdrop-blur-md">
      {/* Immersive Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-4 border-b border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-400/30 shadow-lg shadow-indigo-500/10">
              <Bot className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white tracking-wide flex items-center gap-1.5">
                Dr. Gam AI Tutor
              </h2>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-indigo-500/30 uppercase tracking-wider">
                Active Buddy
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
              <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {difficulty}</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1"><Brain className="w-3.5 h-3.5 text-indigo-400" /> {teachingStyle.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Cost & Spark Status */}
        <div className="flex items-center gap-2 bg-indigo-950/50 px-3 py-1.5 rounded-xl border border-indigo-500/20 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="text-indigo-200 font-semibold">1 Spark / Query</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/40 custom-scrollbar relative">
        
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 relative ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white shadow-indigo-600/15' 
                : 'bg-slate-800 border border-slate-700 text-indigo-400'
            }`}>
              {msg.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
            </div>

            {/* Bubble content */}
            <div className="relative group max-w-[80%]">
              <div className={`p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-lg border relative ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500 rounded-tr-none shadow-indigo-600/10' 
                  : 'bg-slate-900/90 text-slate-200 border-indigo-500/10 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap font-medium">{msg.content}</div>

                {/* Speak button for AI Responses */}
                {msg.role === 'model' && (
                  <button
                    onClick={() => handleToggleSpeech(msg.content, idx)}
                    className={`absolute -bottom-2 -right-2 p-1.5 rounded-full border shadow-md transition-all duration-200 hover:scale-105 ${
                      playingId === idx 
                        ? 'bg-amber-500 text-white border-amber-400 animate-pulse' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-indigo-400 hover:border-indigo-500/30'
                    }`}
                    title={playingId === idx ? "Stop Listening" : "Listen to Explanation"}
                  >
                    {playingId === idx ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
              
              <span className="text-[10px] text-slate-500 block mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Empty State / Concept Portal */}
        {messages.length <= 1 && !isLoading && (
          <div className="pt-4 space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-white font-bold text-lg">Visual Discovery Hub</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                Select a concept or challenge below to kick off your customized tutoring session with Dr. Gam!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentSubjectGroup.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(card.prompt)}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 hover:bg-slate-900 text-left transition-all duration-300 group flex flex-col justify-between h-32 hover:-translate-y-0.5 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-indigo-400 font-bold tracking-wide uppercase">
                      <span>Starter</span>
                      <ChevronRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-slate-200 font-semibold text-xs leading-snug line-clamp-2">
                      {card.topic}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {card.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading / Scanning state */}
        {isLoading && (
          <div className="flex items-start gap-3 relative">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-900/60 border border-indigo-500/15 p-4 rounded-2xl rounded-tl-none max-w-[80%] space-y-2.5 shadow-lg">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wide">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{loadingPhases[loadingPhase]}</span>
              </div>
              <div className="h-1.5 w-40 bg-slate-800 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full animate-progress" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Console Footer */}
      <form 
        onSubmit={handleFormSubmit} 
        className="p-4 bg-slate-950/80 border-t border-indigo-500/20 flex gap-2 items-center"
      >
        {/* Voice Recognition toggle */}
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 shadow-md ${
            isListening
              ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-indigo-400 hover:border-indigo-500/30'
          }`}
          title={isListening ? "Stop Voice Mode" : "Speak to Tutor"}
        >
          {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Dr. Gam to explain, quiz, or guide you..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-sm font-medium transition-all"
        />

        {/* Send Button */}
        <button 
          type="submit" 
          disabled={isLoading || !inputText.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl disabled:opacity-40 transition-all shadow-md shadow-indigo-600/10 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      
      {/* Dynamic Keyframes inject */}
      <style jsx global>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-progress {
          animation: progress 1.5s infinite linear;
        }
        .animate-spin-slow {
          animation: spin 8s infinite linear;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  );
};
