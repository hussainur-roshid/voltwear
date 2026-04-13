import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Zap, 
  ChevronRight, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Mail, 
  Instagram, 
  Twitter, 
  Youtube,
  Search,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Eye,
  Play,
  Quote,
  CreditCard,
  Lock,
  ArrowLeft,
  Package,
  Sparkles,
  MessageSquare,
  Send,
  Loader2,
  Facebook,
  Github
} from 'lucide-react';

// --- GEMINI API CONFIG ---
const apiKey = ""; // Environment provides this at runtime
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

async function callGemini(prompt, systemInstruction = "") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  };

  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now. Please try again.";
    } catch (error) {
      if (i === 4) return "Connection error. Please check your network.";
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

// --- MOCK DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "Transparent Wireless Earbuds",
    price: 29.99,
    tag: "New",
    vibe: "Daily Carry",
    shortDesc: "Futuristic sound with a design that stands out.",
    fullDesc: "Upgrade your audio experience with these transparent wireless earbuds. Designed for both performance and aesthetics, they deliver crystal-clear sound while elevating your everyday style.",
    features: ["High-quality stereo sound", "Up to 20 hours battery life", "Fast charging support", "Unique transparent design"],
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=600",
    badge: "Trending"
  },
  {
    id: 2,
    name: "RGB LED Light Strip",
    price: 19.99,
    tag: "Sale",
    vibe: "Desk Setup",
    shortDesc: "Turn any room into a vibe.",
    fullDesc: "Transform your space instantly with smart RGB LED strips. Control colors, brightness, and effects directly from your phone via our dedicated app.",
    features: ["App & remote control", "Multiple color modes", "Music sync lighting", "Easy installation"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600",
    badge: "Best Seller"
  },
  {
    id: 3,
    name: "Techwear USB Backpack",
    price: 39.99,
    tag: "Essential",
    vibe: "On-the-Go",
    shortDesc: "Style meets functionality on the move.",
    fullDesc: "A modern backpack designed for daily use with built-in USB charging. Perfect for students, travelers, and tech enthusiasts.",
    features: ["USB charging port", "Water-resistant material", "Anti-theft design", "Multiple compartments"],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
    badge: "Popular"
  },
  {
    id: 4,
    name: "Minimalist Smartwatch",
    price: 34.99,
    tag: "Sleek",
    vibe: "Daily Carry",
    shortDesc: "Smart, simple, and stylish.",
    fullDesc: "Stay connected and track your daily activity with a sleek smartwatch that matches any outfit perfectly.",
    features: ["Fitness tracking", "Call notifications", "Customizable straps", "Long battery life"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
    badge: "Best Seller"
  },
  {
    id: 5,
    name: "Magnetic Matte Phone Case",
    price: 14.99,
    tag: "Protection",
    vibe: "Daily Carry",
    shortDesc: "Clean look. Strong protection.",
    fullDesc: "A slim, matte-finish phone case with magnetic support for a secure and stylish everyday carry experience.",
    features: ["Shockproof design", "Anti-fingerprint", "Magnetic compatibility", "Lightweight"],
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=600",
    badge: "Hot"
  },
  {
    id: 6,
    name: "Cyberpunk Desk Mat",
    price: 24.99,
    tag: "Aesthetic",
    vibe: "Desk Setup",
    shortDesc: "The ultimate base for your tech.",
    fullDesc: "Premium stitching and water-resistant fabric with a futuristic circuit-board print to ground your setup.",
    features: ["Non-slip base", "Micro-woven cloth", "Large surface area", "Easy clean"],
    image: "https://images.unsplash.com/photo-1616422285623-13ff0167c95c?auto=format&fit=crop&q=80&w=600",
    badge: "Best Seller"
  }
];

// --- AI COMPONENTS ---

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Welcome to the Volt Hub. How can I assist your aesthetic journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const systemPrompt = "You are the VoltWear AI Support Agent. You are professional, futuristic, and helpful. You represent an aesthetic tech lifestyle brand called VoltWear. Keep responses concise and use a bit of 'tech' or 'aesthetic' lingo. Mention products from our catalog if relevant (Earbuds, RGB strips, Backpacks, Smartwatches, Phone Cases, Desk Mats).";
    
    const aiResponse = await callGemini(userMsg, systemPrompt);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-[#1A1A1A] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          <div className="p-4 bg-black border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Volt Support ✨</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-[#00E5FF] text-black font-bold' : 'bg-white/5 text-zinc-300 border border-white/5'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <Loader2 className="w-4 h-4 text-[#00E5FF] animate-spin" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-black/50 border-t border-white/10 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..." 
              className="flex-grow bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#00E5FF] transition-all"
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-[#00E5FF] rounded-xl text-black hover:bg-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#00E5FF] text-black p-4 rounded-full shadow-[0_10px_30px_rgba(0,229,255,0.4)] hover:scale-110 transition-all group"
        >
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

// --- EXISTING COMPONENTS ---

const Navbar = ({ cartCount, onOpenCart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Adjust for sticky nav height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md py-3 border-b border-white/10 shadow-xl' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <div className="relative">
            <Zap className="w-8 h-8 text-[#00E5FF] fill-[#00E5FF] group-hover:scale-110 transition-transform" />
            <div className="absolute -inset-1 bg-[#00E5FF] blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>
          <span className="text-2xl font-bold tracking-tighter italic">VOLT<span className="text-[#00E5FF]">WEAR</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-[#00E5FF] transition-colors">Home</a>
          <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')} className="hover:text-[#00E5FF] transition-colors">Shop</a>
          <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')} className="hover:text-[#00E5FF] transition-colors">Categories</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-[#00E5FF] transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={onOpenCart} className="relative group p-2">
            <ShoppingCart className="w-6 h-6 text-white group-hover:text-[#00E5FF] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#7B2CFF] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0F0F0F] font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-6 text-[10px] font-black uppercase tracking-[0.3em]">
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-[#00E5FF]">Home</a>
            <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')} className="hover:text-[#00E5FF]">Shop</a>
            <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')} className="hover:text-[#00E5FF]">Categories</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-[#00E5FF]">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  return (
    <div className="group bg-[#1F1F1F] rounded-2xl overflow-hidden border border-white/5 hover:border-[#00E5FF]/30 transition-all duration-500 flex flex-col h-full shadow-lg">
      <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.badge && (
          <div className="absolute top-4 left-4 bg-[#7B2CFF] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
            {product.badge}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="p-3 bg-white rounded-full text-black hover:bg-[#00E5FF] transition-colors shadow-xl"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-base leading-tight group-hover:text-[#00E5FF] transition-colors">{product.name}</h3>
        </div>
        <p className="text-zinc-500 text-xs mb-4 line-clamp-2">{product.shortDesc}</p>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-lg font-black tracking-tighter text-[#00E5FF]">${product.price}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white hover:text-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-white/10"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentSystem = ({ cart, onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleNext = () => {
    if (step === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
        onComplete();
      }, 2500);
    } else {
      setStep(step + 1);
    }
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-[#00E5FF]/20 rounded-full flex items-center justify-center mb-8">
          <CheckCircle className="w-12 h-12 text-[#00E5FF]" />
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter mb-4 uppercase">Order Confirmed</h2>
        <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-10 leading-relaxed uppercase tracking-widest font-bold">
          Your gear is being prepped. Check your inbox for a confirmation.
        </p>
        <button 
          onClick={onBack}
          className="bg-white text-black px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#00E5FF] transition-all"
        >
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0F0F0F] text-white">
      <div className="flex items-center justify-between px-8 py-6 bg-[#1A1A1A] border-b border-white/10">
        <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className="p-2 hover:bg-white/5 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-[#00E5FF]' : 'bg-zinc-800'}`}></div>
          <div className={`w-8 h-[1px] ${step >= 2 ? 'bg-[#00E5FF]' : 'bg-zinc-800'}`}></div>
          <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-[#00E5FF]' : 'bg-zinc-800'}`}></div>
        </div>
        <div className="w-5"></div>
      </div>

      <div className="flex-grow overflow-y-auto p-8 max-w-2xl mx-auto w-full">
        {step === 1 ? (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter mb-6 uppercase flex items-center gap-3">
                <Truck className="w-6 h-6 text-[#00E5FF]" /> Shipping Info
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First Name" className="col-span-1 bg-[#1A1A1A] border border-white/10 p-4 rounded-xl text-xs font-bold uppercase tracking-widest focus:border-[#00E5FF] outline-none" />
                <input placeholder="Last Name" className="col-span-1 bg-[#1A1A1A] border border-white/10 p-4 rounded-xl text-xs font-bold uppercase tracking-widest focus:border-[#00E5FF] outline-none" />
                <input placeholder="Email" className="col-span-2 bg-[#1A1A1A] border border-white/10 p-4 rounded-xl text-xs font-bold uppercase tracking-widest focus:border-[#00E5FF] outline-none" />
                <input placeholder="Address" className="col-span-2 bg-[#1A1A1A] border border-white/10 p-4 rounded-xl text-xs font-bold uppercase tracking-widest focus:border-[#00E5FF] outline-none" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter mb-6 uppercase flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#00E5FF]" /> Payment
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#1A1A1A] border-2 border-[#00E5FF] p-4 rounded-2xl flex flex-col items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#00E5FF]" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Card</span>
                  </div>
                </div>
                <input placeholder="Card Number" className="w-full bg-[#1A1A1A] border border-white/10 p-4 rounded-xl text-xs font-bold tracking-[0.3em] focus:border-[#00E5FF] outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="MM / YY" className="bg-[#1A1A1A] border border-white/10 p-4 rounded-xl text-xs font-bold uppercase focus:border-[#00E5FF] outline-none text-center" />
                  <input placeholder="CVC" className="bg-[#1A1A1A] border border-white/10 p-4 rounded-xl text-xs font-bold uppercase focus:border-[#00E5FF] outline-none text-center" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-[#1A1A1A] border-t border-white/10 space-y-6">
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex justify-between items-end mb-6">
            <div className="text-zinc-500">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1">Total Summary</p>
              <p className="text-white text-3xl font-black italic tracking-tighter">${total.toFixed(2)}</p>
            </div>
          </div>
          <button 
            onClick={handleNext}
            disabled={isProcessing}
            className={`w-full ${isProcessing ? 'bg-zinc-800 cursor-not-allowed' : 'bg-[#00E5FF] hover:bg-white'} text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all`}
          >
            {isProcessing ? 'AUTHORIZING...' : (step === 1 ? 'CONTINUE TO PAYMENT' : 'COMPLETE PURCHASE')}
          </button>
        </div>
      </div>
    </div>
  );
};

const CartDrawer = ({ isOpen, onClose, cart, updateQty, removeItem, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#0F0F0F] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1A1A1A]">
          <h2 className="text-xl font-black italic tracking-tighter flex items-center gap-2">
            <ShoppingCart className="text-[#00E5FF] w-5 h-5" /> YOUR BAG
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-black to-[#0F0F0F]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
              <ShoppingCart className="w-12 h-12 opacity-10" />
              <p className="uppercase tracking-[0.2em] text-[10px] font-bold">Your bag is empty.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 group">
                <img src={item.image} className="w-20 h-20 rounded-xl object-cover border border-white/5" alt={item.name} />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm tracking-tight">{item.name}</h4>
                    <button onClick={() => removeItem(item.id)} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <p className="text-[#00E5FF] text-sm font-black mt-1">${item.price}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 bg-[#1A1A1A] border-t border-white/10 space-y-4">
            <div className="flex justify-between text-zinc-400 text-sm font-bold uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-white">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-[#00E5FF] text-black font-black py-5 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all uppercase tracking-widest"
            >
              GO TO CHECKOUT <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [curation, setCuration] = useState("");
  const [isCurating, setIsCurating] = useState(false);

  const getStyleTips = async () => {
    if (isCurating) return;
    setIsCurating(true);
    const prompt = `Generate a stylish, futuristic techwear outfit recommendation for someone using the following item: "${product.name}". 
    The item is described as: "${product.shortDesc}". 
    Keep it to 3 bullet points, high energy, and aesthetic. Use cool emoji.`;
    
    const result = await callGemini(prompt, "You are a professional futuristic fashion stylist.");
    setCuration(result);
    setIsCurating(false);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative bg-[#1F1F1F] max-w-4xl w-full rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh] border border-white/10">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 bg-black/50 p-3 rounded-full hover:bg-black transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <div className="md:w-1/2 h-80 md:h-auto">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
        </div>
        
        <div className="md:w-1/2 p-10 overflow-y-auto bg-gradient-to-br from-[#1F1F1F] to-black">
          <span className="text-[#7B2CFF] font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">{product.vibe}</span>
          <h2 className="text-4xl font-black italic tracking-tighter mb-4 leading-tight">{product.name}</h2>
          <p className="text-3xl text-[#00E5FF] font-black mb-6 tracking-tighter">${product.price}</p>
          
          <div className="space-y-6 mb-8">
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">{product.fullDesc}</p>
          </div>

          <div className="space-y-4 mb-10">
            <button 
              onClick={onAddToCart}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00E5FF] transition-all flex items-center justify-center gap-3"
            >
              ADD TO BAG <Plus className="w-5 h-5" />
            </button>

            <button 
              onClick={getStyleTips}
              disabled={isCurating}
              className="w-full bg-gradient-to-r from-[#7B2CFF] to-[#00E5FF] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(123,44,255,0.3)]"
            >
              {isCurating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              ✨ GET AI STYLE TIPS
            </button>

            {curation && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> AI RECOMMENDATION
                </div>
                <div className="text-[11px] text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
                  {curation}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold justify-center border-t border-white/5 pt-6">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Secure Pay</span>
            <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> 30-Day Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#0F0F0F] border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-8 h-8 text-[#00E5FF] fill-[#00E5FF]" />
              <span className="text-2xl font-bold tracking-tighter italic uppercase">VOLT<span className="text-[#00E5FF]">WEAR</span></span>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-8 font-medium">
              We engineer technical gear for the digital frontier. Our mission is to merge high-performance utility with futuristic aesthetics.
            </p>
            <div className="flex gap-4">
              <button className="p-3 bg-white/5 rounded-xl hover:bg-[#00E5FF] hover:text-black transition-all border border-white/5">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/5 rounded-xl hover:bg-[#00E5FF] hover:text-black transition-all border border-white/5">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/5 rounded-xl hover:bg-[#00E5FF] hover:text-black transition-all border border-white/5">
                <Github className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00E5FF] mb-8">Navigation</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Catalog</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Featured Items</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00E5FF] mb-8">Support</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
          <p>© 2024 VOLTWEAR INDUSTRIES. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <span>DESIGNED FOR THE FUTURE</span>
            <span>POWERED BY GEMINI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN APP ---

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter(p => p.vibe === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-['Poppins',sans-serif] selection:bg-[#00E5FF] selection:text-black scroll-smooth">
      <Navbar cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />

      <main className={`${isCheckoutOpen ? 'hidden' : 'block'}`}>
        {/* Hero */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-[#00E5FF]/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] bg-[#7B2CFF]/10 blur-[180px] rounded-full"></div>
          </div>

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-[10rem] font-black italic tracking-tighter mb-8 leading-[0.85]">
              WEAR THE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7B2CFF]">FUTURE</span>
            </h1>
            <p className="text-zinc-500 text-lg mb-12 max-w-2xl mx-auto font-medium tracking-tight">
              Aesthetic tech essentials for your digital lifestyle. Powered by ✨ Gemini AI curation.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('shop');
                if (element) {
                   window.scrollTo({
                     top: element.offsetTop - 80,
                     behavior: 'smooth'
                   });
                }
              }} 
              className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#00E5FF] transition-all"
            >
              Shop Now
            </button>
          </div>
        </section>

        {/* Shop Grid */}
        <section id="shop" className="py-32 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase">Catalog</h2>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {['All', 'Desk Setup', 'Daily Carry', 'On-the-Go'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeCategory === cat ? 'bg-[#00E5FF] text-black' : 'bg-white/5 border border-white/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>

        <Footer />
      </main>

      {/* Overlays */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0F0F0F]">
          <PaymentSystem cart={cart} onBack={() => setIsCheckoutOpen(false)} onComplete={() => setCart([])} />
        </div>
      )}

      <CartDrawer 
        isOpen={isCartOpen && !isCheckoutOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        removeItem={(id) => setCart(c => c.filter(x => x.id !== id))}
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />

      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        onAddToCart={() => addToCart(quickViewProduct)} 
      />

      {/* AI Features */}
      <AIChatBot />

    </div>
  );
}