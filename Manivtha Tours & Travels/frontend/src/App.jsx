import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingChatbot from './components/FloatingChatbot';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Fleet from './pages/Fleet';
import Contact from './pages/Contact';
import ChatbotPage from './pages/ChatbotPage';
import Admin from './pages/Admin';

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0a192f] text-slate-100 flex flex-col justify-between font-sans selection:bg-skyAccent-500/30 selection:text-skyAccent-400">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Page Routing */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* Global Floating AI Assistant */}
        <FloatingChatbot />

        {/* Footer info panels */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;
