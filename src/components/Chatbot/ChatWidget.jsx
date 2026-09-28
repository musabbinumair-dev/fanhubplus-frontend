import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Sparkles,
  Compass,
  Bookmark,
  Calendar,
  Film,
  BookOpen,
  Lightbulb,
  Split,
  PenTool,
  MessageSquarePlus,
  Trash2,
  Plus,
  ArrowLeft,
  ArrowRight,
  Loader2
} from "lucide-react";
import {
  getStoredMessages,
  saveStoredMessages,
  clearStoredMessages,
  sendChatMessage
} from "../../api/chatApi.js";

// Robot Head Mascot Icon for Floating Launcher
export const RobotIcon = ({ size = 26, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="3.2" stroke="#121620" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="2.2" r="1.3" fill="#121620" />
    <rect x="2.5" y="8.5" width="2" height="4.5" rx="1" fill="#FFFFFF" stroke="#121620" strokeWidth="1.4" />
    <rect x="19.5" y="8.5" width="2" height="4.5" rx="1" fill="#FFFFFF" stroke="#121620" strokeWidth="1.4" />
    <rect x="4" y="5.5" width="16" height="13.5" rx="4" fill="#FFFFFF" stroke="#121620" strokeWidth="1.8" />
    <rect x="6.5" y="8" width="11" height="6.5" rx="2" fill="#121620" />
    <ellipse cx="9.2" cy="11.2" rx="1.1" ry="1.4" fill="#FFFFFF" />
    <ellipse cx="14.8" cy="11.2" rx="1.1" ry="1.4" fill="#FFFFFF" />
    <path d="M10.5 16.2C11 16.8 13 16.8 13.5 16.2" stroke="#121620" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const ChatWidget = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("fanhub"); // "fanhub" | "ai"
  const [fanhubMessages, setFanhubMessages] = useState(() => getStoredMessages("fanhub"));
  const [aiMessages, setAiMessages] = useState(() => getStoredMessages("ai"));
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync state to localStorage whenever messages change
  useEffect(() => {
    saveStoredMessages("fanhub", fanhubMessages);
  }, [fanhubMessages]);

  useEffect(() => {
    saveStoredMessages("ai", aiMessages);
  }, [aiMessages]);

  // Current active mode messages & screen state
  const currentMessages = activeMode === "fanhub" ? fanhubMessages : aiMessages;
  const isChatting = currentMessages.length > 0 && !showWelcomeScreen;

  const setModeMessages = (updater) => {
    if (activeMode === "fanhub") {
      setFanhubMessages(updater);
    } else {
      setAiMessages(updater);
    }
  };

  // Scroll to bottom on message updates when chatting
  useEffect(() => {
    if (isOpen && isChatting) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages, isOpen, isLoading, isChatting]);

  // Focus input when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, activeMode]);

  // Handle sending a message
  const handleSend = async (textToSend = null) => {
    const text = (textToSend !== null ? textToSend : inputMessage).trim();
    if (!text || isLoading) return;

    setShowWelcomeScreen(false);

    const userMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setModeMessages((prev) => [...prev, userMessage]);
    if (textToSend === null) {
      setInputMessage("");
    }
    setIsLoading(true);

    try {
      const botResponse = await sendChatMessage({
        message: text,
        mode: activeMode
      });

      const botMessage = {
        ...botResponse,
        id: `b_${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setModeMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg = {
        id: `err_${Date.now()}`,
        sender: "bot",
        text: "Sorry, I had trouble processing that. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setModeMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // New Chat: starts fresh conversation and resets to welcome screen
  const handleNewChat = () => {
    setModeMessages([]);
    clearStoredMessages(activeMode);
    setShowClearConfirm(false);
    setShowWelcomeScreen(false);
    setInputMessage("");
  };

  // Clear conversation with confirmation
  const handleConfirmClear = () => {
    setModeMessages([]);
    clearStoredMessages(activeMode);
    setShowClearConfirm(false);
    setShowWelcomeScreen(false);
    setInputMessage("");
  };

  // 4 Prompt Suggestions per mode
  const fanhubSuggestions = [
    { text: "Take a tour of FandomVerse", icon: Compass, color: "text-amber-500" },
    { text: "Recommend something to watch", icon: Film, color: "text-blue-500" },
    { text: "How do I bookmark content?", icon: Bookmark, color: "text-emerald-500" },
    { text: "Show me upcoming events", icon: Calendar, color: "text-purple-500" }
  ];

  const aiSuggestions = [
    { text: "Explain a plot without spoilers", icon: BookOpen, color: "text-indigo-500" },
    { text: "Suggest a story idea", icon: Lightbulb, color: "text-amber-500" },
    { text: "Compare two genres", icon: Split, color: "text-rose-500" },
    { text: "Help me write a fan review", icon: PenTool, color: "text-teal-500" }
  ];

  const currentSuggestions = activeMode === "fanhub" ? fanhubSuggestions : aiSuggestions;

  return (
    <div className="fixed bottom-20 right-3 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* 1. LAUNCHER BUTTON: Only shown when closed */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto w-14 h-14 rounded-full bg-[#FFA800] hover:bg-[#FFB51A] text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer z-10"
          aria-label="Open FandomVerse Assistant"
        >
          <RobotIcon size={28} />
        </button>
      )}

      {/* 2. CHAT WINDOW: Responsive container, fixed in corner on desktop/tablet, full-width on mobile */}
      <div
        className={`pointer-events-auto w-[calc(100vw-24px)] sm:w-[410px] md:w-[420px] bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-black/15 flex flex-col overflow-hidden text-gray-900 font-sans transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen
            ? "h-[calc(100dvh-100px)] sm:h-[560px] md:h-[620px] max-h-[82vh] md:max-h-[88vh] opacity-100 scale-100"
            : "h-0 max-h-0 opacity-0 scale-95 pointer-events-none border-transparent p-0 overflow-hidden"
        }`}
      >
        {/* HEADER SECTION */}
        {isChatting ? (
          /* CHATTING SCREEN HEADER: Compact, clean, Back button, Assistant status, New, Clear, Close */
          <div className="px-4 py-3 shrink-0 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWelcomeScreen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                title="Back to welcome screen"
              >
                <ArrowLeft size={14} strokeWidth={2.5} />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2 pl-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeMode === "fanhub" ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
                <span className="font-extrabold text-sm text-gray-900 leading-tight">
                  {activeMode === "fanhub" ? "FanHub Assistant" : "AI Assistant"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleNewChat}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 hover:border-[#FFA800] text-[11px] font-bold text-gray-700 bg-white hover:bg-amber-50/50 cursor-pointer transition-colors"
                title="Start a new chat"
              >
                <MessageSquarePlus size={12} className="text-[#FFA800]" />
                <span className="hidden sm:inline">New</span>
              </button>

              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer ml-0.5"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        ) : (
          /* WELCOME SCREEN HEADER */
          <div className="px-5 pt-4 pb-2.5 shrink-0 border-b border-gray-100">
            {/* Top Brand Subtitle & Controls */}
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                FANDOMVERSE AI
              </span>

              <div className="flex items-center gap-1">
                {currentMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Clear conversation"
                  >
                    <Trash2 size={15} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Title Row + Action Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                Ask Your AI<br />Assistant
              </h2>

              {currentMessages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowWelcomeScreen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFA800] hover:bg-[#FFB51A] text-black text-[11px] font-bold shadow-2xs cursor-pointer active:scale-95 transition-all"
                  title="Return to conversation"
                >
                  <span>RESUME CHAT</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 hover:border-[#FFA800] text-[11px] font-bold text-gray-700 bg-white hover:bg-amber-50/50 shadow-2xs cursor-pointer active:scale-95 transition-all"
                >
                  <MessageSquarePlus size={13} className="text-[#FFA800]" />
                  <span>NEW CHAT</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODE SWITCHER: Hidden when chatting so user can see responses easily */}
        {!isChatting && (
          <div className="px-5 pt-2.5 pb-2 shrink-0 bg-gray-50/60 border-b border-gray-100">
            <div className="flex items-center justify-between text-gray-400 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                SELECT AN ASSISTANT
              </span>
              <span className="text-[10px] font-semibold text-gray-400">
                2 Modes
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Mode 1: FanHub Assistant */}
              <button
                type="button"
                onClick={() => {
                  setActiveMode("fanhub");
                  setShowClearConfirm(false);
                }}
                className={`p-3 rounded-2xl flex flex-col justify-between text-left transition-all cursor-pointer relative ${
                  activeMode === "fanhub"
                    ? "bg-[#FFF9EE] border-2 border-[#FFA800] shadow-xs"
                    : "bg-white border border-gray-200 hover:bg-gray-100/60"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#FFA800]">
                    <Compass size={15} />
                  </div>
                  {activeMode === "fanhub" && (
                    <span className="bg-black text-white text-[8.5px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <h4 className="font-extrabold text-xs text-gray-900 leading-tight">
                    FanHub Assistant
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                    Platform FAQs & picks
                  </p>
                </div>
              </button>

              {/* Mode 2: AI Assistant */}
              <button
                type="button"
                onClick={() => {
                  setActiveMode("ai");
                  setShowClearConfirm(false);
                }}
                className={`p-3 rounded-2xl flex flex-col justify-between text-left transition-all cursor-pointer relative ${
                  activeMode === "ai"
                    ? "bg-[#FFF9EE] border-2 border-[#FFA800] shadow-xs"
                    : "bg-white border border-gray-200 hover:bg-gray-100/60"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center text-lime-600">
                    <Sparkles size={15} />
                  </div>
                  {activeMode === "ai" && (
                    <span className="bg-black text-white text-[8.5px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <h4 className="font-extrabold text-xs text-gray-900 leading-tight">
                    AI Assistant
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                    Lore, plots & reviews
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* MAIN BODY: Welcome screen OR Active Conversation View */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-200">
          
          {/* Clear Confirmation Prompt */}
          {showClearConfirm && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl animate-in fade-in duration-150 mb-2">
              <p className="text-xs font-bold text-gray-900">
                Clear conversation for {activeMode === "fanhub" ? "FanHub Assistant" : "AI Assistant"}?
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                This will delete your messages in this mode permanently.
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Screen Content */}
          {!isChatting ? (
            /* 1. WELCOME SCREEN: When active mode has no messages or user navigated back */
            <div className="space-y-3 pt-1 animate-in fade-in duration-200">
              {currentMessages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowWelcomeScreen(false)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100/70 text-gray-900 flex items-center justify-between text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Resume conversation ({currentMessages.length} messages)</span>
                  </span>
                  <ArrowRight size={14} className="text-amber-600" />
                </button>
              )}

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-gray-400">
                  <h3 className="text-xs font-bold text-gray-900">
                    Trending Prompt
                  </h3>
                  <span className="text-[10px] text-gray-400">
                    Tap for instant action
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {currentSuggestions.map((s, idx) => {
                    const IconComponent = s.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(s.text)}
                        className="bg-white hover:bg-amber-50/60 border border-gray-200 hover:border-[#FFA800] rounded-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-semibold text-gray-800 shadow-2xs transition-all cursor-pointer text-left active:scale-98 group"
                      >
                        <IconComponent size={14} className={`${s.color} shrink-0`} />
                        <span className="truncate flex-1">{s.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* 2. ACTIVE CONVERSATION VIEW */
            <div className="space-y-3 pt-1 animate-in fade-in duration-200">

              {/* Message stream */}
              {currentMessages.map((msg) => {
                const isUser = msg.sender === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`p-3.5 text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                        isUser
                          ? "bg-black text-white rounded-3xl px-4 py-2.5 shadow-sm"
                          : "bg-gray-50 border border-gray-200 text-gray-900 rounded-3xl shadow-2xs"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Content Recommendations Cards */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 pt-2.5 mt-2 border-t border-gray-200/60">
                          {msg.recommendations.map((item, rIdx) => (
                            <div
                              key={rIdx}
                              onClick={() => {
                                if (onNavigate && item.path) onNavigate(item.path);
                              }}
                              className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 hover:border-[#FFA800] transition-colors cursor-pointer group shadow-2xs"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-xs text-gray-900 truncate group-hover:text-[#FFA800] transition-colors">
                                  {item.title}
                                </h5>
                                <span className="inline-block mt-0.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 pl-2">
                  <Loader2 size={14} className="animate-spin text-[#FFA800]" />
                  <span>Thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* INPUT BAR: Black pill container pinned at bottom */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="bg-black rounded-full flex items-center px-1.5 py-1.5 shadow-lg"
          >
            {/* Plus icon: starts fresh conversation / resets to welcome screen */}
            <button
              type="button"
              onClick={handleNewChat}
              className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-black flex items-center justify-center font-bold shrink-0 transition-colors cursor-pointer active:scale-95"
              title="Start fresh conversation"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>

            {/* Input field */}
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask ${activeMode === "fanhub" ? "FanHub Assistant" : "AI Assistant"}...`}
              disabled={isLoading}
              className="bg-transparent text-white placeholder-gray-400 text-xs sm:text-sm px-3 flex-1 outline-none font-medium"
            />

            {/* Send button in brand yellow */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-8 h-8 rounded-full bg-[#FFA800] hover:bg-[#FFB51A] disabled:opacity-40 text-black flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer shadow-xs"
              title="Send message"
            >
              <Send size={14} className="stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
