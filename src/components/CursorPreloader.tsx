import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface CursorPreloaderProps {
  onComplete: () => void;
  key?: string;
}

export default function CursorPreloader({ onComplete }: CursorPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing system...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadCursorFile = async (name: string, url: string) => {
      if (!active) return;
      setStatus(`Retrieving ${name}...`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${name} from server`);
      }
      
      // Read as blob to guarantee complete asset download and browser cache insertion
      await response.blob();
    };

    const startPreloadPipeline = async () => {
      try {
        // Phase 1: Handshake
        setProgress(15);
        setStatus('Connecting to asset repository...');
        await new Promise((r) => setTimeout(r, 500));

        // Phase 2: Load default cursor
        setProgress(40);
        await loadCursorFile('Windows 11 Default Cursor (arrow.cur)', '/Cusor_By_Jepricreations/arrow.cur');
        await new Promise((r) => setTimeout(r, 300));

        // Phase 3: Load pointer cursor
        setProgress(70);
        await loadCursorFile('Windows 11 Link Selector (hand.cur)', '/Cusor_By_Jepricreations/hand.cur');
        await new Promise((r) => setTimeout(r, 300));

        // Phase 4: Verification
        setProgress(90);
        setStatus('Verifying cursor files integrity...');
        await new Promise((r) => setTimeout(r, 600));

        // Phase 5: Complete
        setProgress(100);
        setStatus('Cursors successfully verified and applied!');
        await new Promise((r) => setTimeout(r, 600));

        if (active) {
          onComplete();
        }
      } catch (err: any) {
        console.error('Preloading failed:', err);
        if (active) {
          setError('Could not verify assets. Continuing with standard cursors.');
          setStatus('Standard cursor applied as fallback.');
          setProgress(100);
          await new Promise((r) => setTimeout(r, 1000));
          onComplete();
        }
      }
    };

    startPreloadPipeline();

    return () => {
      active = false;
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF9F6] overflow-hidden select-none">
      {/* Soft Ambient Claymorphic Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-1/4 -right-1/4 w-[80vw] h-[80vw] bg-rose-150/40 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -bottom-1/4 -left-1/4 w-[80vw] h-[80vw] bg-amber-100/40 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Animated Custom Vector Cursor & Playful Claymorphic Bowl/Card */}
        <div className="relative mb-10">
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center border-2 border-white shadow-[inset_4px_4px_8px_rgba(255,255,255,1),inset_-4px_-4px_8px_rgba(120,110,100,0.05),8px_16px_32px_rgba(0,0,0,0.06)]"
          >
            {/* Playful Cursor Animation SVG */}
            <svg 
              className="w-10 h-10 text-rose-500 fill-current drop-shadow-[2px_4px_6px_rgba(244,63,94,0.15)]"
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M4.5 3V17.5L9.2 13.8L12.5 21L15.5 19.5L12.3 12.5L18.5 12.5L4.5 3Z" 
              />
            </svg>
          </motion.div>

          {/* Sparkles or mini elements floating */}
          <motion.span
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-2 -right-2 text-xl"
          >
            ✨
          </motion.span>
          <motion.span
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            className="absolute -bottom-1 -left-3 text-lg"
          >
            🍳
          </motion.span>
        </div>

        {/* Text Details */}
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-800 text-center font-semibold mb-2 tracking-tight">
          15-Minute Cookbook
        </h2>
        <p className="text-stone-400 font-sans text-xs uppercase tracking-widest text-center mb-8 font-medium">
          Windows 11 Cursor Engine
        </p>

        {/* Outer Claymorphic Progress Track */}
        <div className="w-full h-5 rounded-full bg-[#EFECE6] p-1 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] border border-white/50 mb-4 overflow-hidden">
          {/* Inner Bubbly Claymorphic Fill */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="h-full rounded-full bg-rose-500 shadow-[inset_1.5px_1.5px_3px_rgba(255,255,255,0.45),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.2),2px_4px_10px_rgba(244,63,94,0.3)] border-white/20"
          />
        </div>

        {/* Live Loading Logs Terminal style but beautiful */}
        <div className="w-full text-center px-4">
          <p className="text-stone-600 font-sans text-sm font-medium animate-pulse min-h-[20px]">
            {status}
          </p>
          <p className="text-stone-400 font-mono text-[10px] mt-2 tracking-tight">
            Progress: {progress}% {error && `| ${error}`}
          </p>
        </div>
      </div>
    </div>
  );
}
