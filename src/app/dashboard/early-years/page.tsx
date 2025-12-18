
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Play, Volume2, Star, Rabbit, Rocket, Wand2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory } from '@/ai/flows/junior-actions';

// --- VISUAL MATH GAME COMPONENT ---
function MathPlayground() {
  const [question, setQuestion] = useState({ a: 2, b: 3, icon: '🍎' });
  const [feedback, setFeedback] = useState("");

  const generateQuestion = () => {
    const icons = ['🍎', '🍌', '🐶', '🐱', '⭐', '🚗'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    setQuestion({ a: num1, b: num2, icon: randomIcon });
    setFeedback("");
  };

  const checkAnswer = (ans: number) => {
    if (ans === question.a + question.b) {
      setFeedback("CORRECT! 🎉");
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      // Speak "Correct!"
      const utterance = new SpeechSynthesisUtterance("Great Job!");
      window.speechSynthesis.speak(utterance);
      setTimeout(generateQuestion, 2000);
    } else {
      setFeedback("Try Again! 🤔");
      const utterance = new SpeechSynthesisUtterance("Try again.");
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate options (one correct, two random)
  const correctAnswer = question.a + question.b;
  const options = [correctAnswer, correctAnswer + 1, Math.max(1, correctAnswer - 2)].sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in">
      <div className="text-4xl font-bold text-orange-600 mb-4 font-comic">Number Zoo</div>
      
      <div className="flex items-center gap-4 text-5xl">
        <div className="flex gap-1">{Array(question.a).fill(question.icon).map((i,x) => <span key={x}>{i}</span>)}</div>
        <div className="text-slate-400">+</div>
        <div className="flex gap-1">{Array(question.b).fill(question.icon).map((i,x) => <span key={`b${x}`}>{i}</span>)}</div>
      </div>

      <div className="text-2xl font-bold text-slate-600">How many?</div>

      <div className="flex gap-4">
        {options.map((opt, i) => (
          <button 
            key={i}
            onClick={() => checkAnswer(opt)}
            className="w-20 h-20 bg-yellow-400 hover:bg-yellow-300 text-white text-4xl font-bold rounded-full shadow-lg transform hover:scale-110 transition-all border-b-4 border-yellow-600"
          >
            {opt}
          </button>
        ))}
      </div>
      
      <div className="h-8 text-2xl font-bold text-green-600">{feedback}</div>
    </div>
  );
}

// --- STORY SPARK COMPONENT ---
function StorySpark() {
  const [topic, setTopic] = useState('');
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setStory(null);
    setShowAnswer(false);
    
    const result = await generateJuniorStory(topic);
    if (result.success) {
      setStory(result.data);
      // Auto-read title
      setTimeout(() => speak(result.data.title), 500);
    }
    setLoading(false);
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-purple-600">Story Spark ✨</h2>
        <p className="text-slate-500">Tell me a story about...</p>
      </div>

      <div className="flex gap-2">
        <Input 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="e.g. A flying cat" 
          className="text-lg h-12 border-2 border-purple-200"
        />
        <Button onClick={handleGenerate} disabled={loading} className="h-12 bg-purple-600 hover:bg-purple-500 text-lg">
          {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
        </Button>
      </div>

      {/* Quick Picks */}
      <div className="flex gap-2 justify-center">
        {['🦕 Dinosaurs', '🚀 Space', '🦄 Unicorns', '🤖 Robots'].map(t => (
            <button key={t} onClick={() => setTopic(t)} className="px-3 py-1 bg-slate-100 rounded-full text-sm hover:bg-purple-100 transition-colors">
                {t}
            </button>
        ))}
      </div>

      {story && (
        <Card className="border-4 border-purple-300 bg-purple-50 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-purple-900">{story.title}</h3>
                <Button size="icon" variant="ghost" onClick={() => speak(story.content)} className="rounded-full bg-white shadow-sm text-purple-600">
                    <Volume2 />
                </Button>
            </div>
            
            <div className="text-lg leading-relaxed font-medium text-slate-700 bg-white p-4 rounded-lg shadow-inner">
                {story.content}
            </div>

            <div className="pt-4 border-t border-purple-200">
                <p className="font-bold text-purple-800 mb-2">👂 Quiz: {story.question}</p>
                {showAnswer ? (
                    <div className="p-2 bg-green-100 text-green-800 rounded text-center font-bold animate-in zoom-in">
                        {story.answer}
                    </div>
                ) : (
                    <Button onClick={() => setShowAnswer(true)} variant="outline" className="w-full border-purple-300 text-purple-700">
                        Show Answer
                    </Button>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
  const [mode, setMode] = useState<'menu' | 'story' | 'math'>('menu');

  return (
    <div className="min-h-[80vh] p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-sm">
            Junior Campus
        </h1>
        {mode !== 'menu' && (
            <Button onClick={() => setMode('menu')} variant="ghost" className="text-lg font-bold text-slate-600 hover:bg-slate-200">
                🏠 Home
            </Button>
        )}
      </div>

      {/* MENU MODE */}
      {mode === 'menu' && (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
            <button 
                onClick={() => setMode('story')}
                className="group relative h-64 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center justify-center text-white overflow-hidden"
            >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <Rabbit className="h-24 w-24 mb-4 drop-shadow-md" />
                <span className="text-3xl font-bold">Story Spark</span>
                <span className="text-purple-100 mt-2">Read & Listen</span>
            </button>

            <button 
                onClick={() => setMode('math')}
                className="group relative h-64 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center justify-center text-white overflow-hidden"
            >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <Star className="h-24 w-24 mb-4 drop-shadow-md" />
                <span className="text-3xl font-bold">Number Zoo</span>
                <span className="text-orange-100 mt-2">Count & Play</span>
            </button>
        </div>
      )}

      {/* GAME MODES */}
      {mode === 'story' && <StorySpark />}
      {mode === 'math' && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border-4 border-orange-200">
              <MathPlayground />
          </div>
      )}

    </div>
  );
}
