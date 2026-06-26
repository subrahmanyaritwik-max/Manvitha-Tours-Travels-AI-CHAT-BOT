import React from 'react';
import { FaEye, FaFlag, FaHandsHelping, FaUserCheck } from 'react-icons/fa';

const About = () => {
  const values = [
    { title: 'Customer First', desc: 'Ensuring punctual arrivals, comfortable vehicles, and respectful driver conduct at all times.', icon: <FaHandsHelping /> },
    { title: 'Driver Standards', desc: 'Every driver undergoes strict background audits, route knowledge evaluations, and behavior training.', icon: <FaUserCheck /> }
  ];

  const milestones = [
    { year: '2019', title: 'Company Founded', desc: 'Started with 3 local taxis providing airport transfers in Miyapur, Hyderabad.' },
    { year: '2021', title: 'Corporate Expansions', desc: 'Signed service contracts with local software houses, expanding our sedan fleet to 15+ cabs.' },
    { year: '2023', title: 'Group Tours Launch', desc: 'Introduced 17-seater Tempo Travellers for outstation pilgrimages and wedding hires.' },
    { year: '2025', title: 'AI Assistant & Digital Booking', desc: 'Integrated state-of-the-art AI chatbot to support instant fare estimations and booking guidance 24/7.' }
  ];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* 1. Header & Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-widest">About Manivtha Travels</span>
          <h1 className="text-4xl font-extrabold text-white font-outfit">Our Journey in Hyderabad</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Established in the heart of Hyderabad, Manivtha Tours & Travels has grown from a local airport cab service into a comprehensive logistics provider. Today, we manage a diverse fleet of pristine sedans, family SUVs, premium Innova Crystas, and heavy-duty Tempo Travellers.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            We understand that travel is more than just reaching a destination; it's about comfort, safety, and reliability. That's why we recruit skilled chauffeurs who understand Hyderabad routes inside out and keep our cars maintained to the highest safety and emissions compliance.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-skyAccent-500/10 to-blue-500/10 rounded-2xl filter blur-xl"></div>
          <img 
            src="https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=800" 
            alt="Hyderabad Charminar Sightseeing" 
            className="rounded-2xl border border-white/10 shadow-2xl relative z-10 w-full object-cover h-[380px]"
          />
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl glass-card space-y-4">
          <div className="p-3 bg-skyAccent-500/15 text-skyAccent-400 w-fit rounded-xl text-2xl">
            <FaFlag />
          </div>
          <h2 className="text-xl font-bold text-white font-outfit">Our Mission</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            To provide safe, transparently priced, and extremely reliable transport services to travelers in Hyderabad and surrounding states, helping groups, corporate workers, and families travel with comfort and absolute peace of mind.
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-card space-y-4">
          <div className="p-3 bg-goldAccent-500/15 text-goldAccent-400 w-fit rounded-xl text-2xl">
            <FaEye />
          </div>
          <h2 className="text-xl font-bold text-white font-outfit">Our Vision</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            To become Hyderabad's most trusted travel partner for corporate contracts, airport transits, and outstation pilgrimages, leading the market with digital booking interfaces, live tracking systems, and excellent driver standards.
          </p>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="space-y-8 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-widest">Our Foundation</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-outfit">What We Stand For</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((v, i) => (
            <div key={i} className="p-6 rounded-2xl glass-card text-left flex gap-4 items-start">
              <div className="text-2xl text-skyAccent-400 p-2.5 bg-skyAccent-500/10 rounded-xl">
                {v.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white font-outfit">{v.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Timeline Milestones */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-widest">Timeline</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-outfit">Milestones & Achievements</h2>
        </div>

        <div className="relative border-l border-white/10 max-w-3xl mx-auto pl-6 sm:pl-8 space-y-8">
          {milestones.map((m, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-skyAccent-500 border-4 border-dark-900 shadow"></div>
              
              <div className="p-5 rounded-xl bg-dark-800/60 border border-white/5 space-y-2">
                <span className="text-xs font-extrabold text-goldAccent-400 font-outfit">{m.year}</span>
                <h4 className="text-sm font-bold text-white font-outfit">{m.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
