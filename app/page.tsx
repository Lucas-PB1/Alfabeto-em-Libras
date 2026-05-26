'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  BookOpen, 
  Hand, 
  Info, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  Trophy,
  Bug,
  Home,
  User,
  Flower2,
  Cat,
  Trees,
  Square,
  CircleDot,
  Ghost,
  Plane,
  Baby,
  Car,
  Dices,
  School,
  HandMetal,
  IceCream,
  Music,
  Church,
  Waves,
  Zap,
  Moon,
  Smile,
  Navigation,
  Ship,
  Bus,
  Bird,
  Fish,
  PieChart,
  Image as ImageIcon,
  Mouse,
  Settings,
  Sun,
  Shield,
  Train,
  BicepsFlexed,
  Grape,
  Flame,
  Wind,
  Coffee,
  Grid3X3,
  Soup,
  Circle,
  Accessibility,
  CloudMoon,
  Sparkles,
  Volume2,
  Bot,
  Send,
  Search,
  ArrowLeft,
  Apple,
  Banana,
  Cake,
  Cookie,
  Cloud,
  Glasses,
  Bone,
  Pizza,
  Tractor,
  Phone,
  Wifi,
  Pencil,
  Rocket,
  Umbrella,
  Key,
  Gift,
  Dog,
  Crown,
  Star
} from 'lucide-react';

import { cn } from '@/lib/utils';

// Game State Definitions
type View = 'HOME' | 'REFERENCE' | 'GAME' | 'CELEBRATION';

interface Item {
  id: number;
  name: string;
  letter: string;
  icon: React.ReactNode;
  color: string;
}

const ITEMS: Item[] = [
  { id: 1, name: 'ABELHA', letter: 'A', icon: <Bug size={64} />, color: 'bg-yellow-400' },
  { id: 2, name: 'BOLA', letter: 'B', icon: <CircleDot size={64} />, color: 'bg-blue-400' },
  { id: 3, name: 'CASA', letter: 'C', icon: <Home size={64} />, color: 'bg-red-400' },
  { id: 4, name: 'DADO', letter: 'D', icon: <Dices size={64} />, color: 'bg-white' },
  { id: 5, name: 'ESTRELA', letter: 'E', icon: <Star size={64} />, color: 'bg-yellow-300' },
  { id: 6, name: 'FOGUETE', letter: 'F', icon: <Rocket size={64} />, color: 'bg-sky-500' },
  { id: 7, name: 'GATO', letter: 'G', icon: <Cat size={64} />, color: 'bg-orange-300' },
  { id: 8, name: 'HERÓI', letter: 'H', icon: <Shield size={64} />, color: 'bg-rose-500' },
  { id: 9, name: 'ILHA', letter: 'I', icon: <Trees size={64} />, color: 'bg-cyan-400' },
  { id: 10, name: 'JACARÉ', letter: 'J', icon: <Waves size={64} />, color: 'bg-green-700' },
  { id: 11, name: 'KIWI', letter: 'K', icon: <Circle size={64} />, color: 'bg-green-200' },
  { id: 12, name: 'LÁPIS', letter: 'L', icon: <Pencil size={64} />, color: 'bg-purple-400' },
  { id: 13, name: 'MAÇÃ', letter: 'M', icon: <Apple size={64} />, color: 'bg-red-500' },
  { id: 14, name: 'NUVEM', letter: 'N', icon: <Cloud size={64} />, color: 'bg-slate-100' },
  { id: 15, name: 'OVO', letter: 'O', icon: <CircleDot size={64} />, color: 'bg-stone-100' },
  { id: 16, name: 'PEIXE', letter: 'P', icon: <Fish size={64} />, color: 'bg-cyan-400' },
  { id: 17, name: 'QUEIJO', letter: 'Q', icon: <PieChart size={64} />, color: 'bg-yellow-300' },
  { id: 18, name: 'REI', letter: 'R', icon: <Crown size={64} />, color: 'bg-amber-500' },
  { id: 19, name: 'SOL', letter: 'S', icon: <Sun size={64} />, color: 'bg-yellow-400' },
  { id: 20, name: 'TREM', letter: 'T', icon: <Train size={64} />, color: 'bg-red-600' },
  { id: 21, name: 'UVA', letter: 'U', icon: <Grape size={64} />, color: 'bg-purple-600' },
  { id: 22, name: 'VELA', letter: 'V', icon: <Flame size={64} />, color: 'bg-orange-400' },
  { id: 23, name: 'WIFI', letter: 'W', icon: <Wifi size={64} />, color: 'bg-sky-300' },
  { id: 24, name: 'XÍCARA', letter: 'X', icon: <Coffee size={64} />, color: 'bg-slate-400' },
  { id: 25, name: 'YOYO', letter: 'Y', icon: <Circle size={64} />, color: 'bg-purple-400' },
  { id: 26, name: 'ZEBRA', letter: 'Z', icon: <Grid3X3 size={64} />, color: 'bg-slate-100' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇ'.split('');

/**
 * Mappings for the Libras font from CDNFonts
 * A-Z usually map directly. Ç is often 'ç' or a special char.
 */
const getLibrasChar = (letter: string) => {
  const upper = letter.toUpperCase();
  if (upper === 'Ç') return 'ç';
  return upper;
};

const getLibrasSignUrl = (letter: string) => {
  const lower = letter.toLowerCase();
  const mappedLower = lower === 'ç' ? 'cedilha' : lower;
  // Libras.com.br is generally stable for common educational assets
  return `https://www.libras.com.br/assets/img/alfabeto/${mappedLower}.png`;
};

function LibrasImage({ letter, alt, className }: { letter: string; alt: string; className?: string }) {
  const upper = letter.toUpperCase();
  const [src, setSrc] = useState(`/libras/${upper}.svg`);
  const [hasError, setHasError] = useState(false);
  const [prevLetter, setPrevLetter] = useState(letter);

  if (letter !== prevLetter) {
    setPrevLetter(letter);
    setSrc(`/libras/${upper}.svg`);
    setHasError(false);
  }

  const isCedilha = upper === 'Ç';

  const handleError = () => {
    if (src.endsWith('.svg')) {
      setSrc(`/libras/${upper}.png`);
    } else {
      setHasError(true);
    }
  };

  return (
    <motion.div 
      className="relative w-full h-full flex items-center justify-center select-none"
      animate={isCedilha ? {
        x: [0, -3, 3, -3, 3, 0],
      } : {}}
      transition={isCedilha ? {
        repeat: Infinity,
        duration: 1.2,
        ease: "easeInOut",
        repeatDelay: 0.5
      } : {}}
    >
      {!hasError ? (
        <Image 
          src={src} 
          alt={alt}
          fill
          className={cn("object-contain p-1", className)}
          referrerPolicy="no-referrer"
          onError={handleError}
          unoptimized
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-2">
          <span className="font-libras text-6xl sm:text-7xl md:text-8xl text-[#1E293B] leading-none" style={{ fontFamily: 'Libras' }}>
            {getLibrasChar(letter)}
          </span>
          <span className="text-[9px] font-black text-slate-400 mt-1 block uppercase tracking-wider">
            SINAL {letter}
          </span>
        </div>
      )}

      {/* Decorative Text Letter in the background */}
      <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl font-black text-slate-100 z-[-1] opacity-20 select-none pointer-events-none">
        {letter}
      </div>
    </motion.div>
  );
}

export default function AlfabetoManualApp() {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'NONE' | 'CORRECT' | 'WRONG'>('NONE');
  const [wrongLetter, setWrongLetter] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  
  // New state for dynamic pools
  const [activeItems, setActiveItems] = useState<Item[]>([]);
  const [visibleLetters, setVisibleLetters] = useState<string[]>([]);

  // Function to refresh pools
  const refreshPools = React.useCallback((newCompletedIds: number[] = completedItems) => {
    // 1. Pick 3 random items not yet completed
    const remainingItems = ITEMS.filter(item => !newCompletedIds.includes(item.id));
    if (remainingItems.length === 0) return;

    // Shuffle and pick 3 (or fewer if near the end)
    const shuffled = [...remainingItems].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    setActiveItems(selected);

    // 2. Pick 10 letters including the ones needed for active items
    const requiredLetters = Array.from(new Set(selected.map(item => item.letter)));
    const otherLetters = ALPHABET.filter(l => !requiredLetters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 10 - requiredLetters.length);
    
    setVisibleLetters([...requiredLetters, ...otherLetters].sort());
    
    // Auto-select the first item to make game flow natural and modern
    if (selected.length > 0) {
      setSelectedItem(selected[0]);
    }
  }, [completedItems]);

  const startGame = () => {
    refreshPools([]);
    setCurrentView('GAME');
  };

  // Handle item selection
  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setFeedback('NONE');
    setWrongLetter(null);
    setMessage('');
  };

  // Handle letter click
  const handleLetterClick = (letter: string) => {
    if (feedback !== 'NONE') return;

    if (!selectedItem) {
      setFeedback('WRONG');
      setMessage('Escolha um desenho listado à esquerda primeiro!');
      setTimeout(() => {
        setFeedback('NONE');
        setMessage('');
      }, 1500);
      return;
    }

    if (letter === selectedItem.letter) {
      setFeedback('CORRECT');
      setMessage(`🎉 Muito bem! Letra "${selectedItem.letter}" é de ${selectedItem.name}! 🌟`);
      
      const newCompleted = [...completedItems, selectedItem.id];
      
      // Delay to show success then refresh
      setTimeout(() => {
        setCompletedItems(newCompleted);
        setSelectedItem(null);
        setFeedback('NONE');
        setMessage('');
        
        if (newCompleted.length === 5) {
          setCurrentView('CELEBRATION');
        } else {
          refreshPools(newCompleted);
        }
      }, 2000);
    } else {
      setFeedback('WRONG');
      setWrongLetter(letter);
      setMessage(`❌ Não é a letra "${letter}". Qual a letra inicial do desenho "${selectedItem.name}"?`);
      
      // Reset after 1.8 seconds so users can read the helpful feedback
      setTimeout(() => {
        setFeedback('NONE');
        setWrongLetter(null);
        setMessage('');
      }, 1800);
    }
  };

  const restartGame = () => {
    setCompletedItems([]);
    setSelectedItem(null);
    setFeedback('NONE');
    setWrongLetter(null);
    setMessage('');
    setActiveItems([]);
    refreshPools([]);
    setCurrentView('GAME');
  };

  // Header UI Component
  const renderHeader = () => (
    <div className="w-full flex justify-between items-center px-3 py-2 sm:px-5 sm:py-2.5 bg-[#1E293B] text-white border-b-2 border-[#FACC15] shadow-sm shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden select-none">
        <h1 className="text-base sm:text-lg md:text-xl font-display font-extrabold tracking-tight truncate">
          Alfabeto Manual
        </h1>
        <div className="inline-flex items-center gap-1 bg-[#0F172A] border border-slate-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-[#FACC15] w-fit shrink-0">
          <span>{completedItems.length}/5</span>
          <span>✅</span>
        </div>
      </div>
      <div className="flex gap-1.5 sm:gap-2 shrink-0">
        <button 
          onClick={restartGame}
          className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-[#334155] hover:bg-[#475569] text-white rounded-lg active:translate-y-0.5 transition-all flex items-center gap-1 font-bold text-[11px] sm:text-xs uppercase cursor-pointer"
        >
          <RotateCcw size={12} /> <span>Reiniciar</span>
        </button>
        <button 
          onClick={() => setCurrentView('HOME')}
          className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg active:translate-y-0.5 transition-all flex items-center gap-1 font-bold text-[11px] sm:text-xs uppercase cursor-pointer"
        >
          <X size={12} /> <span>Sair</span>
        </button>
      </div>
    </div>
  );

  // Generate stable confetti values without using inline Math.random in useMemo to satisfy linter
  const confetti = useMemo(() => {
    const list = [];
    for (let i = 0; i < 20; i++) {
      // Deterministic "randomness" based on index
      const x = (i * 50) % 1000 - 500;
      const duration = 3 + (i % 3);
      const delay = (i % 5) * 0.4;
      const emojis = ['✨', '⭐', '🎈', '🎉'];
      list.push({
        id: i,
        x,
        duration,
        delay,
        emoji: emojis[i % emojis.length]
      });
    }
    return list;
  }, []);

  // Filter items by selected letter if needed or just show all
  // For better UX on mobile, we might want to show a grid of items
  
  return (
    <main className={cn(
      "min-h-screen bg-[#FFFBEB] text-[#0F172A] flex flex-col items-center overflow-x-hidden font-sans",
      currentView === 'GAME' && "h-screen max-h-screen overflow-hidden"
    )}>
      {/* Dynamic View Rendering */}
      <AnimatePresence mode="wait">
        
        {/* HOME VIEW */}
        {currentView === 'HOME' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center p-6 gap-5 text-center py-12 md:py-24 w-full max-w-md mx-auto"
          >
            <div className="relative">
               <motion.div 
                 animate={{ rotate: [0, 5, -5, 0] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 text-3xl sm:text-4xl select-none"
               >
                 🎨
               </motion.div>
               <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-display font-black text-[#1E293B] leading-none tracking-tight drop-shadow-sm">
                ALFABETO <br/> <span className="text-[#FACC15] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] sm:drop-shadow-[3px_3px_0px_rgba(0,0,0,0.1)]">MANUAL</span>
              </h1>
            </div>
            
            <p className="text-sm sm:text-base font-bold text-slate-600 bg-white/70 px-4 py-1.5 rounded-full border border-dashed border-[#FACC15] shadow-sm">
              Aprendendo o ABC e Libras!
            </p>
            
            <div className="flex flex-col gap-3 w-full mt-4">
              <button 
                onClick={startGame}
                className="group flex items-center justify-between px-5 py-3 sm:px-6 sm:py-4 bg-[#FACC15] text-[#1E293B] rounded-xl sm:rounded-2xl text-base sm:text-lg font-black border-2 border-[#CA8A04] shadow-[0px_3px_0px_0px_rgba(202,138,4,1)] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer select-none"
              >
                <span>JOGAR</span>
                <Play size={18} className="fill-current shrink-0" />
              </button>
              
              <button 
                onClick={() => setCurrentView('REFERENCE')}
                className="group flex items-center justify-between px-5 py-3 sm:px-6 sm:py-4 bg-[#38BDF8] text-white rounded-xl sm:rounded-2xl text-base sm:text-lg font-black border-2 border-[#0284C7] shadow-[0px_3px_0px_0px_rgba(2,132,199,1)] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer select-none"
              >
                <span>ALFABETO LIBRAS</span>
                <Hand size={18} className="shrink-0" />
              </button>
            </div>
          </motion.div>
        )}

        {/* REFERENCE VIEW */}
        {currentView === 'REFERENCE' && (
          <motion.div 
            key="reference"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl px-4 py-4 sm:py-6 mt-4 sm:mt-8 flex flex-col items-center gap-4 sm:gap-6 select-none"
          >
            <div className="flex justify-between w-full items-center gap-4 border-b-2 border-slate-200 pb-3">
              <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#1E293B]">Referência Libras</h2>
              <button 
                onClick={() => setCurrentView('HOME')}
                className="px-4 py-1.5 bg-[#334155] hover:bg-[#475569] text-white text-xs sm:text-sm font-black rounded-lg shadow-sm border-2 border-[#1E293B] active:translate-y-0.5 transition-all cursor-pointer"
              >
                VOLTAR AO MENU
              </button>
            </div>
            
            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-3 w-full pb-10">
              {ALPHABET.map((letter) => {
                return (
                    <motion.div 
                      key={letter} 
                      whileHover={{ scale: 1.04 }}
                      className="bg-white border-2 border-dashed border-[#38BDF8] p-2 sm:p-3 rounded-xl sm:rounded-2xl aspect-square shadow-sm flex flex-col items-center justify-center gap-1 relative group overflow-hidden"
                    >
                      <div className="text-sm sm:text-base font-black text-[#F43F5E] absolute top-1 right-2">
                        {letter}
                      </div>
                      <div className="relative w-full h-full p-1">
                        <LibrasImage 
                          key={letter}
                          letter={letter} 
                          alt={`Sinal da letra ${letter}`}
                          className="object-contain"
                        />
                      </div>
                      <div className="absolute inset-0 border-2 border-[#38BDF8] rounded-xl sm:rounded-2xl opacity-10 pointer-events-none group-hover:opacity-30 transition-opacity" />
                    </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* GAME VIEW */}
        {currentView === 'GAME' && (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col overflow-hidden"
          >
            {renderHeader()}
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 bg-[#FFFBEB]">
              {/* Desktop Items Sidebar: Only visible on md+ screen sizes */}
              <div className="hidden md:block md:w-[240px] lg:w-[280px] bg-white border-r-2 border-[#1E293B] shrink-0 md:h-full min-h-0">
                <div className="flex flex-col p-3 gap-3 overflow-y-auto no-scrollbar justify-start h-full select-none">
                  {activeItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={cn(
                        "flex-shrink-0 flex items-center gap-3 px-4 py-2.5 border-2 rounded-2xl transition-all text-left relative cursor-pointer select-none w-full",
                        selectedItem?.id === item.id 
                          ? "bg-[#FEF9C3] border-[#FACC15] scale-[1.01] shadow-sm z-10" 
                          : "bg-white border-slate-200 hover:border-[#FACC15] shadow-sm"
                      )}
                    >
                      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border border-slate-100 shrink-0 [&>svg]:w-6 [&>svg]:h-6 text-slate-800", item.color)}>
                        {item.icon}
                      </div>
                      <span className="font-extrabold text-sm md:text-base text-slate-800 tracking-tight uppercase truncate">{item.name}</span>
                    </button>
                  ))}
                  <div className="flex flex-1 items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center text-slate-400 font-bold uppercase text-xs lg:text-sm select-none">
                    {completedItems.length} de 5 concluídos
                  </div>
                </div>
              </div>

              {/* Mobile Symmetric 3-Column Top Bar: perfectly responsive, fits nicely without horizontal scroll */}
              <div className="w-full bg-white border-b-2 border-[#1E293B] shrink-0 md:hidden p-2 select-none shadow-sm">
                <div className="grid grid-cols-3 gap-2 h-full">
                  {activeItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className={cn(
                          "flex flex-col items-center justify-center py-1.5 px-0.5 border-2 border-b-[4px] rounded-xl transition-all cursor-pointer select-none",
                          isSelected 
                            ? "bg-[#FEF9C3] border-[#FACC15] border-b-[#CA8A04] scale-[1.03] shadow-sm"
                            : "bg-white border-slate-200 border-b-slate-300 active:translate-y-[2px] active:border-b-2"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border border-slate-100 shrink-0 [&>svg]:w-4.5 [&>svg]:h-4.5 text-slate-800 shadow-sm", 
                          item.color
                        )}>
                          {item.icon}
                        </div>
                        <span className="font-black text-[10px] text-slate-700 tracking-tight uppercase truncate max-w-full mt-1.5">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Central Area: Big Interactive Display Card */}
              <div className="flex-1 flex flex-col items-center justify-center p-2.5 xs:p-3 sm:p-4 md:p-6 relative overflow-hidden bg-[#FFFBEB] min-h-0">
                <motion.div 
                  className="w-full max-w-xl max-h-full bg-white border-2 md:border-4 border-[#1E293B] rounded-2xl md:rounded-3xl shadow-md flex flex-col items-center justify-center text-center p-3.5 sm:p-5 md:p-6 relative overflow-y-auto no-scrollbar shrink min-h-0"
                >
                  {/* Decorative corner stars */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-xs sm:text-base text-[#FACC15] select-none">⭐</div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xs sm:text-base text-[#FACC15] select-none">⭐</div>
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-xs sm:text-base text-[#FACC15] select-none">⭐</div>
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-xs sm:text-base text-[#FACC15] select-none">⭐</div>

                  {selectedItem ? (
                    <motion.div 
                      key={selectedItem.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col gap-2 sm:gap-3.5 items-center z-10 w-full min-h-0 shrink"
                    >
                      <span className="text-[10px] sm:text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-sm animate-pulse shrink-0">
                        Qual a letra inicial do desenho?
                      </span>
                      
                      {/* Interactive spelling blank style: e.g. _ B E L H A or A B E L H A representation */}
                      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#1E293B] uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 select-none">
                        <span className={cn(
                          "border-b-4 pb-0.5 transition-all text-center min-w-[28px] xs:min-w-[34px]",
                          feedback === 'CORRECT' 
                            ? "text-emerald-500 border-emerald-500 font-extrabold animate-bounce" 
                            : "text-rose-500 border-rose-500 animate-pulse font-extrabold"
                        )}>
                          {feedback === 'CORRECT' ? selectedItem.letter : '_'}
                        </span>
                        <span className="text-slate-700 tracking-wide">
                          {selectedItem.name.substring(1)}
                        </span>
                      </h2>
                      
                      <div className="flex flex-row gap-3 sm:gap-8 md:gap-10 items-center justify-center mt-1 sm:mt-2.5 w-full max-w-full min-h-0 shrink">
                        {/* Drawing Illustration Badge */}
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className={cn(
                            "w-14 h-14 xs:w-16 xs:h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 sm:border-4 border-[#1E293B] flex items-center justify-center shadow-md shrink-0 transition-transform [&>svg]:w-7 xs:[&>svg]:w-9 sm:[&>svg]:w-14 md:[&>svg]:w-16 [&>svg]:h-7 xs:[&>svg]:h-9 sm:[&>svg]:h-14 md:[&>svg]:h-16 text-slate-800", 
                            selectedItem.color
                          )}
                        >
                          {selectedItem.icon}
                        </motion.div>
                        
                        {/* Libras Hand Representation */}
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="w-[90px] h-[115px] xs:w-[105px] xs:h-[135px] sm:w-[135px] sm:h-[168px] md:w-[155px] md:h-[192px] bg-white border-2 border-dashed border-[#38BDF8] rounded-2xl flex flex-col items-center justify-center p-1.5 sm:p-2 shadow-inner relative overflow-hidden shrink-0 transition-transform"
                        >
                           <div className="relative w-full h-full min-h-0">
                              <LibrasImage 
                                key={selectedItem.letter}
                                letter={selectedItem.letter} 
                                alt={`Sinal Libras para ${selectedItem.letter}`}
                                className="object-contain"
                              />
                           </div>
                           <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest text-[#0284C7] mt-1.5 select-none shrink-0 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">Sinal: {selectedItem.letter}</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 sm:gap-4 shrink min-h-0">
                       <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-white border-2 border-dashed border-[#FACC15] rounded-full flex items-center justify-center shadow-md select-none shrink-0"
                      >
                        <Hand size={24} className="xs:size-8 sm:size-10 text-[#FACC15] rotate-12" />
                      </motion.div>
                      <p className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-[#1E293B] px-4 uppercase tracking-tighter select-none">Escolha um desenho!</p>
                    </div>
                  )}

                  {/* Feedback Background Overlay */}
                  <AnimatePresence>
                    {feedback !== 'NONE' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: feedback === 'CORRECT' ? 0.3 : 0.2 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "absolute inset-0 z-0 pointer-events-none",
                          feedback === 'CORRECT' ? "bg-[#22C55E]" : "bg-[#EF4444]"
                        )}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                  {message && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        "absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 text-xs sm:text-sm font-extrabold shadow-md z-30 text-center flex items-center gap-1.5 sm:gap-2 min-w-[240px] sm:min-w-[300px] justify-center select-none",
                        feedback === 'CORRECT' 
                          ? "bg-[#D1FAE5] text-[#059669] border-[#059669]" 
                          : "bg-[#FEE2E2] text-[#B91C1C] border-[#B91C1C]"
                      )}
                    >
                      {feedback === 'CORRECT' ? <Trophy size={14} className="shrink-0" /> : <Bug size={14} className="shrink-0" />}
                      <span className="truncate">{message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Letter Panel */}
            <div className="w-full bg-[#1E293B] border-t-2 border-[#FACC15] py-2 sm:py-3.5 px-3 sm:px-4 flex items-center shrink-0 shadow-[0px_-4px_20px_rgba(0,0,0,0.25)] select-none animate-fade-in-up">
              <div className="w-full max-w-4xl mx-auto flex flex-col gap-1.5 xs:gap-2">
                
                {/* Instruction Banner overlay for kids */}
                <div className="text-center text-[9px] xs:text-[10px] sm:text-xs font-black text-[#FACC15] uppercase tracking-wider animate-pulse select-none">
                  {selectedItem 
                    ? `👉 Toque na letra de "${selectedItem.name}":` 
                    : "👈 Toque em um desenho acima para começar!"
                  }
                </div>

                {/* Responsive Grid for keyboard buttons on Mobile */}
                <div className="grid grid-cols-5 gap-1.5 md:hidden">
                  {visibleLetters.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleLetterClick(letter)}
                      className={cn(
                        "w-full h-10 xs:h-11 rounded-xl flex items-center justify-center text-sm xs:text-base font-black transition-all select-none border-b-4 cursor-pointer",
                        selectedItem?.letter === letter && feedback === 'CORRECT'
                          ? "bg-emerald-500 border-b-emerald-700 text-white translate-y-[2px] border-b-0"
                          : (wrongLetter === letter 
                              ? "bg-rose-500 border-b-rose-700 text-white animate-shake" 
                              : "bg-[#FACC15] border-[#CA8A04] hover:bg-[#FDE047] text-[#1E293B] active:translate-y-[2px] active:border-b-2")
                      )}
                    >
                      {letter}
                    </button>
                  ))}
                </div>

                {/* Keyboard buttons on Desktop */}
                <div className="hidden md:flex md:justify-center md:gap-2 md:flex-wrap">
                  {visibleLetters.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleLetterClick(letter)}
                      className={cn(
                        "w-[38px] h-[48px] lg:w-[44px] lg:h-[55px] border-b-4 rounded-xl flex items-center justify-center text-base lg:text-lg font-black transition-all select-none cursor-pointer",
                        selectedItem?.letter === letter && feedback === 'CORRECT'
                          ? "bg-emerald-500 border-emerald-700 text-white translate-y-[2px] border-b-2"
                          : (wrongLetter === letter 
                              ? "bg-rose-500 border-rose-700 text-white animate-shake" 
                              : "bg-[#FACC15] border-[#CA8A04] hover:bg-[#FDE047] text-[#1E293B] active:translate-y-[2px] active:border-b-2")
                      )}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CELEBRATION VIEW */}
        {currentView === 'CELEBRATION' && (
          <motion.div 
            key="celebration"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center bg-[#F8FAFC] select-none"
          >
            <motion.div 
              animate={{ rotate: [0, 8, -8, 8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 drop-shadow-md"
            >
              🏆
            </motion.div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 sm:mb-2 text-[#1E293B]">Parabéns!</h2>
            <p className="text-sm sm:text-base font-bold mb-6 sm:mb-8 max-w-xs sm:max-w-md text-slate-600">Você completou o jogo. Você é muito inteligente!</p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md px-3">
              <button 
                onClick={restartGame}
                className="flex-1 py-2.5 sm:py-3.5 bg-[#FACC15] text-[#1E293B] rounded-xl text-sm sm:text-base font-black shadow-sm active:translate-y-0.5 transition-all cursor-pointer"
              >
                JOGAR DE NOVO
              </button>
              <button 
                onClick={() => setCurrentView('HOME')}
                className="flex-1 py-2.5 sm:py-3.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm sm:text-base font-black shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                SAIR
              </button>
            </div>
            
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
               {confetti.map((c) => (
                 <motion.div
                   key={c.id}
                   initial={{ y: -100, x: c.x, rotate: 0 }}
                   animate={{ y: 800, rotate: 360 }}
                   transition={{ duration: c.duration, repeat: Infinity, delay: c.delay }}
                   className="absolute text-xl sm:text-2xl"
                 >
                   {c.emoji}
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
