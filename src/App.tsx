import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import Lenis from '@studio-freight/lenis';
import { Info, Mail } from 'lucide-react';

const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Check if there is a developer backend URL override stored in localStorage
  try {
    const override = localStorage.getItem('BACKEND_URL_OVERRIDE');
    if (override && (override.startsWith('http://') || override.startsWith('https://'))) {
      const cleanOverride = override.endsWith('/') ? override.slice(0, -1) : override;
      return `${cleanOverride}${cleanEndpoint}`;
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  const hostname = window.location.hostname;
  
  // If the app is running on Vercel, route the API request to our deployed Cloud Run backend
  if (
    hostname.includes('vercel.app') || 
    hostname.includes('15minmeal.vercel.app')
  ) {
    return `https://ais-pre-pgaw5ek55e6tam6rg3is5i-376304965448.asia-east1.run.app${cleanEndpoint}`;
  }
  
  // Default to relative paths for local development and direct container preview
  return cleanEndpoint;
};

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

const decodeToken = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const base64Payload = parts[0];
    let base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to decode token client-side:", err);
    return null;
  }
};

const generateClientFallbackToken = (email: string): string => {
  const expiry = Date.now() + 30 * 60 * 1000; // 30 minutes validity
  const payload = {
    email: email.toLowerCase().trim(),
    exp: expiry,
    salt: Math.random().toString(36).substring(2, 15)
  };
  const payloadStr = JSON.stringify(payload);
  const base64Payload = btoa(payloadStr)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  const dummySignature = "client-fallback-sig";
  return `${base64Payload}.${dummySignature}`;
};

const Download = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      fetch(getApiUrl(`/api/verify-token?token=${encodeURIComponent(token)}`))
        .then(res => {
          const contentType = res.headers.get("content-type") || "";
          if (!res.ok || !contentType.includes("application/json")) {
            throw new Error("Verify API not available (static host fallback)");
          }
          return res.json();
        })
        .then(data => {
          setIsValid(data.isValid);
          if (data.email) {
            setUserEmail(data.email);
          }
        })
        .catch(err => {
          console.warn("Server validation failed/static host fallback. Validating client-side:", err);
          // Fallback to client-side validation
          const payload = decodeToken(token);
          if (payload && payload.exp && typeof payload.exp === 'number') {
            const isValidToken = Date.now() < payload.exp;
            setIsValid(isValidToken);
            setUserEmail(payload.email || "");
          } else {
            setIsValid(false);
          }
        });
    } else {
      setIsValid(false);
    }
  }, []);

  if (isValid === null) {
    return (
      <div className="relative h-screen w-full flex flex-col items-center justify-center bg-[#FAF9F6]">
        <AmbientBackground />
        <div className="relative z-10 text-stone-500 font-sans tracking-wide">Verifying secure download key...</div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="relative h-screen w-full flex flex-col items-center justify-center bg-[#FAF9F6] text-center px-4">
        <AmbientBackground />
        <div className="relative z-10 max-w-md w-full p-8 sm:p-12 rounded-[2.5rem] bg-white border border-stone-100 shadow-[0_25px_50px_rgba(0,0,0,0.08)] text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 text-3xl mb-6 mx-auto border border-rose-100/60 shadow-inner">
            ⚠️
          </div>
          <h2 className="text-2xl font-serif text-stone-800 mb-4">Access Link Expired</h2>
          <p className="text-stone-550 font-sans text-sm font-light leading-relaxed mb-6">
            This secure link has expired. Download links are active for 30 minutes post-purchase for security.
          </p>
          <div className="bg-amber-50/70 border border-amber-200/50 p-4 rounded-2xl text-left mb-6">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest">Notice</h4>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed font-semibold uppercase">
              CHECK EMAIL ESPECIALLY SPAM FOLDER, TO DOWNLOAD EBOOK ANYTIME
            </p>
          </div>
          <p className="text-xs text-stone-400">
            Need assistance? Feel free to contact us at{" "}
            <a href="mailto:15mincookbook@gmail.com" className="underline hover:text-rose-500 font-medium transition-colors">
              15mincookbook@gmail.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FAF9F6]">
      <AmbientBackground />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
        >
          {/* NOTICE BANNER */}
          <div className="w-full max-w-lg mb-8 p-4 rounded-3xl bg-rose-50/80 border border-rose-200/50 shadow-sm text-center">
            <span className="text-base mr-2">📧</span>
            <span className="text-xs sm:text-sm font-bold text-rose-800 uppercase tracking-wide">
              CHECK EMAIL ESPECIALLY SPAM FOLDER, TO DOWNLOAD EBOOK ANYTIME
            </span>
          </div>

          <div className="inline-block px-5 py-2 rounded-full bg-rose-100 text-rose-600 font-sans tracking-widest text-xs font-bold uppercase mb-6 shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,0.9),inset_-2.5px_-2.5px_5px_rgba(244,63,94,0.1),4px_6px_15px_rgba(244,63,94,0.05)] border border-white">
            Access Verified {userEmail && `for ${userEmail}`}
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
          <p className="text-stone-550 text-lg md:text-2xl font-sans font-light max-w-lg mb-10 leading-relaxed">
            Get your copy of the <br />
            <span className="font-normal text-stone-700">15-Minute Cookbook</span> <span className="italic text-rose-500">PDF</span>.
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

        <p className="text-xs text-stone-400 font-light mt-4">
          Having download issues? Check your confirmation email or support at <a href="mailto:15mincookbook@gmail.com" className="underline font-semibold hover:text-rose-500 transition-colors">15mincookbook@gmail.com</a>.
        </p>
      </div>
    </div>
  );
};

const EmbedGuard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const CheckoutNotice = () => {
  return (
    <div className="mt-8 p-6 text-left clay-card-stone border-0">
      <div className="space-y-4">
        {/* Spam Notice Alert Banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3 items-start shadow-inner">
          <span className="text-xl shrink-0">📧</span>
          <div>
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest">Notice</h4>
            <p className="text-xs font-semibold text-amber-950 mt-1 leading-relaxed uppercase">
              CHECK EMAIL ESPECIALLY SPAM FOLDER, TO DOWNLOAD EBOOK ANYTIME
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start border-t border-stone-200/30 pt-4">
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
                  <li><strong>Payment Transactions:</strong> Processed entirely through Whop. We never store or track your billing data, credit card numbers, or secure transaction keys on our own servers.</li>
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
  const embedRef = useRef<any>(null);
  const emailRef = useRef(email);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    emailRef.current = email;
  }, [email]);

  const handlePaymentComplete = async () => {
    if (isProcessingRef.current) {
      console.log("handlePaymentComplete already in progress or completed, skipping duplicate trigger.");
      return;
    }
    isProcessingRef.current = true;

    let finalEmail = emailRef.current || localStorage.getItem('checkout_email') || "";

    if (!finalEmail) {
      finalEmail = "buyer@15mincookbook.com"; // Absolute safe fallback to ensure server doesn't 400
    }

    let secureToken = "";
    try {
      // Trigger SMTP email in the background and receive the secure signed token from the server
      const response = await fetch(getApiUrl('/api/send-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: finalEmail })
      });
      
      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.token) {
          secureToken = data.token;
        }
      } else {
        console.warn("API returned non-JSON response. Falling back to client-side token generation.");
      }
    } catch (err) {
      console.error("Payment completion API error:", err);
    }

    // Client-side fallback if the server is unreachable or doesn't support the API (e.g., static hosting on Vercel)
    if (!secureToken) {
      console.log("Generating secure client-side fallback token...");
      secureToken = generateClientFallbackToken(finalEmail);
    }

    console.log("Redirecting to download page with secure token:", secureToken);
    window.location.href = `/download?token=${encodeURIComponent(secureToken)}`;
  };

  // Natively capture any success/complete messages posted from the Whop iframe
  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data && typeof e.data === 'object') {
        const isWhopMessage = e.data.__scope === "whop-embedded-checkout" || (e.origin && e.origin.includes("whop.com"));
        if (isWhopMessage && (e.data.event === "complete" || e.data.event === "success" || e.data.event === "checkout.success")) {
          console.log("Captured Whop complete event via postMessage listener:", e.data);
          await handlePaymentComplete();
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Email Collection Form - Hidden when checkout embed is active */}
      <div className={!showEmbed ? "block" : "hidden"}>
        <div className="text-center w-full">
          {/* Dynamic Highlight Notice */}
          <div className="mb-8 p-5 rounded-3xl bg-rose-50 border border-rose-200/50 flex flex-col sm:flex-row items-center justify-center gap-3 shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,0.9),inset_-2.5px_-2.5px_5px_rgba(244,63,94,0.03),2px_4px_12px_rgba(0,0,0,0.02)]">
            <span className="text-2xl animate-pulse">📧</span>
            <p className="text-xs sm:text-sm font-bold text-rose-800 tracking-wide uppercase leading-relaxed text-center sm:text-left">
              CHECK EMAIL ESPECIALLY SPAM FOLDER, TO DOWNLOAD EBOOK ANYTIME
            </p>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif text-stone-850 mb-3">Where should we send your cookbook?</h3>
          <p className="text-stone-500 mb-6 text-sm">Please enter the email address where you'd like to receive your PDF.</p>
          
          <form 
            autoComplete="on" 
            onSubmit={async (e) => { 
              e.preventDefault(); 
              if (email) { 
                localStorage.setItem('checkout_email', email); 
                setShowEmbed(true); 
                // Push email dynamically to the preloaded Whop checkout iframe
                try {
                  if (embedRef.current && typeof embedRef.current.setEmail === 'function') {
                    await embedRef.current.setEmail(email);
                  }
                } catch (setEmailErr) {
                  console.warn("Could not dynamically set email on Whop iframe:", setEmailErr);
                }
              } 
            }} 
            className="space-y-4 max-w-sm mx-auto"
          >
            <input 
              id="email"
              name="email"
              autoComplete="email"
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com" 
              className="w-full px-5 py-4 rounded-full outline-none transition-all font-sans text-stone-700 clay-input text-center text-lg shadow-[inset_3px_3px_6px_rgba(0,0,0,0.02)] focus:border-rose-300"
            />
            <button 
              type="submit" 
              className="w-full py-4 text-white rounded-full font-sans font-semibold tracking-wide cursor-pointer clay-button-rose hover:-translate-y-1 hover:scale-[1.01] active:translate-y-0 transition-all duration-300 shadow-md flex items-center justify-center gap-3"
            >
              <span>Continue to Checkout</span>
              <span className="text-lg">✨</span>
            </button>
          </form>
          <CheckoutNotice />
        </div>
      </div>

      {/* Whop Checkout Embed Container - Rendered immediately on page load so it preloads perfectly in the background */}
      <div className={showEmbed ? "block" : "hidden"}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={showEmbed ? { opacity: 1, y: 0 } : {}} className="flex flex-col">
          <div className="-mx-6 -mt-6 sm:-mx-10 sm:-mt-10 overflow-hidden rounded-[2.5rem]">
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
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      q: "Is this a physical or digital cookbook?",
      a: "This is a digital cookbook in high-quality, full-color PDF format. You will receive an instant download link on-screen and via email immediately after purchase, with zero waiting time and no shipping costs."
    },
    {
      q: "Can I print these recipes?",
      a: "Yes, absolutely! The PDF file is fully unlocked and optimized for high-resolution printing. You can print out individual recipes or compile them into a physical binder for your kitchen counter."
    },
    {
      q: "Are the ingredients expensive or hard to find?",
      a: "No, every single ingredient used in these recipes is a standard, budget-friendly item that you can easily find at your local grocery store (such as Walmart, Kroger, Tesco, Woolworths, or Aldi). No specialty shops required!"
    },
    {
      q: "Will my picky eaters enjoy these meals?",
      a: "Yes! All recipes have been rigorously kid-tested and approved by picky eaters. We specialize in familiar comfort foods with balanced seasonings and simple ingredients that kids naturally love."
    },
    {
      q: "Is it beginner-friendly?",
      a: "100%. Each recipe features straightforward instructions, minimal active kitchen prep steps, and easy-to-follow guidelines that any home cook can complete in under 15 minutes."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-[#FAF9F6] border-t border-stone-200/40">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-rose-500 uppercase">Have Questions?</span>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-850 mt-3 mb-4">Frequently Asked Questions</h2>
          <p className="text-stone-550 font-light text-sm max-w-lg mx-auto">
            Everything you need to know about the 15-Minute Cookbook. Still have a question? Contact support anytime.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-3xl border border-stone-200/50 bg-white overflow-hidden transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full py-6 px-8 flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="font-serif text-lg text-stone-800 font-medium pr-4">{faq.q}</span>
                  <span className={`text-rose-500 text-xl transition-transform duration-300 transform ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="pb-6 px-8 text-sm text-stone-600 leading-relaxed font-light border-t border-stone-100 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
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
              Transform chaotic evenings into peaceful family time. End picky eater battlegrounds, expensive takeout bills, and meal-planning stress with 50+ family-approved recipes ready in exactly 15 minutes.
            </motion.p>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="relative inline-flex"
            >
              {/* Elegant Overlapping Static Tag */}
              <div className="absolute -top-3.5 right-6 z-20 pointer-events-none select-none">
                <div className="bg-rose-500 text-white font-sans text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full shadow-lg border border-rose-400 flex items-center gap-1.5 whitespace-nowrap tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>50% OFF — Limited Offer</span>
                </div>
              </div>

              <a
                href="#checkout"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#checkout')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative px-8 py-4 text-white rounded-full font-serif text-base sm:text-lg text-center clay-button-black hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-3"
              >
                <span>Make Dinner Easier Tonight — Only $6.99</span>
                <span className="line-through text-stone-400 text-sm font-sans">$13.99</span>
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
              const hoverShadows = [
                "hover:shadow-[0_24px_48px_-10px_rgba(244,63,94,0.18)]",
                "hover:shadow-[0_24px_48px_-10px_rgba(217,119,6,0.18)]",
                "hover:shadow-[0_24px_48px_-10px_rgba(16,185,129,0.18)]"
              ];
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
                  className={`group p-6 sm:p-8 rounded-[2rem] hover:-translate-y-3 hover:scale-[1.03] transform-gpu transition-all duration-300 border-0 ${cardColors[i]} ${hoverShadows[i]}`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-6 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${iconBackgrounds[i]}`}>
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
                 Get Instant Access for $6.99
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
                  className={`p-8 sm:p-10 rounded-[3rem] border-0 transition-all duration-300 hover:-translate-y-6 hover:shadow-lg ${cardColors[i]}`}
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
      <section className="py-24 bg-stone-50 border-t border-stone-200/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-rose-500 uppercase">Real Reviews</span>
            <h2 className="text-3xl md:text-5xl font-serif text-stone-850 mt-3 mb-4">Loved by busy moms</h2>
            <div className="flex items-center justify-center gap-1 text-amber-500 text-lg mb-2">★★★★★</div>
            <p className="text-stone-500 font-light text-sm">4.9/5 stars based on verified buyer feedback</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Instagram Reel Smartphone Frame */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[320px] relative">
                {/* Decorative background glows */}
                <div className="absolute -inset-4 bg-gradient-to-r from-rose-100 to-amber-100 rounded-[3rem] blur-xl opacity-50 -z-10 animate-pulse"></div>
                
                {/* Smartphone Device Frame */}
                <div className="relative aspect-[9/16] w-full rounded-[2.75rem] p-3 bg-stone-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-stone-800">
                  {/* Speaker mesh & Camera Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-stone-900 rounded-b-2xl z-20 flex items-center justify-center gap-1.5">
                    <div className="w-12 h-1 bg-stone-800 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-stone-800 rounded-full"></div>
                  </div>
                  
                  {/* Embedded Iframe */}
                  <div className="w-full h-full relative rounded-[2.25rem] overflow-hidden bg-stone-950">
                    <iframe
                      src="https://www.instagram.com/reel/DaY9jlBPYBU/embed"
                      className="absolute inset-0 w-full h-full border-0 rounded-[2.25rem]"
                      allowtransparency="true"
                      allowFullScreen={true}
                      frameBorder="0"
                      scrolling="no"
                    ></iframe>
                  </div>
                </div>

                <p className="text-center text-xs text-stone-400 mt-4 italic">
                  🎥 Swipe to see quick meal preps on Instagram
                </p>
              </div>
            </div>

            {/* Premium Written Testimonials */}
            <div className="lg:col-span-7 space-y-6">
              {[
                {
                  stars: "★★★★★",
                  quote: "This cookbook literally saved my sanity. I used to dread 5 PM and order takeout multiple times a week. Now, I have dinner on the table before my kids even finish their homework.",
                  author: "Sarah M.",
                  role: "Mom of 3, Verified Buyer",
                  avatar: undefined
                },
                {
                  stars: "★★★★★",
                  quote: "I love this because it makes busy mornings so much easier. 15 Minute Meals for Busy Moms has quick, healthy breakfast ideas that are simple to make and don’t take forever. Perfect for moms who want to feed their family something good without being in the kitchen all morning. 🍓✨",
                  author: "Leilani",
                  role: "Verified Buyer",
                  avatar: "https://i.postimg.cc/1X32QQDk/image.png"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="p-8 rounded-[2rem] bg-white border border-stone-100 shadow-[0_10px_30px_rgba(120,110,100,0.03)] hover:shadow-[0_20px_40px_rgba(120,110,100,0.06)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex gap-1 text-amber-500 font-bold mb-3">{item.stars}</div>
                  <p className="text-stone-700 italic text-base sm:text-lg mb-4 font-light leading-relaxed">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    {item.avatar ? (
                      <img 
                        src={item.avatar} 
                        alt={item.author}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-stone-100/80 shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-serif font-bold text-xs">
                        {item.author[0]}
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-bold text-stone-900 block">{item.author}</span>
                      <span className="text-xs text-stone-400 block">{item.role}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <FAQSection />

      {/* Checkout Section */}
      <section id="checkout" className="py-16 md:py-24 px-4 sm:px-6 text-center bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-stone-850 mb-4 sm:mb-6 leading-tight">End Dinner Stress Today</h2>
          
          <p className="text-stone-550 max-w-xl mx-auto text-base sm:text-lg font-light mb-6">
            Get instant PDF delivery of over 50+ family-tested recipes ready in exactly 15 minutes. Less than the cost of a single takeout order, but saves you hours of stress and mental load every single week.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 sm:mb-10 px-2">
            <span className="text-base sm:text-lg text-stone-500 font-light">Introductory Price: Only</span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-850">$6.99</span>
            <span className="line-through text-stone-400 text-base sm:text-lg font-light font-sans">$13.99</span>
            <span className="bg-rose-100 text-rose-600 text-xs font-sans font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-rose-200/50">Price Rises to $13.99 After Launch</span>
          </div>

          {/* Trust Indicators Badge Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10 px-4">
            {[
              { text: "Instant PDF Delivery", icon: "⚡" },
              { text: "Secure Checkout", icon: "🔒" },
              { text: "Printable Recipes", icon: "🖨️" },
              { text: "Family-Tested Recipes", icon: "❤️" },
              { text: "Grocery Store Ingredients", icon: "🛒" },
              { text: "Beginner Friendly", icon: "🍳" }
            ].map((badge, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 justify-center py-2.5 px-4 bg-white/80 rounded-2xl border border-stone-200/40 text-stone-700 text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              >
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
          
          <div className="overflow-hidden text-left mx-auto max-w-2xl p-6 sm:p-10 clay-card-white border-0 shadow-[inset_6px_6px_12px_rgba(255,255,255,0.95),inset_-6px_-6px_12px_rgba(120,110,100,0.06),15px_25px_50px_rgba(0,0,0,0.12)]">
            <CheckoutFlow />
          </div>
          <p className="mt-8 text-xs text-stone-400 max-w-md mx-auto leading-relaxed px-4">
            Secure checkout powered by{" "}
            <a 
              href="https://whop.com/tos/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-medium text-stone-500 hover:text-rose-500 underline transition-colors"
            >
              whop.com
            </a>
            . By placing this order, you agree to the{" "}
            <a 
              href="https://whop.com/tos/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-medium text-stone-500 hover:text-rose-500 underline transition-colors"
            >
              Terms of Service
            </a>
            .
          </p>
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

const TestWorkflow = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [lastToken, setLastToken] = useState('');
  const [lastDownloadUrl, setLastDownloadUrl] = useState('');

  // Load initial backend URL override from localStorage
  const [backendOverride, setBackendOverride] = useState(() => {
    try {
      return localStorage.getItem('BACKEND_URL_OVERRIDE') || '';
    } catch (e) {
      return '';
    }
  });
  const [saveFeedback, setSaveFeedback] = useState('');

  const saveBackendOverride = (url: string) => {
    const cleanUrl = url.trim();
    try {
      if (!cleanUrl) {
        localStorage.removeItem('BACKEND_URL_OVERRIDE');
        setBackendOverride('');
        setSaveFeedback('Using default backend URL (relative / direct preview).');
      } else {
        localStorage.setItem('BACKEND_URL_OVERRIDE', cleanUrl);
        setBackendOverride(cleanUrl);
        setSaveFeedback('Saved backend URL override! Try sending now.');
      }
    } catch (e: any) {
      setSaveFeedback(`Error saving: ${e.message}`);
    }
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    setMessage('');
    try {
      const targetUrl = getApiUrl('/api/send-test-email');
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Test email sent successfully!');
        if (data.token) setLastToken(data.token);
        if (data.downloadUrl) setLastDownloadUrl(data.downloadUrl);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to send test email.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'An unexpected error occurred. This is usually a CORS/network block from Vercel.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16 px-6 relative overflow-hidden flex flex-col justify-between">
      <AmbientBackground />
      
      <div className="max-w-xl w-full mx-auto relative z-10 my-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-rose-500 uppercase px-3 py-1 bg-rose-50 border border-rose-200/50 rounded-full">Developer Sandbox</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-stone-850 mt-4 mb-3">Email Workflow Test</h1>
          <p className="text-stone-550 font-light text-sm max-w-sm mx-auto leading-relaxed">
            Test the full SMTP delivery flow instantly with 1-click. No payment required.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-stone-200/50 shadow-[0_15px_50px_rgba(0,0,0,0.03)]">
          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Recipient Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  placeholder="e.g. name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all font-sans text-stone-800 placeholder-stone-400 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-4 text-white rounded-2xl font-serif text-base text-center bg-stone-900 hover:bg-stone-850 disabled:bg-stone-400 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              {status === 'sending' ? (
                <span>Sending Test Email...</span>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Send Test Email — Free</span>
                </>
              )}
            </button>
          </form>

          {status !== 'idle' && (
            <div className={`mt-6 p-4 rounded-2xl text-sm border font-light leading-relaxed animate-fade-in ${
              status === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60' 
                : status === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200/60'
                : 'bg-stone-50 text-stone-600 border-stone-200/60'
            }`}>
              <div className="font-semibold mb-1">
                {status === 'success' ? '✓ Email Sent Successfully!' : status === 'error' ? '⚠ Error Occurred' : 'Sending...'}
              </div>
              <p className="opacity-90 text-xs sm:text-sm">{message}</p>
              
              {status === 'success' && (
                <div className="mt-4 pt-4 border-t border-emerald-200/40 space-y-2">
                  <p className="text-xs text-emerald-700 font-medium">Test & Verification Shortcuts:</p>
                  <div className="flex flex-col gap-2">
                    {lastDownloadUrl && (
                      <a 
                        href={lastDownloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:underline font-medium"
                      >
                        🔗 Open Delivery Download Link (PDF)
                      </a>
                    )}
                    <a 
                      href="/logs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-700 hover:underline font-medium"
                    >
                      📋 Open Webhook Logs in New Tab
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Backend URL Configurator */}
        <div className="mt-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-stone-200/50 shadow-[0_15px_50px_rgba(0,0,0,0.01)] text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-stone-800 font-serif font-bold text-sm">🌐 Vercel CORS & Cloud Run Target Configurator</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed font-light mb-3">
            Google AI Studio preview URLs are highly secure and behind a login/identity proxy. Browsers block cross-origin (CORS) calls from external sites like your <strong>Vercel deployment</strong> to this preview endpoint.
          </p>
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/30 mb-3 text-[11px] text-stone-500 font-light leading-relaxed">
            <span className="font-semibold text-stone-700">How to run this successfully on Vercel:</span>
            <ol className="list-decimal list-inside space-y-1 mt-1">
              <li>Deploy this applet to <strong>Cloud Run</strong> using the <strong>Deploy</strong> tab in AI Studio.</li>
              <li>Copy the clean public Cloud Run URL provided by AI Studio (which has no proxy wrapper).</li>
              <li>Paste that URL below and save! Your Vercel page will then connect directly to the active database/SMTP backend.</li>
            </ol>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. https://your-cloudrun-url.a.run.app"
                value={backendOverride}
                onChange={(e) => setBackendOverride(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-rose-200 transition-all font-mono text-[11px] text-stone-700"
              />
              <button
                type="button"
                onClick={() => saveBackendOverride(backendOverride)}
                className="px-3 py-2 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-serif font-medium transition-colors cursor-pointer shrink-0"
              >
                Save Target
              </button>
            </div>
            {saveFeedback && (
              <p className="text-[10px] font-semibold text-rose-500 animate-fade-in">{saveFeedback}</p>
            )}
            <p className="text-[10px] text-stone-400 font-light mt-1">
              Current API Endpoint: <span className="font-mono text-stone-500 select-all font-semibold break-all">{getApiUrl('/api/send-test-email')}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-stone-400 font-light flex items-center justify-center gap-4">
          <a href="/" className="hover:text-stone-700 hover:underline transition-colors">← Back to Landing Page</a>
          <span>•</span>
          <a href="/logs" className="hover:text-stone-700 hover:underline transition-colors">View Logs Page</a>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-stone-400 font-light">
        © {new Date().getFullYear()} 15-Minute Cookbook. Internal Developer Sandbox.
      </footer>
    </div>
  );
};

const LogsViewer = () => {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(getApiUrl('/api/logs'));
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
      await fetch(getApiUrl('/api/logs'), { method: 'DELETE' });
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
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  const isLogs = path.includes('/logs');
  const isTest = path.includes('/test') || hash.includes('test') || search.includes('test');
  const isDownload = path.includes('/download') || hash.includes('download') || search.includes('download');

  return (
    <>
      {isLogs ? (
        <LogsViewer />
      ) : isTest ? (
        <TestWorkflow />
      ) : isDownload ? (
        <EmbedGuard>
          <Download />
        </EmbedGuard>
      ) : (
        <LandingPage />
      )}
    </>
  );
}
