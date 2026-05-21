import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const AmbientBackground = () => (
  <>
    <img
      src="https://i.postimg.cc/sfbNkMSs/image.png"
      alt="Background"
      className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
      draggable="false"
    />
    <div className="absolute inset-0 bg-[#FAF9F6]/70 z-0 pointer-events-none select-none" />
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
        rotate: [0, 90, 0]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -top-1/4 -right-1/4 w-[80vw] h-[80vw] bg-rose-100/50 rounded-full blur-[120px] pointer-events-none"
    />
    <motion.div
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.2, 0.5, 0.2],
        rotate: [0, -90, 0]
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
      className="absolute -bottom-1/4 -left-1/4 w-[80vw] h-[80vw] bg-amber-50/60 rounded-full blur-[120px] pointer-events-none"
    />
  </>
);

const Welcome = () => {
  return (
    <div 
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FAF9F6] select-none"
    >
      <AmbientBackground />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-rose-400 font-sans tracking-[0.25em] text-xs md:text-sm uppercase mb-4">
            Thank you so much
          </h2>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
          transition={{ opacity: { duration: 1.5, ease: "easeOut" }, scale: { duration: 1.5, ease: "easeOut" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
          className="font-serif text-7xl md:text-9xl text-stone-800 tracking-tight leading-none mb-6"
        >
          <span className="italic block mb-2">Welcome</span>
        </motion.h1>

        <motion.div
           animate={{ y: [0, -5, 0] }}
           transition={{ duration: 6, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-stone-500 text-lg md:text-2xl font-sans font-light max-w-lg mb-10">
            to the <span className="font-normal text-stone-700">15-Minute Cookbook</span><br/>
            for <span className="italic">Busy Moms.</span>
          </p>
        </motion.div>

        <motion.a
          href="https://whop.com/joined/15-min-cookbook-for-bussy-moms/cook-book-here-U2Yb2k1xWmHJR0/app/"
          target="_top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-4 bg-stone-800 text-white rounded-full font-sans text-sm tracking-widest uppercase overflow-hidden inline-block cursor-pointer z-50"
        >
          <motion.div 
            animate={{ x: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
          />
          <span className="relative z-10 transition-colors group-hover:text-amber-50">
            Open Cookbook
          </span>
        </motion.a>
      </div>
    </div>
  );
};

const Download = () => {
  return (
    <div 
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FAF9F6] select-none"
    >
      <AmbientBackground />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-rose-400 font-sans tracking-[0.25em] text-xs md:text-sm uppercase mb-4">
            Exclusive Resource
          </h2>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
          transition={{ opacity: { duration: 1.5, ease: "easeOut" }, scale: { duration: 1.5, ease: "easeOut" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
          className="font-serif text-5xl md:text-7xl text-stone-800 tracking-tight leading-none mb-6"
        >
          <span className="italic block mb-2">Download Library</span>
        </motion.h1>

        <motion.div
           animate={{ y: [0, -5, 0] }}
           transition={{ duration: 6, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-stone-500 text-lg md:text-2xl font-sans font-light max-w-lg mb-10">
            Get your copy of the <br />
            <span className="font-normal text-stone-700">15-Minute Cookbook</span> <span className="italic">PDF</span>.
          </p>
        </motion.div>

        <motion.a
          href="https://dl.dropboxusercontent.com/scl/fi/zuoragfk0qhvgwdluvtra/15-Min-CookBook-For-Bussy-Moms.pdf?rlkey=vkwann8a81uxbviji2ye70fbf"
          download
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-4 bg-stone-800 text-white rounded-full font-sans text-sm tracking-widest uppercase overflow-hidden inline-block cursor-pointer z-50 mb-8"
        >
          <motion.div 
            animate={{ x: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
          />
          <span className="relative z-10 transition-colors group-hover:text-amber-50">
            Download E-Book
          </span>
        </motion.a>
        
        <Link to="/" className="text-stone-500 hover:text-stone-800 transition-colors duration-300 font-sans tracking-wide text-sm relative z-50">
          Return to welcome
        </Link>
      </div>
    </div>
  );
};

// Global Protection and Key Disable
const ProtectionGuard = ({ children }: { children: React.ReactNode }) => {
  const [isEmbedded, setIsEmbedded] = useState(true);

  useEffect(() => {
    // Prevent direct access outside of an iframe
    if (window === window.top) {
      setIsEmbedded(false);
    }
  }, []);

  useEffect(() => {
    // Disable ALL key combinations everywhere
    const blockKeys = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    // Disable right click / context menu
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    window.addEventListener('keydown', blockKeys, { capture: true, passive: false });
    window.addEventListener('keyup', blockKeys, { capture: true, passive: false });
    window.addEventListener('keypress', blockKeys, { capture: true, passive: false });
    window.addEventListener('contextmenu', blockContextMenu, { capture: true, passive: false });

    return () => {
      window.removeEventListener('keydown', blockKeys, { capture: true });
      window.removeEventListener('keyup', blockKeys, { capture: true });
      window.removeEventListener('keypress', blockKeys, { capture: true });
      window.removeEventListener('contextmenu', blockContextMenu, { capture: true });
    };
  }, []);

  if (!isEmbedded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FAF9F6] text-stone-800 font-sans select-none">
        <div className="max-w-md text-center px-4">
          <h2 className="text-2xl font-serif mb-4">Protected Component</h2>
          <p className="text-stone-500 text-sm">
            This module is securely connected to your Whop membership. 
            It can only be viewed inside the platform dashboard embed.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ProtectionGuard>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/download" element={<Download />} />
        </Routes>
      </BrowserRouter>
    </ProtectionGuard>
  );
}
