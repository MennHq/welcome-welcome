import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import Lenis from '@studio-freight/lenis';
import { Info, Mail } from 'lucide-react';
import CursorPreloader from './components/CursorPreloader';

const AmbientBackground = () => (
  <>
    <img
      src="https://i.postimg.cc/sfbNkMSs/image.png"
      alt="Background"
      className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
      draggable="false"
      referrerPolicy="no-referrer"
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
    
    {/* Bubbly Claymorphic Floating Elements */}
    <div className="absolute top-[12%] left-[4%] w-16 h-16 rounded-full bg-rose-200/30 backdrop-blur-[3px] border border-white/70 shadow-[inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-4px_-4px_8px_rgba(244,63,94,0.1),5px_10px_20px_rgba(244,63,94,0.08)] pointer-events-none animate-float-slow z-0" />
    <div className="absolute top-[55%] right-[6%] w-24 h-24 rounded-full bg-amber-200/25 backdrop-blur-[3px] border border-white/70 shadow-[inset_6px_6px_12px_rgba(255,255,255,0.8),inset_-6px_-6px_12px_rgba(217,119,6,0.1),8px_14px_28px_rgba(217,119,6,0.08)] pointer-events-none animate-float-fast z-0" />
    <div className="absolute bottom-[8%] left-[10%] w-20 h-20 rounded-full bg-emerald-200/25 backdrop-blur-[3px] border border-white/70 shadow-[inset_5px_5px_10px_rgba(255,255,255,0.8),inset_-5px_-5px_10px_rgba(16,185,129,0.1),7px_12px_24px_rgba(16,185,129,0.06)] pointer-events-none animate-float-slow z-0" style={{ animationDelay: '2s' }} />
    <div className="absolute top-[38%] right-[25%] w-12 h-12 rounded-full bg-sky-200/25 backdrop-blur-[3px] border border-white/70 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.8),inset_-3px_-3px_6px_rgba(59,130,246,0.1),4px_8px_16px_rgba(59,130,246,0.06)] pointer-events-none animate-float-fast z-0" style={{ animationDelay: '1.5s' }} />
  </>
);

const Welcome = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Automatically open the "email" after a brief delay
    const timer = setTimeout(() => setIsOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FAF9F6]">
      <AmbientBackground />
      
      <motion.div
        layout
        initial={{ borderRadius: 100, width: "320px", height: "64px" }}
        animate={isOpen ? { borderRadius: 40, width: "100%", maxWidth: "600px", height: "auto" } : {}}
        transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        className="clay-card-white overflow-hidden relative z-10 cursor-default mx-4"
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div 
              key="notification"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="flex items-center h-[64px] px-6 gap-4 text-stone-600 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 shadow-[inset_1.5px_1.5px_3px_rgba(255,255,255,0.85),inset_-1.5px_-1.5px_3px_rgba(244,63,94,0.1)] border border-white">
                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex-1 w-full overflow-hidden">
                 <p className="text-sm font-semibold truncate text-stone-800">New Email Received</p>
                 <p className="text-xs truncate text-stone-500">Your 15-Minute Cookbook is here!</p>
              </div>
            </motion.div>
          ) : (
             <motion.div 
               key="email-body"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3, duration: 0.6 }}
               className="p-8 md:p-12 w-full"
             >
               {/* Email Header */}
               <div className="border-b border-stone-100 pb-6 mb-6">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-rose-100 flex items-center justify-center text-rose-500 font-serif text-3xl italic rounded-full shadow-[inset_3px_3px_6px_rgba(255,255,255,0.85),inset_-3px_-3px_6px_rgba(244,63,94,0.15),4px_6px_12px_rgba(244,63,94,0.1)] border border-white shrink-0">
                     ♥
                   </div>
                   <div>
                     <p className="font-semibold text-stone-800 text-lg">Cookbook Delivery</p>
                     <p className="text-sm text-stone-500">to you</p>
                   </div>
                 </div>
                 <h2 className="text-3xl sm:text-4xl font-serif text-stone-800 mb-2 leading-tight">Thank you for your order! 🎉</h2>
               </div>
               
               {/* Email Content */}
               <div className="space-y-4 text-stone-600 font-light mb-10 leading-relaxed text-base sm:text-lg">
                 <p>Hi there,</p>
                 <p>Your payment was successful, and we are so excited to share these recipes with you and your family!</p>
                 <p>You can securely download your digital PDF of the <strong>15-Minute Cookbook for Busy Moms</strong> using the beautiful link below. Save it directly to your phone, tablet, or computer.</p>
                 <p>Happy cooking!</p>
               </div>

               {/* Download Button */}
               <div className="text-center">
                  <motion.a
                    href="https://dl.dropboxusercontent.com/scl/fi/zuoragfk0qhvgwdluvtra/15-Min-CookBook-For-Bussy-Moms.pdf?rlkey=vkwann8a81uxbviji2ye70fbf"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-full font-serif text-lg clay-button-black cursor-pointer"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                     Download E-Book PDF
                  </motion.a>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const Download = () => {
  return (
    <div 
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FAF9F6]"
    >
      <AmbientBackground />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="inline-block px-5 py-2 rounded-full bg-rose-100 text-rose-600 font-sans tracking-widest text-xs font-bold uppercase mb-6 shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,0.9),inset_-2.5px_-2.5px_5px_rgba(244,63,94,0.1),4px_6px_15px_rgba(244,63,94,0.05)] border border-white">
            Exclusive Resource
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
          transition={{ opacity: { duration: 1.5, ease: "easeOut" }, scale: { duration: 1.5, ease: "easeOut" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
          className="font-serif text-5xl md:text-7xl text-stone-800 tracking-tight leading-none mb-6"
        >
          <span className="italic block mb-2 text-rose-500">Download Library</span>
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
          className="group relative px-10 py-5 text-white rounded-full font-sans text-sm tracking-widest uppercase overflow-hidden inline-block cursor-pointer z-50 mb-8 clay-button-black"
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
      </div>
    </div>
  );
};

const EmbedGuard = ({ children }: { children: React.ReactNode }) => {
  const [isEmbedded, setIsEmbedded] = useState(true);

  useEffect(() => {
    try {
      // Prevent direct access outside of an iframe
      if (window.self === window.top) {
        setIsEmbedded(false);
      }
    } catch (e) {
      // Accessing top from cross-origin iframe throws an error, so it's embedded.
      setIsEmbedded(true);
    }
  }, []);

  if (!isEmbedded) {
    return <div className="h-screen w-full bg-[#FAF9F6]" />;
  }

  return <>{children}</>;
};

const CheckoutNotice = () => {
  return (
    <div className="mt-8 p-6 text-left clay-card-stone border-0">
      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <Info className="w-4 h-4 text-rose-500/80 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-stone-700 tracking-wider uppercase">Please Double-Check Your Email</h4>
            <p className="text-xs text-stone-550 mt-1 leading-relaxed">
              Your digital cookbook of quick family recipes will be sent instantly to the address entered above. Because this delivery is automated, the destination email address <span className="font-semibold text-stone-850">cannot be altered or changed</span> after checkout.
            </p>
          </div>
        </div>
        
        <div className="border-t border-stone-200/30 pt-4 flex gap-3 items-start">
          <Mail className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-stone-700 tracking-wider uppercase">Contact Support</h4>
            <p className="text-xs text-stone-550 mt-1 leading-relaxed">
              We are here to help. For any order support, inquiries, or helpful instructions, reach us anytime at{" "}
              <a 
                href="mailto:15mincookbook@gmail.com" 
                className="text-stone-850 font-semibold hover:text-rose-500 underline transition-colors focus:outline-none"
                id="support-direct-email-link"
              >
                15mincookbook@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          />
          
          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative z-10 w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col clay-card-white border-0"
            id="privacy-policy-modal"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div>
                <h3 className="text-xl font-serif text-stone-850">Privacy Policy</h3>
                <p className="text-xs text-stone-400 mt-0.5">Last Updated: June 2026</p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 transition-all focus:outline-none clay-button-light"
                id="close-privacy-dialog-btn"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Scrollable content body */}
            <div 
              className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs md:text-sm text-stone-600 font-light leading-relaxed no-scrollbar"
              data-lenis-prevent
            >
              <section className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest">1. Our Commitment</h4>
                <p>
                  At 15-Minute Cookbook, we respect your privacy. This policy describes how we collect, use, and safeguard personal information you provide when using our purchase site.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest">2. Information Collection</h4>
                <p>
                  We collect only the essential credentials required to deliver the cookbook:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Email Address:</strong> Necessary to email your digital PDF link and provide support services.</li>
                  <li><strong>Payment Transactions:</strong> Processed entirely through <strong>Whop</strong>. We never store or track your billing data, credit card numbers, or secure transaction keys on our own servers.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest">3. Information Usage</h4>
                <p>
                  We use your email address exclusively to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Grant instantaneous download permissions for the e-book.</li>
                  <li>Respond to manual support email inquiries regarding your receipt or PDF download issues.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest">4. Security</h4>
                <p>
                  We are committed to preventing unauthorized access or data leaks. Your personal data is never sold, traded, or shared with third-party marketing brokers.
                </p>
              </section>

              <section className="space-y-2 pt-4 border-t border-stone-100">
                <p>
                  If you have concerns about your privacy details, email us at{" "}
                  <a href="mailto:15mincookbook@gmail.com" className="text-rose-500 font-semibold hover:underline">
                    15mincookbook@gmail.com
                  </a>.
                </p>
              </section>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-stone-100 bg-stone-50/50 text-right">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 text-white font-medium text-xs rounded-full transition-all focus:outline-none cursor-pointer clay-button-black"
                id="close-modal-footer-btn"
              >
                Close Window
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CheckoutFlow = () => {
  const [email, setEmail] = useState("");
  const [showEmbed, setShowEmbed] = useState(false);
  const embedRef = React.useRef<any>(null);

  const handlePaymentComplete = async () => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
    } catch (err) {
      console.error(err);
    }
    // Payment complete. Whop will also try to hit our backend webhook.
    // We just redirect the user to the welcome page immediately.
    window.location.href = '/welcome';
  };

  if (!showEmbed) {
    return (
      <div className="text-center w-full">
        <h3 className="text-xl sm:text-2xl font-serif text-stone-850 mb-3">Where should we send your cookbook?</h3>
        <p className="text-stone-500 mb-6 text-sm">Please enter the email address where you'd like to receive your PDF.</p>
        <form autoComplete="on" onSubmit={(e) => { e.preventDefault(); if (email) setShowEmbed(true); }} className="space-y-4 max-w-sm mx-auto">
          <input 
            id="email"
            name="email"
            autoComplete="email"
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com" 
            className="w-full px-5 py-4 rounded-full outline-none transition-all font-sans text-stone-700 clay-input text-center text-lg"
          />
          <button type="submit" className="w-full py-4 text-white rounded-full font-sans font-medium tracking-wide cursor-pointer clay-button-black text-lg">
            Continue to Checkout
          </button>
        </form>
        <CheckoutNotice />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col">
      <div className="-mx-6 -mt-6 sm:-mx-10 sm:-mt-10">
        <WhopCheckoutEmbed 
          ref={embedRef}
          planId="plan_kEagaVwO2m3yz" 
          theme="light"
          prefill={{ email: email }}
          onComplete={handlePaymentComplete}
        />
      </div>
      <div className="mt-4">
        <CheckoutNotice />
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-stone-800 font-sans selection:bg-rose-200 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 px-6 overflow-hidden">
        <AmbientBackground />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-100 text-rose-600 font-sans text-xs font-bold uppercase mb-6 shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,0.9),inset_-2.5px_-2.5px_5px_rgba(244,63,94,0.1),4px_6px_15px_rgba(244,63,94,0.05)] border border-white"
            >
              <span className="flex h-2 w-2 rounded-full bg-rose-500"></span>
              <span className="text-xs font-bold tracking-widest uppercase text-rose-600">The #1 Time-Saving Cookbook</span>
            </motion.div>

            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.1 }}
               className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight mb-6 leading-[1.1] text-stone-900"
            >
              Ditch the 5 PM <br className="hidden md:block"/>
              <span className="italic text-rose-500">dinner panic.</span>
            </motion.h1>

            <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-base sm:text-xl text-stone-600 font-light max-w-md mb-8 leading-relaxed"
            >
              Transform chaotic evenings into peaceful family time with 50+ delicious, kid-approved recipes ready in exactly 15 minutes.
            </motion.p>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#checkout"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#checkout')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative px-8 py-4 text-white rounded-full font-serif text-base sm:text-lg text-center clay-button-black hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Get the E-Book Now — $13.99
              </a>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative mt-4 md:mt-0"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-amber-100 rounded-[2.5rem] rotate-3 scale-105 opacity-50 blur-xl" />
            <img 
              src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070&auto=format&fit=crop" 
              alt="Happy family cooking together" 
              className="relative z-10 rounded-[2.5rem] w-full h-[280px] sm:h-[400px] md:h-[500px] object-cover shadow-2xl border-[6px] border-white"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute -bottom-4 left-2 sm:-bottom-6 sm:-left-6 bg-white p-4 rounded-[2rem] z-20 flex items-center gap-3 sm:gap-4 animate-bounce shadow-[inset_4px_4px_8px_rgba(255,255,255,0.9),inset_-4px_-4px_8px_rgba(120,110,100,0.06),10px_15px_30px_rgba(120,110,100,0.12)] border border-white/85" style={{ animationDuration: '3s' }}>
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-[inset_2px_2px_5px_rgba(255,255,255,0.85),inset_-2px_-2px_5px_rgba(244,63,94,0.15)] border border-white shrink-0">
                ⏱️
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-stone-850">15 Minutes</p>
                <p className="text-[10px] sm:text-xs text-stone-500 font-medium">Start to Finish</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-850 mb-4 leading-tight">Because motherhood is busy enough.</h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-base sm:text-lg">We stripped away the fluff. No long stories, no obscure ingredients. Just quick, healthy meals your kids will actually eat.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🛒", title: "Normal Ingredients", desc: "Everything can be found at your local grocery store. No specialty stores required." },
              { icon: "👧", title: "Picky-Eater Approved", desc: "Tested on the toughest critics. Hidden veggies and familiar flavors." },
              { icon: "🍳", title: "One-Pan Wonders", desc: "Because 15 minutes of cooking shouldn't mean 45 minutes of cleaning." }
            ].map((feature, i) => {
              const cardColors = ["clay-card-rose", "clay-card-amber", "clay-card-emerald"];
              const iconBackgrounds = [
                "bg-rose-100 shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,0.9),inset_-2.5px_-2.5px_5px_rgba(244,63,94,0.12)] border-rose-200",
                "bg-amber-100 shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,0.9),inset_-2.5px_-2.5px_5px_rgba(217,119,6,0.12)] border-amber-200",
                "bg-emerald-100 shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,0.9),inset_-2.5px_-2.5px_5px_rgba(16,185,129,0.12)] border-emerald-200"
              ];
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`p-6 sm:p-8 rounded-[2rem] hover:-translate-y-1 transform-gpu transition-all duration-300 border-0 ${cardColors[i]}`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-6 border ${iconBackgrounds[i]}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-stone-850 mb-2">{feature.title}</h3>
                  <p className="text-stone-600 font-light leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sneak Peek Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="order-2 md:order-1 relative mt-6 md:mt-0"
             >
                <img 
                  src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1974&auto=format&fit=crop" referrerPolicy="no-referrer" 
                  alt="Delicious quick meal" 
                  className="rounded-[2.5rem] shadow-2xl w-full h-[320px] sm:h-[450px] md:h-[600px] object-cover border-[6px] border-white"
                />
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 sm:p-8 text-center max-w-[240px] sm:max-w-xs w-full clay-card-white border-0 shadow-[inset_4px_4px_8px_rgba(255,255,255,0.95),inset_-4px_-4px_8px_rgba(120,110,100,0.08),10px_15px_30px_rgba(0,0,0,0.15)]"
                >
                  <h4 className="font-serif text-lg sm:text-2xl mb-1 sm:mb-2 text-stone-850">Creamy Tuscan Chicken</h4>
                  <div className="flex justify-center gap-2 text-xs sm:text-sm text-stone-500 mb-3 sm:mb-4">
                     <span>Prep: 5m</span> • <span>Cook: 10m</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 font-light italic">"My kids asked for seconds!"</p>
                </motion.div>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, x: 40 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="order-1 md:order-2"
             >
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-850 mb-4 sm:mb-6 leading-tight">
                 Beautifully formatted <br className="hidden sm:block"/> for your kitchen.
               </h2>
               <p className="text-lg text-stone-600 mb-8 font-light leading-relaxed">
                 Open it on your phone, tablet, or print it out. Every recipe features a gorgeous full-color photo, straightforward steps, and exact timings to keep you on track.
               </p>
               
               <ul className="space-y-4 mb-10">
                 {[
                   "50+ Family-tested recipes",
                   "Weekly meal planning templates",
                   "Printable grocery lists categorized by aisle",
                   "Tips for substituting common allergies"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-stone-750 font-medium">
                     <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 font-bold flex items-center justify-center text-xs shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(244,63,94,0.1)] border border-white shrink-0">✓</span>
                     {item}
                   </li>
                 ))}
               </ul>

               <a
                href="#checkout"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#checkout')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block px-8 py-4 text-white rounded-full font-serif text-lg clay-button-black cursor-pointer"
               >
                 I Need This Right Now
               </a>
             </motion.div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-850 mb-4 leading-tight">Inside the Cookbook</h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              A beautifully designed 59-page digital guide featuring over 40 distinct recipes, 
              carefully categorized to match your daily routine. Enjoy both vegetarian and non-vegetarian options!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Energy-Packed Breakfasts",
                desc: "Start the day right manually with high-energy meals like Banana Peanut Butter Toast, Sunrise Bagel Bites, and Sailor's Pancake Roll-ups.",
                icon: "🌅"
              },
              {
                title: "Quick & Easy Lunches",
                desc: "Keep the momentum going with filling lunches like Treasure Chest Pasta Bake, Hummus & Veggie Wraps, and Sailboat Salmon Cakes.",
                icon: "🥗"
              },
              {
                title: "Stress-Free Dinners",
                desc: "End the day without the panic. Enjoy 15-minute dinners like Honey Garlic Chicken Tenders, Quick Paneer & Veggie Stir-Fry, and Mac & Cheese.",
                icon: "🍲"
              },
              {
                title: "Smoothies & Snacks",
                desc: "Perfect mini-meals for growing kids. Discover fun snacks like Crunchy Apple Donuts, Fun Fruity Cereal Skewers, and Teddy Bear Rice Cakes.",
                icon: "🍎"
              }
            ].map((section, i) => {
              const cardColors = ["clay-card-amber", "clay-card-emerald", "clay-card-rose", "clay-card-blue"];
              const textColors = [
                "text-amber-950",
                "text-emerald-950",
                "text-rose-950",
                "text-blue-950"
              ];
              const descColors = [
                "text-amber-900/80",
                "text-emerald-900/80",
                "text-rose-900/80",
                "text-blue-900/80"
              ];
              const iconBgs = [
                "bg-white/80 shadow-[inset_1.5px_1.5px_3px_rgba(255,255,255,1),inset_-1.5px_-1.5px_3px_rgba(217,119,6,0.15),1px_2px_4px_rgba(217,119,6,0.06)] border-white/90",
                "bg-white/80 shadow-[inset_1.5px_1.5px_3px_rgba(255,255,255,1),inset_-1.5px_-1.5px_3px_rgba(16,185,129,0.15),1px_2px_4px_rgba(16,185,129,0.06)] border-white/90",
                "bg-white/80 shadow-[inset_1.5px_1.5px_3px_rgba(255,255,255,1),inset_-1.5px_-1.5px_3px_rgba(244,63,94,0.15),1px_2px_4px_rgba(244,63,94,0.06)] border-white/90",
                "bg-white/80 shadow-[inset_1.5px_1.5px_3px_rgba(255,255,255,1),inset_-1.5px_-1.5px_3px_rgba(59,130,246,0.15),1px_2px_4px_rgba(59,130,246,0.06)] border-white/90"
              ];
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`p-8 sm:p-10 rounded-[3rem] border-0 transition-all duration-300 hover:-translate-y-2 ${cardColors[i]}`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-6 border ${iconBgs[i]}`}>{section.icon}</div>
                  <h3 className={`text-xl font-serif font-bold ${textColors[i]} mb-3`}>{section.title}</h3>
                  <p className={`font-sans font-light leading-relaxed text-sm ${descColors[i]}`}>{section.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-4 text-sm font-medium text-stone-600"
          >
            {[
              "✓ 59 Total Pages",
              "✓ Veg & Non-Veg Options",
              "✓ Bonus Kid-Special Meals",
              "✓ Step-by-Step Instructions"
            ].map((badge, idx) => (
              <span key={idx} className="px-5 py-2.5 bg-white text-stone-700 rounded-full shadow-[inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(120,110,100,0.05),2px_4px_10px_rgba(0,0,0,0.03)] border border-white">
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-rose-50/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-12">Loved by thousands of busy moms</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-10 clay-card-white border-0 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex gap-1 text-amber-500 font-bold mb-4">★★★★★</div>
              <p className="text-stone-700 italic mb-4">"This cookbook literally saved my sanity. I used to dread 5 PM and order takeout multiple times a week. Now, I have dinner on the table before my kids even finish their homework."</p>
              <p className="text-sm font-bold text-stone-900">— Sarah M., Mom of 3</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 sm:p-10 clay-card-white border-0 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex gap-1 text-amber-500 font-bold mb-4">★★★★★</div>
              <p className="text-stone-700 italic mb-4">"I love how normal the ingredients are. No weird spices to buy. Just simple, hearty food that my picky 4-year-old actually eats without crying."</p>
              <p className="text-sm font-bold text-stone-900">— Jessica T., Working Mom</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section id="checkout" className="py-16 md:py-24 px-4 sm:px-6 text-center bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-stone-850 mb-4 sm:mb-6 leading-tight">Ready to reclaim your evenings?</h2>
          <p className="text-base sm:text-xl text-stone-500 mb-8 sm:mb-10 font-light px-2">Instant access to the digital PDF. Pay securely via Whop.</p>
          
          <div className="overflow-hidden text-left mx-auto max-w-2xl p-6 sm:p-10 clay-card-white border-0 shadow-[inset_6px_6px_12px_rgba(255,255,255,0.95),inset_-6px_-6px_12px_rgba(120,110,100,0.06),15px_25px_50px_rgba(0,0,0,0.12)]">
            <CheckoutFlow />
          </div>
          <p className="mt-8 text-xs text-stone-400 max-w-md mx-auto leading-relaxed px-4">Secure checkout powered by Whop. By placing this order, you agree to the Terms of Service.</p>
        </div>
      </section>
      
      {/* Privacy Policy Dialog */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* Footer */}
      <footer className="py-12 bg-stone-100/40 border-t border-stone-250/20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-stone-500">
          <div>
            <p>© {new Date().getFullYear()} 15-Minute Cookbook. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button 
              onClick={() => setShowPrivacy(true)}
              className="hover:text-stone-850 hover:underline transition-all cursor-pointer text-xs focus:outline-none"
              id="privacy-policy-link"
            >
              Privacy Policy
            </button>
            <span className="text-stone-300 hidden md:inline">|</span>
            <span className="flex items-center gap-2 text-xs text-stone-500 font-light">
              <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Support: </span>
              <a 
                href="mailto:15mincookbook@gmail.com"
                className="hover:text-stone-850 font-medium underline transition-all focus:outline-none"
                id="footer-support-link"
              >
                15mincookbook@gmail.com
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const LogsViewer = () => {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearLogs = async () => {
    try {
      await fetch('/api/logs', { method: 'DELETE' });
      setLogs([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 font-mono text-xs bg-stone-900 text-green-400 min-h-screen whitespace-pre-wrap overflow-auto select-text">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-white">Webhook Logs</h1>
        <button onClick={clearLogs} className="bg-red-600 text-white px-4 py-2 rounded font-sans cursor-pointer hover:bg-red-500 transition-colors">Clear Logs</button>
      </div>
      {logs.length === 0 ? "No logs yet. Trigger a webhook!" : JSON.stringify(logs, null, 2)}
    </div>
  );
};

export default function App() {
  const [cursorsLoaded, setCursorsLoaded] = useState(false);

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  const isLogs = path.includes('/logs');
  const isDownload = path.includes('/download') || hash.includes('download') || search.includes('download');
  const isWelcome = path.includes('/welcome') || hash.includes('welcome') || search.includes('welcome');

  return (
    <>
      <AnimatePresence mode="wait">
        {!cursorsLoaded && !isLogs ? (
          <CursorPreloader key="preloader" onComplete={() => setCursorsLoaded(true)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isLogs ? (
              <LogsViewer />
            ) : isDownload ? (
              <EmbedGuard>
                <Download />
              </EmbedGuard>
            ) : isWelcome ? (
              <EmbedGuard>
                <Welcome />
              </EmbedGuard>
            ) : (
              <LandingPage />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
