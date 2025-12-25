
      
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useBlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import p5 from 'p5';
import {
  Play,
  Square,
  Image as ImageIcon,
  User as UserIcon,
  Video,
  PlusCircle,
  Ghost,
  MousePointer2,
  Plus,
  Trash2,
  FolderOpen,
  Save,
  RotateCcw,
  Bot,
  HelpCircle,
  Palette,
  Droplet,
  Pencil,
  Eraser,
  Undo2,
  Redo2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp, addDoc, collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import confetti from 'canvas-confetti';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/context/role-context';

// Import custom block definitions
import '@/lib/blockly/custom-blocks'; // Ensure this path is correct

// --- 1. ASSET LIBRARIES ---
const SPRITE_LIBRARY = [
  { id: 'cat', name: 'Cat', emoji: '🐱', url: 'https://studio.apollographql.com/public/assets/avatars/avatar-24.svg', costumes: [
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjRkZCMDAwIj48cGF0aCBkPSJNMjQgMi40MDRjLTguNjMyIDAtMTUuNTg2IDYuOTU0LTE1LjU4NiAxNS41ODYgMCA4LjYzMiA2Ljk1NCAxNS41ODYgMTUuNTg2IDE1LjU4NlM0MC4wMjIgMzYuNjIyIDQwLjAyMiAyMSAyMy4wNjggMy40MDQgMTQuNSAxLjEzNCA5LjQ4IDAgNi43NzIgMi40MDR6TTkuNjkgMzQuMzg4Yy0yLjA4OCAwLTMuNzg1LTEuNjk3LTMuNzg1LTMuNzg1IDAtMi4wODggMS42OTctMy43ODUgMy43ODUtMy43ODUgMi4wODggMCAzLjc4NSAxLjY5NyAzLjc4NSAzLjc4NSAwIDIuMDg4LTEuNjk3IDMuNzg1LTMuNzg1IDMuNzg1em0yNS4wMiAwYy0yLjA4OCAwLTMuNzg1LTEuNjk3LTMuNzg1LTMuNzg1IDAtMi4wODggMS42OTctMy43ODUgMy43ODUtMy43ODVzMy43ODUgMS42OTcgMy43ODUgMy43ODVjMCAyLjA4OC0xLjY5NyAzLjc4NS0zLjc4NSAzeiIvPjxwYXRoIGQ9Ik0zNy4wNDggMzQuMzg4YTQuMjIgNC4yMiAwIDAgMS00LjIxNi00LjIxNmMwLTIuMzI4IDEuODg4LTQuMjE1IDQuMjE2LTQuMjE1czQuMjE2IDEuODg3IDQuMjE2IDQuMjE1YTQuMjIgNC4yMiAwIDAgMS00LjIxNiA0LjIxNnpNMTEuMzM3IDM0LjM4OGEtNC4yMiA0LjIyIDAgMCAxLTQuMjE1LTQuMjE2YzAtMi4zMjggMS44ODYtNC4yMTUgNC4yMTUtNC4yMTUgMi4zMyAwIDQuMjE2IDEuODg3IDQuMjE2IDQuMjE1YTQuMjIgNC4yMiAwIDAgMS00LjIxNiA0LjIxNnoiLz48cGF0aCBkPSJNMjQuNDM2IDM4LjQ5Yy01LjU2NSAwLTkuOTQ0LTQuNTgxLTkuOTQ0LTEwLjE0N3YtMy4wNDFoMTkuODg4djMuMDQxYzAgNS41NjYtNC40NzkgMTAuMTQ3LTEwLjE0NCAxMC4xNDdoLjJ6Ii8+PHBhdGggZD0iTTI0LjIzNCAzNy4zMjhhOS4wOTggOS4wOTggMCAwIDAtOS4wOTgtOS44NXYtMy4zNDJoMTguMTk3djMuMzQyYzAgNS41NjYtNC4wNiAxMC4xNDctOS4wOTggMTAuMTQ3eiIvPjwvZz48cGF0aGEgZD0iTTMwLjYxMiAyMC41NzVjLS42MTItMS4wNjMtMS44MDgtMS40Ni0yLjg3LTEuMDgzbC02LjMyIDMuMTYtNi4zMi0zLjE2Yy0xLjA2Mi0uNDc3LTIuMjU4LS4wNzgtMi4wODMtMS4wODNsLTUuNjA3IDguOTdjLS42MTIgMS4wNi0uMjc4IDIuMzk3IDEuMDAzIDIuOTc2bDEzLjc4MyA1Ljk4N2MxLjEyLjQ4IDIuNTUyIDAgMy4zODctMS4wODFsNS42MDYtOC45N2MuNjEzLTEuMDYgLjI4LTIuMzk3LTEuMDAyLTIuOTc3bC02LjMyLTMuMTZ6TTE2LjU3MiAyNC45MWw1Ljk0NyAyLjk3NCAyLjI0NC00LjQ4OCAyLjk3NCAxLjQ4NyAyLjgwMyA0LjQ4OC0xMS42MzgtNC45ODh6bS4yOC0yLjI0NGwyLjYyNi0xLjMxMyAyLjI0MyA0LjQ4N0wxOC41IDcuOTJsLTEuNjQ3IDkuODd6TTMyLjE2NSAyOC4wNmwLTYuNDk4LTIuODA0IDEuODU2LTMuNzEzIDIuOTgyIDEuNDkgMS42NSA5Ljkxek0xMC41MDQgMjkuMDUybDQuNzYtMi4wNjMgMS4yNDUgMi45MS02LjAwNiAyLjYxM3oiIGZpbGw9IiM2NjM4MTMiLz48cGF0aCBkPSJNNi40MyAxNi4xODJjMC0yLjU5MiAxLjkwMy00LjkzIDQuNDQ2LTUuNzU3LTIuMDgyIDEuMTE2LTMuNTAzIDMuNDU1LTMuNTAzIDYuMjA2IDAgMS42Ni41NjQgMy4xNTggMS40ODIgNC4zNTJhNi40MDcgNi40MDcgMCAwIDEtMi40MjUtNC44MDF6TTQyLjAzNCAyMS4wODJjMC0zLjAwNi0xLjk5OC01LjU3OC00Ljc3MS02LjYxNS41My40MjIgMS4wMDQgMS4wMDQgMS4zOTcgMS42OTYuODE4IDEuNDE3IDEuMjU1IDIuOTk4IDEuMjU1IDQuNzQgMCAxLjczLS40OTIgMy4zMzctMS4zNDcgNC42NzIgMS4zMTQtMS4yMjUgMi4xNzYtMi44ODYgMi4xNzYtNC44NjZhMTEuMTcgMTEuMTcgMCAwIDAtLjMwNi0yLjYyN3oiIGZpbGw9IiNGRkNCMDAiLz48cGF0aCBkPSJNMTkuNDIzIDE1LjkyYTQuNDUgNC40NSAwIDAgMS0yLjE4Ny0uNDUgMi43MDYgMi43MDYgMCAwIDAtNC4yOTUgMi4zODdjLjQyLjE3Ny44NzMuMzEyIDEuMzU0LjM4OGwxLjA0OS4yMS40MjMuMDY1YzEuMjggMCAyLjQ2My0uNzA1IDMuMTYtMS44MDVsLS40MjMtLjIxLS4wOC0uMDI0em04LjggMGExLjg3NSAxLjg3NSAwIDAgMC0zLjE0Mi4xNDZjLjUxOC44OTQgMS41MyAxLjU0NyAyLjY3OCAxLjU0N2ExLjgyNiAxLjgyNiAwIDAgMCAyLjEyLS4zNDcgMi42OTYgMi42OTYgMCAwIDAtMS42NTYtMS4zNDZ6TTI0LjA1OCAzN2E5LjY2NyA5LjY2NyAwIDAgMS04LjEyNC01LjAwMyAxMS4xNzYgMTEuMTc2IDAgMCAwIDE2LjI0NyAwQTkuNjY3IDkuNjY3IDAgMCAxIDI0LjA2IDM3eiIgZmlsbD0iIzAwMCIvPjwvZz48L3N2Zz4=' },
      { id: 'ghost', name: 'Ghost', emoji: '👻', url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' },
      { id: 'rocket', name: 'Rocket', emoji: '🚀', url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }
    ];
    const DEFAULT_BACKDROPS = [
      { id: 'blue-sky', name: 'Blue Sky', color: '#87CEEB', url: '' },
      { id: 'space', name: 'Space', color: '#000033', url: 'https://www.publicdomainpictures.net/pictures/170000/nahled/simple-star-field-background.jpg' },
      { id: 'grid', name: 'Grid', color: '#FFFFFF', url: 'https://www.publicdomainpictures.net/pictures/20000/nahled/white-grid-paper.jpg' }
    ];

    const SOUND_LIBRARY = [
      { id: 'meow', label: 'Meow 🐱', url: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjU2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWWqgCgAAAAAABQQgQADAAAJpABwAgABHAAAABfuBwYDxuA4+D4g//lAElAIAAAABgAAAGAAAAAAAAAAAAAAA4AAAAaAAAAANAAAApAAAAMAAAACAAAABAAAAAgAAACAAABAASDBIAAgQIEAEUAAABTAAAAEAAABAAAAAQCAQIEAgICBAQCAgQEBAICBAQGBAQCAgQCBgYIBgYICAQAAAACAgQEBgYIBgYIBgYIBgYIAQAAAAGBgYGBgYGBgYGBgYGBgYGBgYGAgAAAEAAABAQGCAYIAgYGCgAEAAgEBAQACAgICAgIEBAUAAQAEAgIECgAIAgQCBgAIAAAAAAEAAQECBwAIAQYAAgAIAAAEAAEAAAACAgICAgICAgICAgICAgQCBgYEBAIGBgYGBgYGBgYGBgYGAgAAAQECAgIGBgYICAgKCgoKCgoKCgoKCgoKCgoKCgoKCgoK//uA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
- ' },
      { id: 'pop', label: 'Pop 🎈', url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmRkFjVAAA' }
    ];

const ScratchEngine = () => {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const [sprites, setSprites] = useState(DEFAULT_SPRITES);
    const [backdrops, setBackdrops] = useState(DEFAULT_BACKDROPS);
    const [activeSprite, setActiveSprite] = useState(DEFAULT_SPRITES[0]);
    const [activeBackdrop, setActiveBackdrop] = useState(DEFAULT_BACKDROPS[0]);
    const [loadedImages, setLoadedImages] = useState<any>({});
    const [bgImg, setBgImg] = useState<p5.Image | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const p5ContainerRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<p5 | null>(null);

    const engineState = useRef({
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        direction: 90, // 0 is right, 90 is up
        size: 100, // percentage
        message: '',
        messageDuration: 0,
        isPenDown: false,
        penColor: '#000000',
        shouldClear: false,
        costumeIndex: 0
    });

    // Blockly state
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const [xml, setXml] = useState<string>('');
    const [generatedCode, setGeneratedCode] = useState('');

    const { workspace } = useBlocklyWorkspace({
        ref: blocklyDivRef,
        toolboxConfiguration: {
            kind: 'categoryToolbox',
            contents: [
                { kind: 'category', name: 'Events', colour: '#FFD500', contents: [ { kind: 'block', type: 'event_whenflagclicked' } ] },
                { kind: 'category', name: 'Motion', colour: '#4C97FF', contents: [
                    { kind: 'block', type: 'motion_move', inputs: { STEPS: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
                    { kind: 'block', type: 'motion_turnright', inputs: { DEGREES: { shadow: { type: 'math_number', fields: { NUM: 15 } } } } }
                ]},
                { kind: 'category', name: 'Looks', colour: '#9966FF', contents: [
                    { kind: 'block', type: 'looks_sayforsecs', inputs: { MESSAGE: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } }, SECS: { shadow: { type: 'math_number', fields: { NUM: 2 } } } } },
                    { kind: 'block', type: 'looks_say', inputs: { MESSAGE: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } } } },
                    { kind: 'block', type: 'looks_thinkforsecs', inputs: { MESSAGE: { shadow: { type: 'text', fields: { TEXT: 'Hmm...' } } }, SECS: { shadow: { type: 'math_number', fields: { NUM: 2 } } } } },
                    { kind: 'block', type: 'looks_think', inputs: { MESSAGE: { shadow: { type: 'text', fields: { TEXT: 'Hmm...' } } } } },
                    { kind: 'block', type: 'looks_changesizeby', inputs: { CHANGE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
                    { kind: 'block', type: 'looks_setsizeto', inputs: { SIZE: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
                    { kind: 'block', type: 'looks_nextcostume' }
                ]},
                { kind: 'category', name: 'Sound', colour: '#CF63CF', contents: [
                    { kind: 'block', type: 'sound_playuntildone', inputs: { SOUND_MENU: { shadow: { type: 'sound_sounds_menu' }}}},
                ]},
                { kind: 'category', name: 'Control', colour: '#FFAB19', contents: [
                    { kind: 'block', type: 'control_wait', inputs: { DURATION: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
                    { kind: 'block', type: 'control_repeat', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
                    { kind: 'block', type: 'control_forever' }
                ]},
                { kind: 'category', name: 'Sensing', colour: '#4CBFE6', contents: [{ kind: 'block', type: 'sensing_touchingmouse' }] },
                { kind: 'category', name: 'Operators', colour: '#40BF4A', contents: [{ kind: 'block', type: 'operator_random' }] },
                { kind: 'category', 'name': 'Pen', 'colour': '#00B295', 'contents': [
                    { 'kind': 'block', 'type': 'pen_clear' },
                    { 'kind': 'block', 'type': 'pen_stamp' },
                    { 'kind': 'block', 'type': 'pen_penDown' },
                    { 'kind': 'block', 'type': 'pen_penUp' },
                    { 'kind': 'block', 'type': 'pen_setPenColorToColor' },
                    { 'kind': 'block', 'type': 'pen_changePenSizeBy' },
                    { 'kind': 'block', 'type': 'pen_setPenSizeTo' }
                ]},
                { kind: 'sep' },
                { kind: 'category', name: 'Variables', colour: '#FF8C1A', custom: 'VARIABLE' },
                { kind: 'category', name: 'My Blocks', colour: '#FF6680', custom: 'PROCEDURE' }
            ]
        },
        initialXml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="event_whenflagclicked" id="entry_point" x="100" y="100"></block></xml>'
    });

    const runCode = async () => {
        const code = javascriptGenerator.workspaceToCode(workspace);
        setGeneratedCode(code);
        
        // Define context for the sandboxed execution
        const context = {
            move: (steps: number) => {
                const angle = (engineState.current.direction - 90) * (Math.PI / 180);
                engineState.current.x += steps * Math.cos(angle);
                engineState.current.y += steps * Math.sin(angle);
            },
            turn: (degrees: number) => {
                engineState.current.direction += degrees;
            },
            say: (message: string, duration?: number) => {
                engineState.current.message = message;
                if (duration) {
                    setTimeout(() => {
                        if (engineState.current.message === message) {
                            engineState.current.message = '';
                        }
                    }, duration * 1000);
                }
            },
            think: (message: string, duration?: number) => {
                // For now, think behaves the same as say but could have a different UI
                engineState.current.message = message;
                 if (duration) {
                    setTimeout(() => {
                        if (engineState.current.message === message) {
                            engineState.current.message = '';
                        }
                    }, duration * 1000);
                }
            },
            changeSizeBy: (change: number) => {
                engineState.current.size += change;
            },
            setSizeTo: (size: number) => {
                engineState.current.size = size;
            },
            wait: (seconds: number) => {
                return new Promise(resolve => setTimeout(resolve, seconds * 1000));
            },
            nextCostume: () => {
                const sprite = sprites.find(s => s.id === activeSprite.id);
                if (sprite && sprite.costumes && sprite.costumes.length > 0) {
                    engineState.current.costumeIndex = (engineState.current.costumeIndex + 1) % sprite.costumes.length;
                }
            },
            setPen: (isDown: boolean) => {
                engineState.current.isPenDown = isDown;
            },
            penClear: () => {
                engineState.current.shouldClear = true;
            },
            setPenColor: (color: string) => {
                engineState.current.penColor = color;
            },
            playSound: (soundId: string) => {
                const sound = SOUND_LIBRARY.find(s => s.id === soundId);
                if (sound && sound.url) {
                    try {
                        const audio = new Audio(sound.url);
                        audio.play().catch(e => console.error("Audio playback error:", e));
                    } catch (e) {
                         console.error("Audio creation error:", e);
                    }
                }
            },
            isTouching: (object: string) => {
                 // Placeholder for collision detection
                return false;
            },
            getRandom: (min: number, max: number) => {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        };
        
        // This is a safer way to execute the generated code
        // It avoids the direct use of `eval` or `new Function` if possible,
        // but for this dynamic scenario, `new Function` is a common approach.
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        const func = new AsyncFunction(...Object.keys(context), `try { ${code} } catch(e) { console.error('Execution Error:', e); }`);

        try {
            await func(...Object.values(context));
        } catch (e) {
            console.error("Error executing generated code: ", e);
            toast({
                title: "Code Execution Error",
                description: e instanceof Error ? e.message : String(e),
                variant: "destructive",
            });
        }
    };
    
    // P5.js sketch setup
    useEffect(() => {
        if (!p5ContainerRef.current) return;
        
        let p5Instance: p5;

        const sketch = (p: p5) => {
            let penLayer: p5.Graphics;
            let loadedCostumes: { [key: string]: p5.Image } = {};

            const preloadAssets = () => {
                if (activeSprite.costumes && activeSprite.costumes.length > 0) {
                     activeSprite.costumes.forEach((url, index) => {
                        const key = `${activeSprite.id}-${index}`;
                        if (!loadedImages[key]) {
                           p.loadImage(url, img => {
                               setLoadedImages(prev => ({...prev, [key]: img}));
                           }, err => {
                               console.error(`Failed to load costume: ${url}`, err);
                           });
                        }
                    });
                }
                if (activeBackdrop.url) {
                    if (!loadedImages[activeBackdrop.id]) {
                        p.loadImage(activeBackdrop.url, img => {
                             setLoadedImages(prev => ({...prev, [activeBackdrop.id]: img}));
                        });
                    }
                }
            };
            
            p.setup = () => {
                const container = p5ContainerRef.current!;
                const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
                canvas.parent(container);
                penLayer = p.createGraphics(p.width, p.height);
                p.frameRate(30);
                preloadAssets();
            };
    
            p.draw = () => {
                // Background
                const bg = loadedImages[activeBackdrop.id];
                if (bg) {
                    p.background(bg);
                } else {
                    p.background(activeBackdrop.color || '#FFFFFF');
                }

                // Pen drawing
                if (engineState.current.shouldClear) {
                    penLayer.clear();
                    engineState.current.shouldClear = false;
                }

                if (engineState.current.isPenDown) {
                    penLayer.stroke(engineState.current.penColor);
                    penLayer.strokeWeight(4); // You can make this dynamic later
                    penLayer.line(
                        p.width / 2 + engineState.current.prevX,
                        p.height / 2 - engineState.current.prevY,
                        p.width / 2 + engineState.current.x,
                        p.height / 2 - engineState.current.y
                    );
                }
                p.image(penLayer, p.width/2, p.height/2);

                // Sprite
                const costumeKey = `${activeSprite.id}-${engineState.current.costumeIndex}`;
                const currentCostumeImage = loadedImages[costumeKey];

                p.push();
                p.translate(p.width / 2 + engineState.current.x, p.height / 2 - engineState.current.y);
                p.rotate(p.radians(engineState.current.direction - 90));
                p.scale(engineState.current.size / 100);

                if (currentCostumeImage) {
                    p.imageMode(p.CENTER);
                    p.image(currentCostumeImage, 0, 0);
                } else {
                    p.textAlign(p.CENTER, p.CENTER);
                    p.textSize(50);
                    p.text(activeSprite.emoji, 0, 0);
                }
                p.pop();

                // Speech bubble
                if (engineState.current.message) {
                    p.fill(255);
                    p.stroke(0);
                    p.rect(p.width / 2 + engineState.current.x + 40, p.height / 2 - engineState.current.y - 60, 120, 40, 10);
                    p.fill(0);
                    p.noStroke();
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(engineState.current.message, p.width / 2 + engineState.current.x + 100, p.height / 2 - engineState.current.y - 45);
                }

                // Update prev positions
                engineState.current.prevX = engineState.current.x;
                engineState.current.prevY = engineState.current.y;
            };

            p.windowResized = () => {
                if (p5ContainerRef.current) {
                    p.resizeCanvas(p5ContainerRef.current.offsetWidth, p5ContainerRef.current.offsetHeight);
                    penLayer.resizeCanvas(p.width, p.height);
                }
            };
        };

        p5Instance.current = new p5(sketch);
        
        return () => {
            p5Instance.current?.remove();
        };
    }, [activeSprite, activeBackdrop]); // Re-run sketch if active items change

    const handleReset = () => {
        engineState.current = {
            x: 0, y: 0, prevX: 0, prevY: 0, direction: 90,
            size: 100, message: '', messageDuration: 0,
            isPenDown: false, penColor: '#000000', shouldClear: true, costumeIndex: 0
        };
        // The draw loop will handle the rest
    };


    const handleSpriteSelect = (sprite: any) => {
        engineState.current.costumeIndex = 0; // Reset costume on sprite change
        setActiveSprite(sprite);
    };

    const handleBackdropSelect = (backdrop: any) => {
        setActiveBackdrop(backdrop);
    };
    
    // This is a placeholder since the original component had these variables but they weren't defined.
    // Replace with your actual logic for fetching these.
    const canEdit = false;
    const refetchAssets = () => {};
    const [setLogs] = useState<string[]>([]);
    
    return (
        <div className="flex h-full bg-slate-100">
            {/* Left: Blockly */}
            <div className="w-2/3 h-full relative" ref={blocklyDivRef} style={{ resize: 'horizontal', overflow: 'auto' }}/>

            {/* Right: Stage, Sprites, etc. */}
            <div className="w-1/3 h-full flex flex-col p-2 gap-2">
                
                {/* Stage */}
                <div className="relative aspect-video bg-gray-200" ref={p5ContainerRef}>
                    <div className="absolute top-2 right-2 flex gap-2">
                        <Button size="icon" onClick={runCode} className="bg-green-500 hover:bg-green-600"><Play className="h-5 w-5"/></Button>
                        <Button size="icon" variant="destructive" onClick={handleReset}><Square className="h-5 w-5"/></Button>
                    </div>
                </div>

                {/* Tabs for Sprites/Backdrops */}
                <Tabs defaultValue="sprites" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sprites">Sprites</TabsTrigger>
                        <TabsTrigger value="backdrops">Backdrops</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="sprites" className="flex-1 overflow-y-auto">
                        <div className="p-2 grid grid-cols-3 gap-2">
                            {sprites.map(sprite => (
                                <button key={sprite.id} onClick={() => handleSpriteSelect(sprite)} className={`p-2 rounded-lg border-2 ${activeSprite.id === sprite.id ? 'border-blue-500 bg-blue-100' : 'border-transparent bg-slate-100'}`}>
                                    <div className="text-4xl">{sprite.emoji}</div>
                                    <p className="text-xs">{sprite.name}</p>
                                </button>
                            ))}
                            {canEdit && <AddAssetModal type="sprite" onAdded={refetchAssets} />}
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="backdrops" className="flex-1 overflow-y-auto">
                         <div className="p-2 grid grid-cols-3 gap-2">
                            {backdrops.map(backdrop => (
                                <button key={backdrop.id} onClick={() => handleBackdropSelect(backdrop)} className={`p-2 rounded-lg border-2 flex flex-col items-center ${activeBackdrop.id === backdrop.id ? 'border-blue-500' : 'border-transparent'}`}>
                                    <div className="w-16 h-12 rounded" style={{backgroundColor: backdrop.color}} />
                                    <p className="text-xs mt-1">{backdrop.name}</p>
                                </button>
                            ))}
                             {canEdit && <AddAssetModal type="backdrop" onAdded={refetchAssets} />}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

    