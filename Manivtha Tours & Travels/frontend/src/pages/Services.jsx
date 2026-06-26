import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlaneArrival, FaMapMarkedAlt, FaBriefcase, FaGlassCheers, FaUsers, FaCarSide } from 'react-icons/fa';

const Services = () => {
  const categories = [
    {
      title: 'Airport Transfers (RGIA)',
      icon: <FaPlaneArrival />,
      desc: 'Reliable airport pickups and drops to/from Rajiv Gandhi International Airport. Flight delay trackings included.',
      packages: [
        { vehicle: 'Sedan (Dzire/Etios)', price: '₹1,200 flat' },
        { vehicle: 'SUV (Ertiga)', price: '₹1,800 flat' },
        { vehicle: 'Premium SUV (Innova Crysta)', price: '₹2,400 flat' }
      ]
    },
    {
      title: 'Outstation Tours',
      icon: <FaMapMarkedAlt />,
      desc: 'Intercity roundtrips and tour plans. Minimum billing of 250 kilometers per day, with clear per-km parameters.',
      packages: [
        { vehicle: 'Sedan (Dzire/Etios)', price: '₹12 / km' },
        { vehicle: 'SUV (Ertiga)', price: '₹15 / km' },
        { vehicle: 'Premium SUV (Innova Crysta)', price: '₹20 / km' },
        { vehicle: 'Tempo Traveller', price: '₹25 / km' }
      ]
    },
    {
      title: 'Local Hourly Rentals',
      icon: <FaCarSide />,
      desc: 'Hourly rental packages for city travel, wedding shopping, sightseeing, or multiple business meetings.',
      packages: [
        { vehicle: 'Sedan (Dzire/Etios)', price: '₹2,500 (8hr/80km)' },
        { vehicle: 'SUV (Ertiga)', price: '₹3,500 (8hr/80km)' },
        { vehicle: 'Premium SUV (Innova Crysta)', price: '₹4,500 (8hr/80km)' },
        { vehicle: 'Tempo Traveller', price: '₹6,500 (8hr/80km)' }
      ]
    },
    {
      title: 'Corporate Travel Contracts',
      icon: <FaBriefcase />,
      desc: 'Long-term contracts for software firms and executive teams. GPS telemetry trackers and monthly invoices.',
      packages: [
        { vehicle: 'Sedan (Daily Route)', price: 'Custom Quote' },
        { vehicle: 'SUV (Chauffeur Service)', price: 'Custom Quote' },
        { vehicle: 'Tempo Traveller (Staff Bus)', price: 'Custom Quote' }
      ]
    },
    {
      title: 'Wedding & Event Transport',
      icon: <FaGlassCheers />,
      desc: 'Coordinate arrivals for family and VIPs. Premium luxury white cars decorated with florist layouts on request.',
      packages: [
        { vehicle: 'Innova Crysta (Full Day)', price: '₹6,000 flat' },
        { vehicle: 'Tempo Traveller (Guest Bus)', price: '₹8,500 flat' },
        { vehicle: 'Luxury Sedans', price: 'Contact For Price' }
      ]
    },
    {
      title: 'Group Excursions & Pilgrimages',
      icon: <FaUsers />,
      desc: 'Safe group travel to Tirupati, Srisailam, Yadadri, or Shirdi. Heavy luggage carriers and spacious legroom.',
      packages: [
        { vehicle: '14-Seater Tempo Traveller', price: '₹26/km' },
        { vehicle: '17-Seater Tempo Traveller', price: '₹28/km' }
      ]
    }
  ];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-widest">Our Service Suite</span>
        <h1 className="text-4xl font-extrabold text-white font-outfit">Fares, Packages & Offerings</h1>
        <p className="text-sm text-slate-300">
          Transparent rates. Professional chauffeurs. Zero surprise charges.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="p-6 rounded-2xl glass-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-3xl text-skyAccent-400 p-3 bg-skyAccent-500/10 w-fit rounded-xl">
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-white font-outfit">{cat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
            </div>

            {/* Fares list */}
            <div className="space-y-2 pt-4 border-t border-white/5">
              <span className="block text-[10px] text-slate-500 uppercase font-semibold mb-2">Base Package Fares</span>
              {cat.packages.map((pkg, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">{pkg.vehicle}</span>
                  <span className="font-bold text-goldAccent-400">{pkg.price}</span>
                </div>
              ))}
            </div>

            <Link
              to="/contact"
              className="block w-full py-2.5 bg-white/5 hover:bg-skyAccent-500 hover:text-white border border-white/10 hover:border-skyAccent-400 text-center text-xs font-bold rounded-xl transition-all"
            >
              Inquire / Request Booking
            </Link>
          </div>
        ))}
      </div>

      {/* Terms & Allowances Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-dark-800 to-slate-900 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white font-outfit">Travel Terms & Allowances</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            To maintain full transparency, all secondary driving allowances and state boundary limits are outlined below:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>• **Driver Outstation Allowance:** ₹300 per calendar day.</li>
            <li>• **Night Allowance:** ₹500 (if driving between 10:00 PM and 6:00 AM).</li>
            <li>• **Outstation Minimum Limit:** Minimum 250 kilometers per day will be charged.</li>
            <li>• **Actuals Billable:** Toll gate receipts, parking receipts, and state permit taxes are paid directly by the client.</li>
          </ul>
        </div>
        
        <div className="p-6 bg-slate-950/60 rounded-xl space-y-4 border border-white/5 text-center md:text-left">
          <h4 className="text-sm font-bold text-white font-outfit">Need a custom corporate plan or multi-city estimate?</h4>
          <p className="text-xs text-slate-400">
            Talk to our AI chatbot instantly for immediate responses, or fill out our contact booking enquiry form to receive a quote by email.
          </p>
          <div className="flex justify-center md:justify-start gap-3">
            <Link to="/chatbot" className="px-4 py-2 bg-skyAccent-500 hover:bg-skyAccent-400 text-white text-xs font-bold rounded-lg transition-colors">
              Chat With AI
            </Link>
            <a href="tel:+919490102588" className="px-4 py-2 bg-dark-800 border border-white/10 text-slate-300 text-xs font-bold rounded-lg hover:text-white transition-colors">
              Call Hotline
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Services;
