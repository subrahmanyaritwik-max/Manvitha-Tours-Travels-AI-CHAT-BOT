import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPaperPlane, FaMicrophone, FaRegCopy, FaDownload, FaTrash, FaStar, FaShareAlt, FaVolumeUp, FaVolumeMute, FaCheckCircle } from 'react-icons/fa';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('');

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [sessionId, setSessionId] = useState('');
  const messagesContainerRef = useRef(null);

  // Load chat logs on load
  useEffect(() => {
    const savedChats = localStorage.getItem('manivtha_chats');
    const speakingPref = localStorage.getItem('manivtha_speaking_pref');
    const savedLang = localStorage.getItem('manivtha_chat_language');
    let sId = localStorage.getItem('manivtha_chat_session_id');
    if (speakingPref) {
      setIsSpeaking(speakingPref === 'true');
    }
    if (savedLang) {
      setSelectedLanguage(savedLang);
    }
    if (!sId) {
      sId = 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      localStorage.setItem('manivtha_chat_session_id', sId);
    }
    setSessionId(sId);
    if (savedChats) {
      setMessages(JSON.parse(savedChats));
    } else {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: 'Namaste! Welcome to Manivtha Tours & Travels dedicated AI Workspace. I am your Chauffeur Assistant. How can I help you? Ask me for vehicle suggestions or outstation rates!',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, []);

  const saveChats = (newMsgs) => {
    setMessages(newMsgs);
    localStorage.setItem('manivtha_chats', JSON.stringify(newMsgs));
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Quick Action Buttons
  const quickActions = [
    { label: '📅 Book Cab Form', query: 'trigger_booking_form' },
    { label: '🚖 Airport Transfer', query: 'Do you offer airport drops? What are the rates?' },
    { label: '🏖 Outstation Trip', query: 'What are your outstation travel packages and per-km prices?' },
    { label: '🏢 Corporate Travel', query: 'Do you offer corporate contracts and office employee pickups?' },
    { label: '💒 Wedding Travel', query: 'Can I rent luxury cars for wedding transportation?' },
    { label: '👨👩👧 Family Tour', query: 'Suggest a premium SUV for 6 people traveling around Hyderabad.' },
    { label: '🚌 Group Travel', query: 'We are 12 people. What vehicle do you recommend for outstation travel?' }
  ];

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeaking = () => {
    const nextVal = !isSpeaking;
    setIsSpeaking(nextVal);
    localStorage.setItem('manivtha_speaking_pref', String(nextVal));
    if (!nextVal) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSend = async (textToSend) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toISOString()
    };

    const updatedMsgs = [...messages, userMsg];
    saveChats(updatedMsgs);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText, 
          chatHistory: updatedMsgs.filter(m => m.type !== 'booking_form'), // Don't send custom forms to Gemini history
          language: selectedLanguage,
          sessionId: sessionId
        })
      });

      if (!response.ok) throw new Error('API server unreachable');

      const data = await response.json();
      
      const aiMsg = {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        text: data.response,
        topic: data.topic,
        timestamp: data.timestamp || new Date().toISOString()
      };

      saveChats([...updatedMsgs, aiMsg]);
      if (isSpeaking) speakText(data.response);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: Date.now().toString() + '-err',
        sender: 'ai',
        text: "I am experiencing connectivity issues. You can book a Sedan starting at ₹12/km, Innova at ₹20/km, and Tempo Travellers at ₹25/km. Call us directly at +91 94901 02588!",
        timestamp: new Date().toISOString()
      };
      saveChats([...updatedMsgs, errorMsg]);
      if (isSpeaking) speakText(errorMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action.query === 'trigger_booking_form') {
      const formMsg = {
        id: 'form-' + Date.now().toString(),
        sender: 'ai',
        type: 'booking_form',
        text: 'Interactive Booking Form',
        timestamp: new Date().toISOString()
      };
      saveChats([...messages, formMsg]);
    } else {
      handleSend(action.query);
    }
  };

  const handleBookingSubmitSuccess = (bookingDetails) => {
    // Add success message to chat
    const successMsg = {
      id: 'success-' + Date.now().toString(),
      sender: 'ai',
      text: `✓ Booking enquiry submitted successfully!\n\nDetails:\n• Name: ${bookingDetails.name}\n• Phone: ${bookingDetails.phone}\n• Service: ${bookingDetails.serviceType}\n• Date: ${bookingDetails.pickupDate}\n• Route: ${bookingDetails.pickupLocation} ➔ ${bookingDetails.destination}\n• Passengers: ${bookingDetails.passengerCount}\n\nOur admin team has received this request (Pending confirmation). Chauffeur details will be shared soon!`,
      timestamp: new Date().toISOString()
    };
    // Filter out the booking form bubble and add success msg
    const cleanMsgs = messages.filter(m => m.type !== 'booking_form');
    saveChats([...cleanMsgs, successMsg]);
  };

  const handleBookingCancel = () => {
    const cleanMsgs = messages.filter(m => m.type !== 'booking_form');
    saveChats(cleanMsgs);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input not supported on this browser. Try Chrome/Edge.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.interimResults = false;

    rec.onstart = () => setIsListening(true);
    rec.onresult = (e) => setInputValue(e.results[0][0].transcript);
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    rec.start();
  };

  const clearChat = () => {
    window.speechSynthesis.cancel();
    const base = [
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Workspace cleared. What can I calculate or explain for you today?',
        timestamp: new Date().toISOString()
      }
    ];
    saveChats(base);
    setFeedbackStatus('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied response to clipboard!');
  };

  const shareConversation = () => {
    const shareUrl = `${window.location.origin}/chatbot?ref=share`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard: ' + shareUrl);
  };

  const downloadPDFTranscript = () => {
    const logs = messages.map(m => `
      <div style="margin-bottom:15px; padding:10px; border-radius:8px; background:${m.sender === 'user' ? '#e1ffc7' : '#f0f0f0'}; text-align:${m.sender === 'user' ? 'right' : 'left'}">
        <strong style="font-size:10px; color:#666; display:block;">${m.sender === 'user' ? 'Customer' : 'AI Chauffeur'} - ${new Date(m.timestamp).toLocaleTimeString()}</strong>
        <p style="margin:5px 0 0; font-size:12px; font-family:sans-serif; line-height:1.4;">${m.text.replace(/\n/g, '<br>')}</p>
      </div>
    `).join('');

    const htmlContent = `
      <html>
        <head>
          <title>Manivtha Travels Chat Transcript</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; max-w: 600px; margin: 0 auto; }
            h2 { border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; color: #0f172a; }
            .footer { margin-top: 40px; font-size: 10px; color: #888; text-align: center; }
          </style>
        </head>
        <body>
          <h2>Manivtha Tours & Travels - Assistant Transcript</h2>
          <p style="font-size:11px; color:#555;">Exported on: ${new Date().toLocaleString()}</p>
          <div style="margin-top:20px;">${logs}</div>
          <div class="footer">&copy; Manivtha Tours & Travels, Hyderabad. Phone: +91 94901 02588</div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url);
    if (!w) {
      alert('Pop-up blocked. Please allow pop-ups to print the chat transcript.');
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setFeedbackStatus('Submitting...');
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      });
      setFeedbackStatus('success');
      setTimeout(() => {
        setFeedbackStatus('');
        setComment('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setFeedbackStatus('error');
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 h-[90vh] flex flex-col">
      
      {/* Page Title */}
      <div className="flex-shrink-0 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-white font-outfit flex items-center gap-3 justify-center sm:justify-start">
          <FaRobot className="text-skyAccent-400 animate-bounce" />
          AI FAQ Chat Workspace
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ask questions, calculate outstation distances, or request instant quotes.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        
        {/* Left Suggestions & Actions Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
          
          {/* FAQ Suggestions */}
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Suggested Questions</h3>
            <div className="flex flex-col gap-2">
              {quickActions.slice(0, 5).map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action)}
                  className="text-left text-xs bg-dark-900/60 hover:bg-[#202c33]/50 hover:border-skyAccent-400/30 text-slate-300 p-3 rounded-xl border border-white/5 transition-all leading-normal"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection Card */}
          <div className="p-5 rounded-2xl glass-card space-y-3">
            <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Chat Language</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'English', label: 'English' },
                { name: 'Kannada', label: 'ಕನ್ನಡ' },
                { name: 'Hindi', label: 'हिन्दी' },
                { name: 'Telugu', label: 'తెలుగు' },
                { name: 'Tamil', label: 'தமிழ்' },
                { name: 'Malayalam', label: 'മലയാളം' }
              ].map((lang) => (
                <button
                  key={lang.name}
                  onClick={() => {
                    setSelectedLanguage(lang.name);
                    localStorage.setItem('manivtha_chat_language', lang.name);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedLanguage === lang.name
                      ? 'bg-skyAccent-500/25 border-skyAccent-400 text-white shadow-lg'
                      : 'bg-dark-900/60 hover:bg-[#202c33]/50 border-white/5 text-slate-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-5 rounded-2xl glass-card space-y-3">
            <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Workspace Actions</h3>
            <button onClick={downloadPDFTranscript} className="w-full py-2 bg-dark-900 hover:bg-dark-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-white/5 flex items-center justify-center gap-2 transition-colors">
              <FaDownload /> Print / Download PDF
            </button>
            <button onClick={shareConversation} className="w-full py-2 bg-dark-900 hover:bg-dark-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-white/5 flex items-center justify-center gap-2 transition-colors">
              <FaShareAlt /> Share Chat Link
            </button>
            <button onClick={clearChat} className="w-full py-2 bg-dark-900 hover:bg-red-950/20 text-slate-300 hover:text-red-400 rounded-xl text-xs font-bold border border-white/5 flex items-center justify-center gap-2 transition-colors">
              <FaTrash /> Clear All Messages
            </button>
          </div>

        </div>

        {/* Middle WhatsApp Chat Interface */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl bg-[#0b141a] overflow-hidden border border-white/10 shadow-xl min-h-[400px] lg:min-h-0 relative">
          
          {/* Custom WhatsApp header */}
          <div className="px-4 py-3 bg-[#0b141a] border-b border-[#222e35] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-skyAccent-400">
                <FaRobot />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-outfit uppercase tracking-wide">AI Chauffeur</h4>
                <span className="text-[9px] text-[#25d366] font-semibold block -mt-0.5">active</span>
              </div>
            </div>

            <button
              onClick={toggleSpeaking}
              className={`p-2 rounded-lg hover:bg-[#202c33] transition-colors ${
                isSpeaking ? 'text-skyAccent-400' : 'text-slate-400'
              }`}
              title={isSpeaking ? 'Mute Voice' : 'Enable Voice'}
            >
              {isSpeaking ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b141a] relative flex flex-col min-h-0"
          >
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none"></div>
            
            <div className="relative z-10 flex-1 space-y-4">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex flex-col max-w-[85%] ${
                    m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div className={`p-4 rounded-xl relative group shadow ${
                    m.sender === 'user'
                      ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                      : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border border-white/5'
                  }`}>
                    {m.type === 'booking_form' ? (
                      <BookingFormWidget 
                        onSubmitSuccess={handleBookingSubmitSuccess}
                        onCancel={handleBookingCancel}
                      />
                    ) : (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    )}
                    
                    {m.sender === 'ai' && m.type !== 'booking_form' && (
                      <button
                        onClick={() => copyToClipboard(m.text)}
                        className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 p-1 text-[10px] text-slate-400 hover:text-white bg-[#0b141a]/90 rounded transition-opacity"
                      >
                        <FaRegCopy />
                      </button>
                    )}
                  </div>
                  <span className="text-[9px] text-[#8696a0] mt-1 px-1 font-mono">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-1 bg-[#202c33] border border-white/5 px-4 py-3 rounded-xl rounded-tl-none max-w-[100px] shadow animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="px-3 py-2 bg-[#111b21] border-t border-[#222e35] flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none z-10 flex-shrink-0">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1.5 bg-[#202c33] hover:bg-[#2a3942] border border-[#222e35] rounded-full text-[10px] text-[#00a884] font-bold tracking-wide transition-all"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Typing Area */}
          <div className="p-3 bg-[#111b21] border-t border-[#222e35] flex gap-2 items-center flex-shrink-0 z-10">
            <button
              onClick={startSpeechRecognition}
              className={`p-2.5 rounded-full border transition-colors ${
                isListening ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-[#202c33] text-slate-400 hover:text-white border-[#222e35]'
              }`}
              title="Voice input dictation"
            >
              <FaMicrophone />
            </button>
            <input
              type="text"
              placeholder="Type a message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 text-xs bg-[#202c33] border border-[#222e35] rounded-xl text-[#e9edef] placeholder-[#8696a0] focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-[#00a884] hover:bg-[#008f72] text-white rounded-full shadow-md active:scale-95 transition-transform"
            >
              <FaPaperPlane />
            </button>
          </div>

        </div>

        {/* Right Feedback Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto">
          
          {/* Rate Us Box */}
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Rate the AI Assistant</h3>
            
            {feedbackStatus === 'success' ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-xs flex flex-col items-center gap-2 text-center">
                <FaCheckCircle className="text-lg animate-bounce" />
                <span>Rating logged successfully! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={submitFeedback} className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`text-xl transition-all duration-150 active:scale-125 ${
                        s <= rating ? 'text-goldAccent-400' : 'text-slate-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Comments</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what was missing..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-skyAccent-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={feedbackStatus === 'Submitting...'}
                  className="w-full py-2 bg-gradient-to-r from-skyAccent-500 to-blue-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-skyAccent-400 active:scale-95 transition-transform"
                >
                  {feedbackStatus === 'Submitting...' ? 'Submitting...' : 'Submit Rating'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

const BookingFormWidget = ({ onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickupLocation: '',
    destination: '',
    pickupDate: '',
    passengerCount: 1,
    serviceType: 'Outstation Trip'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getEstimatedFareRange = () => {
    const pax = Number(formData.passengerCount);
    let minRate, maxRate, baseLabel;
    
    if (pax <= 4) {
      minRate = 12;
      maxRate = 15;
      baseLabel = 'Sedan';
    } else if (pax > 4 && pax <= 7) {
      minRate = 16;
      maxRate = 22;
      baseLabel = 'SUV';
    } else if (pax >= 8 && pax <= 16) {
      minRate = 28;
      maxRate = 32;
      baseLabel = 'Tempo';
    } else {
      minRate = 36;
      maxRate = 44;
      baseLabel = 'Multi';
    }

    if (formData.serviceType === 'Airport Transfer') {
      const minAirport = pax <= 4 ? 1200 : pax <= 7 ? 1900 : 4000;
      const maxAirport = pax <= 4 ? 1200 : pax <= 7 ? 2700 : 5000;
      return `₹${minAirport} - ₹${maxAirport} (${baseLabel})`;
    } else if (formData.serviceType === 'Local Rental') {
      const minLocal = pax <= 4 ? 2500 : pax <= 7 ? 3800 : 7500;
      const maxLocal = pax <= 4 ? 2500 : pax <= 7 ? 5000 : 7500;
      return `₹${minLocal} - ₹${maxLocal} (${baseLabel})`;
    } else {
      const minOut = minRate * 250;
      const maxOut = maxRate * 250;
      return `₹${minOut} - ₹${maxOut}/day (${baseLabel})`;
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hi Manivtha Travels, I want to book a cab:
• Name: ${formData.name || 'N/A'}
• Phone: ${formData.phone || 'N/A'}
• Pickup: ${formData.pickupLocation || 'N/A'}
• Destination: ${formData.destination || 'N/A'}
• Date: ${formData.pickupDate || 'N/A'}
• Passengers: ${formData.passengerCount}
• Service: ${formData.serviceType}`;
    const url = `https://wa.me/919490102588?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.pickupDate.trim()) {
      alert('Please fill out Name, Phone and Travel Date!');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to submit booking');
      const data = await response.json();
      onSubmitSuccess(data.data);
    } catch (error) {
      console.error(error);
      alert('Failed to submit booking enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border border-white/10 rounded-xl space-y-2 text-left w-[280px] sm:w-[320px] text-slate-300 animate-none">
      <h4 className="text-xs font-bold text-white tracking-wide border-b border-white/5 pb-1 flex justify-between items-center font-outfit">
        <span>🚖 CAB BOOKING FORM</span>
        <button type="button" onClick={onCancel} className="text-[10px] text-red-400 hover:underline font-sans font-normal">Cancel</button>
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-0.5">
          <label className="text-[8px] text-slate-500 uppercase font-semibold">Name</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-2 py-1 bg-slate-950 border border-white/5 rounded text-[11px] text-white focus:outline-none animate-none" />
        </div>
        <div className="space-y-0.5">
          <label className="text-[8px] text-slate-500 uppercase font-semibold">Phone</label>
          <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-2 py-1 bg-slate-950 border border-white/5 rounded text-[11px] text-white focus:outline-none animate-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-0.5">
          <label className="text-[8px] text-slate-500 uppercase font-semibold">Pickup Location</label>
          <input type="text" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full px-2 py-1 bg-slate-950 border border-white/5 rounded text-[11px] text-white focus:outline-none animate-none" />
        </div>
        <div className="space-y-0.5">
          <label className="text-[8px] text-slate-500 uppercase font-semibold">Destination</label>
          <input type="text" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full px-2 py-1 bg-slate-950 border border-white/5 rounded text-[11px] text-white focus:outline-none animate-none" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-0.5">
          <label className="text-[8px] text-slate-500 uppercase font-semibold">Travel Date</label>
          <input type="text" placeholder="e.g. 2026-06-30 10:00" value={formData.pickupDate} onChange={e => setFormData({...formData, pickupDate: e.target.value})} className="w-full px-1 py-1 bg-slate-950 border border-white/5 rounded text-[10px] text-white focus:outline-none animate-none" />
        </div>
        <div className="space-y-0.5">
          <label className="text-[8px] text-slate-500 uppercase font-semibold">Passengers</label>
          <input type="number" min={1} max={50} value={formData.passengerCount} onChange={e => setFormData({...formData, passengerCount: e.target.value})} className="w-full px-2 py-1 bg-slate-950 border border-white/5 rounded text-[11px] text-white focus:outline-none animate-none" />
        </div>
      </div>

      <div className="space-y-0.5">
        <label className="text-[8px] text-slate-500 uppercase font-semibold">Trip Type</label>
        <select value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full px-2 py-1 bg-slate-950 border border-white/5 rounded text-[11px] text-white focus:outline-none">
          <option value="Outstation Trip">Outstation Trip</option>
          <option value="Airport Transfer">Airport Transfer</option>
          <option value="Local Rental">Local Rental</option>
          <option value="Family Tour Package">Family Tour Package</option>
          <option value="Corporate Travel">Corporate Travel</option>
        </select>
      </div>

      <div className="p-2 bg-slate-950/80 border border-skyAccent-500/10 rounded-lg text-center space-y-0.5">
        <div className="text-[8px] text-slate-500 uppercase font-semibold">Dynamic Fare Estimate Range</div>
        <div className="text-xs font-bold text-skyAccent-400 font-mono">{getEstimatedFareRange()}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button type="submit" disabled={isSubmitting} className="w-full py-1.5 bg-skyAccent-500 hover:bg-skyAccent-400 text-white text-[10px] font-bold rounded-lg transition-colors font-sans">
          {isSubmitting ? 'Submitting...' : 'SUBMIT ENQUIRY'}
        </button>
        <button type="button" onClick={handleWhatsAppRedirect} className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 font-sans">
          WHATSAPP
        </button>
      </div>
    </form>
  );
};

export default ChatbotPage;
