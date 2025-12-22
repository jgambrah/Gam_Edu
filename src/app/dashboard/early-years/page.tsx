
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { doc, deleteDoc, addDoc, collection, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rocket, Wand2, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, 
  Trophy, CheckCircle2, XCircle, PlusCircle, Microscope, Sigma, Languages, Edit, Check, Paintbrush
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// --- SHARED HELPERS ---
const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.0;
        u.pitch = 1.2;
        u.lang = 'en-US';
        window.speechSynthesis.speak(u);
    } catch (e) {
        console.error("Speech synthesis failed.", e);
    }
};

const playSound = (sound: 'correct' | 'incorrect' | 'pop') => {
    const sounds = {
        correct: '/sounds/correct.mp3',
        incorrect: '/sounds/incorrect.mp3',
        pop: '/sounds/pop.mp3'
    };
    new Audio(sounds[sound]).play().catch(e => console.error("Sound play failed", e));
};


// --- 1. PHONICS FUN ---
function PhonicsFun() {
    const [challenge, setChallenge] = useState({ word: 'Apple', phonetic: 'a-pple', sentence: 'The apple is red.', emoji: '🍎' });
    const [level, setLevel] = useState('easy');

    // MOCK AI Call
    const generateChallenge = (lvl: string) => {
        const data: any = {
            easy: { word: 'Cat', phonetic: 'c-a-t', sentence: 'The cat sat.', emoji: '🐈' },
            medium: { word: 'Elephant', phonetic: 'e-le-phant', sentence: 'An elephant is big.', emoji: '🐘' },
            hard: { word: 'Splash', phonetic: 's-p-l-a-sh', sentence: 'I splash in the water.', emoji: '💦' }
        };
        setChallenge(data[lvl]);
    };

    return (
        <Card className="rounded-[40px] border-4 border-yellow-100 bg-yellow-50/50 shadow-lg">
            <CardHeader className="text-center">
                <div className="text-7xl mx-auto w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-xl mb-4">
                    {challenge.emoji}
                </div>
                <CardTitle className="text-6xl font-black tracking-tighter text-yellow-800">{challenge.word}</CardTitle>
                <CardDescription className="text-2xl font-bold text-yellow-600">{challenge.phonetic}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-8">
                <p className="text-3xl font-medium text-slate-700">"{challenge.sentence}"</p>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => speak(challenge.word)} className="h-20 w-20 rounded-full bg-yellow-500 shadow-md border-2 border-yellow-600">
                        <Volume2 className="h-10 w-10" />
                    </Button>
                    <Button onClick={() => generateChallenge('easy')} className={`h-20 w-20 rounded-full text-lg font-bold ${level === 'easy' ? 'bg-green-500' : 'bg-green-200'}`} >Easy</Button>
                    <Button onClick={() => generateChallenge('medium')} className={`h-20 w-20 rounded-full text-lg font-bold ${level === 'medium' ? 'bg-orange-500' : 'bg-orange-200'}`}>Med</Button>
                    <Button onClick={() => generateChallenge('hard')} className={`h-20 w-20 rounded-full text-lg font-bold ${level === 'hard' ? 'bg-red-500' : 'bg-red-200'}`}>Hard</Button>
                </div>
            </CardContent>
        </Card>
    );
}

// --- 2. MATH PLAYGROUND ---
const generateMathQuestion = (mode: string) => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    switch (mode) {
        case 'add': return { a, b, op: '+', ans: a + b };
        case 'subtract': return { a: Math.max(a,b), b: Math.min(a,b), op: '-', ans: Math.max(a,b) - Math.min(a,b) };
        case 'patterns': 
            const start = Math.floor(Math.random() * 5);
            const step = Math.floor(Math.random() * 3) + 1;
            return { a: [start, start + step, start + step * 2], op: '?', ans: start + step * 3 };
        case 'time':
            const hour = Math.floor(Math.random() * 12) + 1;
            return { a: `${hour}:00`, b: 0, op: '⏰', ans: hour };
        default: return { a, b, op: '+', ans: a + b };
    }
};

function MathPlayground() {
    const [mode, setMode] = useState('add');
    const [question, setQuestion] = useState(generateMathQuestion('add'));
    const [answer, setAnswer] = useState('');
    const { toast } = useToast();

    const checkAnswer = () => {
        if (parseInt(answer) === question.ans) {
            playSound('correct');
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
            setQuestion(generateMathQuestion(mode));
            setAnswer('');
        } else {
            playSound('incorrect');
            toast({ title: "Try Again!", variant: "destructive" });
        }
    };
    
    // Safely get the hour part for rotation
    const hourForRotation = (q_a: any) => {
        if (typeof q_a === 'string' && q_a.includes(':')) {
            return parseInt(q_a.split(':')[0], 10);
        }
        return 12; // Default to 12 if not a time string
    };

    return (
        <Card className="rounded-[40px] border-4 border-blue-100 bg-blue-50/50 shadow-lg text-center p-8 space-y-8">
            <div className="flex gap-2 p-1 bg-white rounded-2xl w-fit mx-auto border border-blue-100">
                <Button variant={mode === 'add' ? 'default' : 'ghost'} onClick={() => { setMode('add'); setQuestion(generateMathQuestion('add')); }}>Addition</Button>
                <Button variant={mode === 'subtract' ? 'default' : 'ghost'} onClick={() => { setMode('subtract'); setQuestion(generateMathQuestion('subtract')); }}>Subtraction</Button>
                <Button variant={mode === 'patterns' ? 'default' : 'ghost'} onClick={() => { setMode('patterns'); setQuestion(generateMathQuestion('patterns')); }}>Patterns</Button>
                <Button variant={mode === 'time' ? 'default' : 'ghost'} onClick={() => { setMode('time'); setQuestion(generateMathQuestion('time')); }}>Time</Button>
            </div>

            <div className="text-8xl font-black text-blue-800 flex items-center justify-center gap-8 h-40">
                {mode === 'patterns' && Array.isArray(question.a) && question.a.map((n, i) => <div key={i}>{n}</div>)}
                {mode === 'patterns' && <span>?</span>}
                
                {mode === 'time' && (
                 <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center mb-6 relative bg-white">
                    <div className="absolute top-2/4 left-2/4 w-1 h-12 bg-slate-800 rounded -translate-x-1/2 -translate-y-full origin-bottom" style={{ transform: `rotate(${hourForRotation(question.a) * 30}deg)` }}></div>
                    <div className="absolute top-2/4 left-2/4 w-1 h-8 bg-slate-800 rounded -translate-x-1/2 -translate-y-full origin-bottom"></div>
                    <div className="absolute top-2">12</div>
                    <div className="absolute bottom-2">6</div>
                    <div className="absolute left-2">9</div>
                    <div className="absolute right-2">3</div>
                </div>
                )}
                
                {(mode === 'add' || mode === 'subtract') && (
                    <>
                        <div>{question.a}</div>
                        <div>{question.op}</div>
                        <div>{question.b}</div>
                        <div>=</div>
                    </>
                )}
            </div>

            <div className="flex justify-center gap-4">
                <Input 
                    type="number" 
                    value={answer} 
                    onChange={e => setAnswer(e.target.value)}
                    className="w-48 h-24 text-6xl font-bold text-center rounded-3xl"
                />
                <Button onClick={checkAnswer} className="h-24 w-24 bg-blue-600 hover:bg-blue-700 rounded-3xl text-4xl shadow-lg">Go</Button>
            </div>
        </Card>
    );
}

// --- 3. STORY TIME ---
function StoryTime() {
    const [story, setStory] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateStory = async (topic: string) => {
        setIsLoading(true);
        setStory(null);
        // MOCK AI call for now
        setTimeout(() => {
            setStory({
                title: `The Lost ${topic}`,
                content: `Once upon a time, a little ${topic} got lost in the big forest. It was scared but brave. Soon, it met a friendly squirrel who showed it the way home. The end.`,
                emojiIcon: '🦖'
            });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <Card className="rounded-[40px] border-4 border-pink-100 bg-pink-50/50 shadow-lg p-8">
            <div className="flex justify-center gap-4 mb-8">
                <Button onClick={() => generateStory('Dinosaur')} className="h-20 w-32 bg-green-200 text-green-800 rounded-2xl flex-col gap-1 text-lg">🦖 Dino</Button>
                <Button onClick={() => generateStory('Astronaut')} className="h-20 w-32 bg-blue-200 text-blue-800 rounded-2xl flex-col gap-1 text-lg">👨‍🚀 Space</Button>
                <Button onClick={() => generateStory('Unicorn')} className="h-20 w-32 bg-purple-200 text-purple-800 rounded-2xl flex-col gap-1 text-lg">🦄 Magic</Button>
            </div>

            {isLoading && <Loader2 className="mx-auto h-12 w-12 animate-spin text-pink-400" />}

            {story && (
                <div className="bg-white p-8 rounded-3xl border-2 border-pink-100 animate-in zoom-in-95 space-y-6">
                    <h3 className="text-4xl font-black text-pink-800 text-center">{story.title}</h3>
                    <p className="text-2xl leading-relaxed text-slate-600">{story.content}</p>
                    <Button onClick={() => speak(story.content)} className="w-full h-16 bg-pink-500 text-xl font-bold rounded-2xl">
                        <Volume2 className="mr-4 h-8 w-8"/> Read To Me
                    </Button>
                </div>
            )}
        </Card>
    );
}

// --- 4. ART STUDIO ---
function ArtStudio() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState('#000000');
    const [brush, setBrush] = useState('🖌️');

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };
    
    const saveMasterpiece = () => {
        const canvas = canvasRef.current;
        if(canvas) {
            const link = document.createElement('a');
            link.download = 'masterpiece.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set initial canvas size
        const parent = canvas.parentElement;
        if(parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }

        ctx.lineCap = 'round';
        ctx.lineWidth = 8;
        ctx.strokeStyle = color;

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const startDrawing = (e: MouseEvent | TouchEvent) => {
            isDrawing = true;
            [lastX, lastY] = getCoords(e);
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing) return;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            [lastX, lastY] = getCoords(e);
            ctx.lineTo(lastX, lastY);
            ctx.stroke();
        };

        const stopDrawing = () => isDrawing = false;
        
        const getCoords = (e: MouseEvent | TouchEvent) => {
            if (e instanceof MouseEvent) return [e.offsetX, e.offsetY];
            if (e.touches && e.touches[0]) {
                const rect = canvas.getBoundingClientRect();
                return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
            }
            return [0,0];
        };

        // Add event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);
        
        // Cleanup
        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            // ... remove all others
        };

    }, [color]);
    
    return (
        <div className="h-[70vh] flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white p-3 rounded-2xl border-2 border-slate-100 shadow-md">
                <div className="flex gap-2">
                    {['#ff0000', '#0000ff', '#008000', '#ffff00', '#000000'].map(c => (
                        <button key={c} onClick={() => setColor(c)} className="h-10 w-10 rounded-full border-2" style={{ backgroundColor: c, borderColor: color === c ? 'black' : 'transparent' }}/>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setBrush('🖌️')}>🖌️</Button>
                    <Button onClick={() => setBrush('🖍️')}>🖍️</Button>
                    <Button onClick={() => setBrush('✏️')}>✏️</Button>
                </div>
                <div>
                    <Button onClick={clearCanvas} variant="secondary">Clear All</Button>
                </div>
            </div>
            <div className="flex-1 bg-white rounded-[32px] border-4 border-slate-200 overflow-hidden relative cursor-crosshair">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            <div className="text-center">
                <Button onClick={saveMasterpiece} className="bg-green-500 hover:bg-green-600 rounded-full h-14 px-8 text-lg font-bold shadow-lg">Save Masterpiece</Button>
                <p className="text-xs text-muted-foreground mt-2">Practice makes perfect!</p>
            </div>
        </div>
    );
}

// --- 6. SCIENCE WORLD (NON-SAAS DYNAMIC & CYCLING) ---
function ScienceWorld({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [activeTab, setActiveTab] = useState<'lab' | 'sorter' | 'experiment' | 'library'>('lab');
    
    // --- 1. DATA FETCHING ---
    const sorterQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'junior_sorter_items'), orderBy('createdAt', 'asc')) : null, 
    [firestore]);
    const { data: dbSorterItems, forceRefetch: refetchSorter } = useCollection<any>(sorterQuery);
    
    const materialsQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'junior_science_materials'), orderBy('createdAt', 'asc')) : null, 
    [firestore]);
    const { data: dbMaterials, forceRefetch: refetchMaterials } = useCollection<any>(materialsQuery);

    const scienceQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_science'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: savedScience, forceRefetch: refetchScience } = useCollection<any>(scienceQuery);
    
    // --- 2. GAME & ADMIN STATES ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newItem, setNewItem] = useState({ name: '', emoji: '', type: 'living' });
    const [editingItem, setEditingItem] = useState<any>(null); // For edit mode
    const [temp, setTemp] = useState(20);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const [showAddMatForm, setShowAddMatForm] = useState(false);
    const [topic, setTopic] = useState(''); 
    const [fact, setFact] = useState<any>(null); 
    const [loading, setLoading] = useState(false);

    // --- 3. NEW MATERIAL FORM STATE ---
    const [newMat, setNewMat] = useState({
        name: '',
        solid: { temp: -10, emoji: '🧊', label: 'Solid', desc: 'Frozen tight!' },
        liquid: { temp: 1, emoji: '💧', label: 'Liquid', desc: 'Flowing around!' },
        gas: { temp: 100, emoji: '💨', label: 'Gas', desc: 'Flying fast!' }
    });

    // --- 4. SORTER LOGIC ---
    const handleNextSorter = () => {
        if (!dbSorterItems || dbSorterItems.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % dbSorterItems.length);
    };

    const handleAnswer = (choice: string) => {
        if (!dbSorterItems) return;
        const currentItem = dbSorterItems[currentIndex];
        if (choice === currentItem.type) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            speak(`Correct! ${currentItem.name} is ${currentItem.type}!`);
            setTimeout(handleNextSorter, 1500);
        } else {
            speak(`Not quite! Try again.`);
            toast({ title: "Try again!", description: `Is it really ${choice}?`, variant: "destructive" });
        }
    };
    
    const handleSaveOrUpdateSorterItem = async () => {
        if (!firestore) return;

        const itemToSave = editingItem || newItem;
        if (!itemToSave.name || !itemToSave.emoji) return;

        try {
            if (editingItem) {
                // Update existing
                const itemDoc = doc(firestore, 'junior_sorter_items', editingItem.id);
                await updateDoc(itemDoc, { 
                    name: editingItem.name, 
                    emoji: editingItem.emoji, 
                    type: editingItem.type 
                });
                toast({ title: "Item Updated!" });
            } else {
                // Add new
                await addDoc(collection(firestore, 'junior_sorter_items'), {
                    ...newItem,
                    createdAt: serverTimestamp()
                });
                toast({ title: "Item Added!" });
            }

            // Reset forms and refetch
            setNewItem({ name: '', emoji: '', type: 'living' });
            setEditingItem(null);
            if (refetchSorter) refetchSorter();

        } catch (error) {
             toast({ title: "Error", description: "Failed to save item.", variant: "destructive" });
        }
    };

    const handleDeleteSorterItem = async (id: string) => {
        if (!firestore) return;
        try {
            const itemDoc = doc(firestore, 'junior_sorter_items', id);
            await deleteDoc(itemDoc);
            toast({ title: "Item Removed" });
            if (refetchSorter) refetchSorter();
            setCurrentIndex(0); // Reset index
        } catch (error) {
            console.error("Delete Error:", error);
            toast({ title: "Error", description: "Could not delete.", variant: "destructive" });
        }
    };
    
    // --- 5. MATTER LAB LOGIC ---
    const handleAddMaterial = async () => {
        if (!newMat.name || !firestore) return;
        try {
            await addDoc(collection(firestore, 'junior_science_materials'), newMat);
            setNewMat({ name: '', solid: { temp: -10, emoji: '🧊', label: 'Solid', desc: 'Frozen tight!' }, liquid: { temp: 1, emoji: '💧', label: 'Liquid', desc: 'Flowing around!' }, gas: { temp: 100, emoji: '💨', label: 'Gas', desc: 'Flying fast!' }});
            setShowAddMatForm(false);
            if(refetchMaterials) refetchMaterials();
            toast({ title: "Material Added!" });
        } catch (e) {
            toast({ variant: "destructive", title: "Error" });
        }
    };
    
    const matterState = useMemo(() => {
        if (!selectedMaterial) return null;
        if (temp <= selectedMaterial.solid.temp) return selectedMaterial.solid;
        if (temp >= selectedMaterial.gas.temp) return selectedMaterial.gas;
        return selectedMaterial.liquid;
    }, [temp, selectedMaterial]);

    // --- 6. DISCOVERY LOGIC ---
    const getFact = async () => {
        if(!topic.trim()) return;
        setLoading(true);
        setFact(null);
        // Mock AI call
        setTimeout(async () => {
            const result = { title: topic, fact: `The ${topic} is an amazing thing found in nature. It helps our planet!`, emojiIcon: '🌍' };
            setFact(result);
            setLoading(false);
            if(user && firestore) {
                 await addDoc(collection(firestore, 'junior_science'), { ...result, userId: user.uid, createdAt: serverTimestamp() });
            }
        }, 1000);
    };

    return (
        <div className="space-y-8">
            <div className="flex gap-2 p-1 bg-blue-50 rounded-2xl w-fit mx-auto border border-blue-100">
                <Button variant={activeTab === 'lab' ? 'default' : 'ghost'} onClick={() => setActiveTab('lab')}>Discovery</Button>
                <Button variant={activeTab === 'sorter' ? 'default' : 'ghost'} onClick={() => setActiveTab('sorter')}>Sorter</Button>
                <Button variant={activeTab === 'experiment' ? 'default' : 'ghost'} onClick={() => setActiveTab('experiment')}>Matter Lab</Button>
                <Button variant={activeTab === 'library' ? 'default' : 'ghost'} onClick={() => setActiveTab('library')}>Journal</Button>
            </div>

            {/* SORTER TAB */}
            {activeTab === 'sorter' && (
                <div className="space-y-6">
                    {canEdit && (
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg">
                                    <PlusCircle className="mr-2 h-4 w-4"/> Add or Manage Sorter Items
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Manage Sorter Library</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                     <div className="grid grid-cols-4 gap-2 p-4 border rounded-2xl bg-slate-50">
                                         <Input placeholder="Name" value={editingItem ? editingItem.name : newItem.name} onChange={e => editingItem ? setEditingItem({...editingItem, name: e.target.value}) : setNewItem({...newItem, name: e.target.value})} className="col-span-2" />
                                         <Input placeholder="Emoji" value={editingItem ? editingItem.emoji : newItem.emoji} onChange={(e) => editingItem ? setEditingItem({...editingItem, emoji: e.target.value}) : setNewItem({...newItem, emoji: e.target.value})} className="text-center"/>
                                         <Select value={editingItem ? editingItem.type : newItem.type} onValueChange={(v) => editingItem ? setEditingItem({...editingItem, type: v}) : setNewItem({...newItem, type: v})}>
                                             <SelectTrigger><SelectValue/></SelectTrigger>
                                             <SelectContent><SelectItem value="living">Living</SelectItem><SelectItem value="non-living">Non-Living</SelectItem></SelectContent>
                                         </Select>
                                         <div className="col-span-4 mt-2">
                                             <Button onClick={handleSaveOrUpdateSorterItem} size="sm" className="w-full bg-green-600 hover:bg-green-700">
                                                {editingItem ? <Save className="h-4 w-4 mr-2"/> : <Plus className="h-4 w-4 mr-2"/>}
                                                {editingItem ? 'Update Item' : 'Add Item'}
                                             </Button>
                                             {editingItem && <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)} className="w-full mt-1">Cancel Edit</Button>}
                                         </div>
                                     </div>
                                    
                                    <ScrollArea className="h-64 pr-4">
                                        <div className="space-y-2">
                                            {dbSorterItems?.map((item: any) => (
                                                <div key={item.id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{item.emoji}</span>
                                                        <div>
                                                            <p className="font-bold text-sm leading-none">{item.name}</p>
                                                            <Badge variant="outline" className="mt-1 text-[10px] uppercase">
                                                                {item.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                     <div className="flex gap-1">
                                                        <Button type="button" size="icon" variant="ghost" className="text-blue-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => setEditingItem(item)}><Edit className="h-4 w-4"/></Button>
                                                        <Button type="button" size="icon" variant="ghost" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteSorterItem(item.id)}><Trash2 className="h-4 w-4"/></Button>
                                                     </div>
                                                </div>
                                            ))}
                                            {(!dbSorterItems || dbSorterItems.length === 0) && (
                                                <p className="text-center text-slate-400 py-10">No items found.</p>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                    {/* Rest of Sorter Game UI code... */}
                    <div className="bg-slate-50 p-10 rounded-[40px] border-4 border-slate-200 text-center space-y-8">
                        {!dbSorterItems || dbSorterItems.length === 0 ? (
                            <div className="py-10 text-slate-400 font-bold">Your library is empty. Please add items above!</div>
                        ) : (
                            <div className="animate-in zoom-in space-y-8">
                                <div className="flex justify-center gap-1">
                                    {dbSorterItems.map((_: any, i: number) => (
                                        <div 
                                            key={i} 
                                            className={`h-2 w-8 rounded-full transition-all ${i === currentIndex ? 'bg-blue-500 w-12' : i < currentIndex ? 'bg-green-400' : 'bg-slate-200'}`} 
                                        />
                                    ))}
                                </div>
                                <div className="text-9xl mb-4 p-8 bg-white rounded-full shadow-xl w-48 h-48 mx-auto flex items-center justify-center border-8 border-blue-50">
                                    {dbSorterItems[currentIndex].emoji}
                                </div>
                                <h3 className="text-4xl font-black text-slate-800 capitalize">{dbSorterItems[currentIndex].name}</h3>
                                
                                <div className="flex justify-center gap-6">
                                    <Button 
                                        onClick={() => handleAnswer('living')}
                                        className="h-24 px-12 bg-green-500 text-2xl font-black rounded-3xl shadow-[0_10px_0_#15803d] active:shadow-none active:translate-y-2 transition-all"
                                    >
                                        🌳 Living
                                    </Button>
                                    <Button 
                                        onClick={() => handleAnswer('non-living')}
                                        className="h-24 px-12 bg-slate-500 text-2xl font-black rounded-3xl shadow-[0_10px_0_#334155] active:shadow-none active:translate-y-2 transition-all"
                                    >
                                        🧸 Non-Living
                                    </Button>
                                </div>
                                <p className="text-slate-400 font-bold">
                                    Item {currentIndex + 1} of {dbSorterItems.length}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {activeTab === 'lab' && (
                <Card className="rounded-[40px] border-4 border-purple-100 bg-purple-50/50 shadow-lg p-8 text-center space-y-6">
                    <CardTitle className="text-4xl font-black text-purple-800">The Discovery Lab</CardTitle>
                    <CardDescription className="text-lg">What do you want to learn about?</CardDescription>
                    <div className="flex justify-center gap-4">
                        <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Volcanoes, Magnets..." className="h-16 text-2xl w-96 rounded-2xl"/>
                        <Button onClick={getFact} disabled={loading || !topic} className="h-16 px-10 bg-purple-600 text-xl font-bold rounded-2xl">
                            {loading ? <Loader2 className="animate-spin"/> : <Sparkles />}
                        </Button>
                    </div>
                    {fact && (
                        <div className="p-8 bg-white rounded-3xl border-2 animate-in fade-in space-y-4">
                            <h3 className="text-3xl font-bold text-purple-700">{fact.title} {fact.emojiIcon}</h3>
                            <p className="text-xl text-slate-600">{fact.fact}</p>
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'experiment' && (
                 <Card className="rounded-[40px] border-4 border-cyan-100 bg-cyan-50/50 shadow-lg p-8 space-y-6">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-black text-cyan-800">Matter Lab</CardTitle>
                        <CardDescription className="text-lg">What happens when things get hot or cold?</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Select onValueChange={(v) => setSelectedMaterial(dbMaterials?.find((m:any) => m.id === v))}>
                                    <SelectTrigger className="h-12"><SelectValue placeholder="Select Material"/></SelectTrigger>
                                    <SelectContent>
                                        {dbMaterials?.map((m:any) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {canEdit && <Button onClick={() => setShowAddMatForm(p => !p)} variant="outline" size="icon"><PlusCircle className="h-4 w-4"/></Button>}
                            </div>
                             {showAddMatForm && (
                                <div className="p-4 border bg-white rounded-lg space-y-2">
                                    <Input value={newMat.name} onChange={e => setNewMat({...newMat, name: e.target.value})} placeholder="New Material Name"/>
                                    <Button onClick={handleAddMaterial} className="w-full">Save</Button>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label>Temperature: {temp}°C</Label>
                                <Input type="range" min="-100" max="200" value={temp} onChange={e => setTemp(Number(e.target.value))} className="w-full"/>
                            </div>
                        </div>

                        <div className="h-64 bg-white rounded-3xl border-4 border-cyan-200 flex items-center justify-center flex-col gap-4 text-center">
                            {matterState ? (
                                <>
                                    <div className="text-8xl animate-in zoom-in">{matterState.emoji}</div>
                                    <h4 className="text-3xl font-bold text-cyan-900">{matterState.label}</h4>
                                    <p className="text-slate-500">{matterState.desc}</p>
                                </>
                            ) : (
                                <p className="text-slate-400">Select a material!</p>
                            )}
                        </div>
                    </CardContent>
                 </Card>
            )}

            {activeTab === 'library' && (
                <Card>
                    <CardHeader><CardTitle>My Science Journal</CardTitle></CardHeader>
                    <CardContent>
                        {savedScience?.map((s:any) => (
                            <div key={s.id} className="border-b p-2">
                                <p className="font-bold">{s.title} <span className="font-normal text-muted-foreground text-xs">{s.createdAt?.toDate().toLocaleDateString()}</span></p>
                                <p className="text-sm">{s.fact}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
    const { role } = useRole();
    const canEdit = ['Teacher', 'Administrator', 'Director'].includes(role || '');

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Junior Campus</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Explore • Play • Learn</p>
                </div>

                <Tabs defaultValue="science" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-24 bg-white p-2 rounded-full shadow-xl border border-slate-100 mb-12">
                        <TabsTrigger value="phonics" className="rounded-full data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-black h-full text-lg"><Languages className="w-8 h-8 mr-2"/> Phonics</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-full data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black h-full text-lg"><Sigma className="w-8 h-8 mr-2"/> Math</TabsTrigger>
                        <TabsTrigger value="story" className="rounded-full data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-black h-full text-lg"><BookOpen className="w-8 h-8 mr-2"/> Story Time</TabsTrigger>
                        <TabsTrigger value="art" className="rounded-full data-[state=active]:bg-red-100 data-[state=active]:text-red-700 font-black h-full text-lg"><Paintbrush className="w-8 h-8 mr-2"/> Art Studio</TabsTrigger>
                    </TabsList>
                    
                    <div className="min-h-[600px] animate-in slide-in-from-bottom-6 duration-700">
                        <TabsContent value="phonics" className="mt-0"><PhonicsFun /></TabsContent>
                        <TabsContent value="math" className="mt-0"><MathPlayground /></TabsContent>
                        <TabsContent value="story" className="mt-0"><StoryTime /></TabsContent>
                        <TabsContent value="art" className="mt-0"><ArtStudio /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
