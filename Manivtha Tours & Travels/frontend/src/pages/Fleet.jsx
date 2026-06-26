import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUserFriends, FaBriefcase, FaSnowflake, FaHeart, FaRegHeart, FaExchangeAlt, FaTimes, FaCheck } from 'react-icons/fa';

const Fleet = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const vehicles = [
    {
      id: 'dzire',
      name: 'Maruti Suzuki Dzire',
      brand: 'Maruti Suzuki',
      category: 'Sedan',
      seats: 4,
      bags: 2,
      ac: 'AC',
      price: 12,
      priceStr: '₹12/km',
      desc: 'Elegant and highly fuel-efficient sedan. Ideal for airport transfers and quick outstation drops.',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
      available: 'Available Now',
      features: ['GPS Tracker', 'Bluetooth Audio', 'Air Conditioning', 'Dual Airbags']
    },
    {
      id: 'amaze',
      name: 'Honda Amaze',
      brand: 'Honda',
      category: 'Sedan',
      seats: 4,
      bags: 2,
      ac: 'AC',
      price: 12,
      priceStr: '₹12/km',
      desc: 'Spacious sedan cabin with executive styling. High safety ratings and smooth highway stability.',
      image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=600',
      available: 'Available Now',
      features: ['GPS Tracker', 'USB Charging Port', 'AC', 'Anti-lock Braking']
    },
    {
      id: 'aura',
      name: 'Hyundai Aura',
      brand: 'Hyundai',
      category: 'Sedan',
      seats: 4,
      bags: 2,
      ac: 'AC',
      price: 12,
      priceStr: '₹12/km',
      desc: 'Modern aesthetic layout with high tech instrument panels. Excellent choice for corporate travels.',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
      available: 'Reserved',
      features: ['GPS Tracker', 'Infotainment System', 'AC', 'ISOFIX Seat Mounts']
    },
    {
      id: 'etios',
      name: 'Toyota Etios',
      brand: 'Toyota',
      category: 'Sedan',
      seats: 4,
      bags: 2,
      ac: 'AC',
      price: 12,
      priceStr: '₹12/km',
      desc: 'Legendary durability and massive rear legroom. Highly preferred for long distance commutes.',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600',
      available: 'Available Now',
      features: ['GPS Tracker', 'Spacious Boot', 'AC', 'Dual Front SRS Airbags']
    },
    {
      id: 'crysta',
      name: 'Toyota Innova Crysta',
      brand: 'Toyota',
      category: 'SUV/MPV',
      seats: 7,
      bags: 4,
      ac: 'AC',
      price: 20,
      priceStr: '₹20/km',
      desc: 'Premium highway cruiser offering supreme seating space and excellent high-speed dynamics.',
      image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=600',
      available: 'Available Now',
      features: ['GPS Tracker', 'WiFi Hotspot', 'Automatic Dual AC', 'Premium Audio Speakers', 'Captain Chairs']
    },
    {
      id: 'hycross',
      name: 'Toyota Innova Hycross',
      brand: 'Toyota',
      category: 'SUV/MPV',
      seats: 7,
      bags: 4,
      ac: 'AC',
      price: 22,
      priceStr: '₹22/km',
      desc: 'Luxury hybrid SUV with ultra-quiet drive and panoramic views. Best choice for premium business transits.',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600',
      available: 'Available Now',
      features: ['GPS Tracker', 'Hybrid Drive', 'Panoramic Sunroof', 'Dual Zone Climate', 'ADAS Safety Tech']
    },
    {
      id: 'xuv700',
      name: 'Mahindra XUV700',
      brand: 'Mahindra',
      category: 'SUV/MPV',
      seats: 7,
      bags: 3,
      ac: 'AC',
      price: 18,
      priceStr: '₹18/km',
      desc: 'Smart SUV loaded with active safety and high power torque. Superb for off-road tour Packages.',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
      available: 'Reserved',
      features: ['GPS Tracker', 'Touchscreen Infotainment', 'AC', 'Hill Hold Assist']
    },
    {
      id: 'carens',
      name: 'Kia Carens',
      brand: 'Kia',
      category: 'SUV/MPV',
      seats: 6,
      bags: 3,
      ac: 'AC',
      price: 16,
      priceStr: '₹16/km',
      desc: 'Spacious family MPV with clean third-row seats accessibility. Highly economic group rates.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
      available: 'Available Now',
      features: ['GPS Tracker', 'Smart Air Purifier', 'AC', 'All Wheel Disc Brakes']
    },

    {
      id: 'tt17',
      name: 'Tempo Traveller 17 Seater',
      brand: 'Force Motors',
      category: 'Group Travel',
      seats: 17,
      bags: 15,
      ac: 'AC',
      price: 28,
      priceStr: '₹28/km',
      desc: 'Extended high-roof traveller. Safest option for large pilgrimage outings and family marriage group pickups.',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
      available: 'Available Now',
      features: ['GPS Tracker', 'Entertainment Screen', 'Heavy Carrier', 'Wide Step Entrance']
    }
  ];

  // Load favorites
  useEffect(() => {
    const savedFavs = localStorage.getItem('manivtha_fav_vehicles');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  const toggleFavorite = (id) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(fav => fav !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('manivtha_fav_vehicles', JSON.stringify(updated));
  };

  const toggleCompare = (vehicle) => {
    if (compareList.some(item => item.id === vehicle.id)) {
      setCompareList(compareList.filter(item => item.id !== vehicle.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 vehicles at a time.');
        return;
      }
      setCompareList([...compareList, vehicle]);
    }
  };

  const handleFilter = (category) => {
    setActiveFilter(category);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Filter, Search, Sort Logic
  const getProcessedVehicles = () => {
    let result = [...vehicles];

    // Filter
    if (activeFilter !== 'All') {
      result = result.filter(v => v.category === activeFilter);
    }

    // Search
    if (searchQuery.trim() !== '') {
      result = result.filter(v => 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'capacity') {
      result.sort((a, b) => a.seats - b.seats);
    }

    return result;
  };

  const processedVehicles = getProcessedVehicles();

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-widest">Our Fleet Matrix</span>
        <h1 className="text-4xl font-extrabold text-white font-outfit">Premium Chauffeur Fleets</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Select from our 9 brand-certified sedans, family SUVs, hybrid carriers, and Tempo Travellers. Compare specifications side-by-side.
        </p>
      </div>

      {/* 2. Search, Category Filters, and Sort Panel */}
      <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-white/5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between shadow-lg">
        
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <FaSearch className="absolute left-3.5 top-3 text-slate-500 text-sm" />
          <input
            type="text"
            placeholder="Search model, brand name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl text-white focus:outline-none focus:border-skyAccent-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Sedan', 'SUV/MPV', 'Group Travel'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                activeFilter === cat
                  ? 'bg-skyAccent-500 text-white shadow-md shadow-skyAccent-500/20'
                  : 'bg-dark-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 lg:flex-none px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-skyAccent-400 font-medium"
          >
            <option value="default">Default Catalog</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="capacity">Passenger Capacity</option>
          </select>
        </div>

      </div>

      {/* 3. Cards Grid (Desktop = 4 columns, Tablet = 2, Mobile = 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {processedVehicles.map((veh) => {
          const isFavorite = favorites.includes(veh.id);
          const isCompared = compareList.some(item => item.id === veh.id);

          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              key={veh.id}
              className="rounded-2xl overflow-hidden glass-card flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300"
            >
              {/* Image & Badges */}
              <div className="relative overflow-hidden">
                <img 
                  src={veh.image} 
                  alt={veh.name} 
                  className="w-full h-44 object-cover border-b border-white/5 group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Available Badge */}
                <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shadow ${
                  veh.available === 'Available Now' 
                    ? 'bg-emerald-950/80 border border-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-950/80 border border-amber-500/20 text-amber-400'
                }`}>
                  {veh.available}
                </span>

                {/* Favorite Toggle Button */}
                <button
                  onClick={() => toggleFavorite(veh.id)}
                  className="absolute top-3 right-3 p-2 bg-dark-900/60 backdrop-blur-md hover:bg-dark-900 text-slate-300 rounded-full border border-white/10 transition-colors"
                  aria-label="Favorite vehicle"
                >
                  {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{veh.brand}</span>
                    <h3 className="text-sm font-bold text-white font-outfit mt-0.5 tracking-wide leading-tight group-hover:text-skyAccent-400 transition-colors">
                      {veh.name}
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal min-h-[44px]">
                    {veh.desc}
                  </p>

                  {/* Seating and Luggage */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300">
                    <span className="flex items-center gap-1.5 bg-dark-900/50 p-2 rounded border border-white/5">
                      <FaUserFriends className="text-skyAccent-400" />
                      {veh.seats} Pax
                    </span>
                    <span className="flex items-center gap-1.5 bg-dark-900/50 p-2 rounded border border-white/5">
                      <FaBriefcase className="text-skyAccent-400" />
                      {veh.bags} Bags ({veh.ac})
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Base Rate</span>
                    <span className="font-extrabold text-goldAccent-400 text-sm">
                      {veh.priceStr}
                    </span>
                  </div>

                  {/* Card CTAs */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => { setSelectedVehicle(veh) }}
                      className="py-1.5 border border-white/10 hover:border-skyAccent-400/50 text-[10px] font-bold rounded-lg text-slate-300 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                    <Link
                      to="/contact"
                      className="py-1.5 bg-gradient-to-tr from-skyAccent-500 to-blue-600 hover:from-skyAccent-400 hover:to-blue-500 text-white text-[10px] font-bold rounded-lg text-center shadow"
                    >
                      Book Now
                    </Link>
                  </div>

                  {/* Compare checkbox */}
                  <label className="flex items-center justify-center gap-1.5 text-[9px] text-slate-500 hover:text-slate-300 select-none cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleCompare(veh)}
                      className="rounded border-white/10 text-skyAccent-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Add to Comparison</span>
                  </label>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. Compare Drawer (Slides in from bottom if >0 checked) */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-md border-t border-white/10 py-4 px-6 z-40 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-skyAccent-500/10 text-skyAccent-400 rounded-lg text-sm">
                <FaExchangeAlt />
              </span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wide">Vehicle Comparison Bar</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Select up to 3 vehicles ({compareList.length} selected)</p>
              </div>
            </div>

            {/* Compared Models list */}
            <div className="flex gap-2 flex-wrap">
              {compareList.map((item) => (
                <div key={item.id} className="flex items-center gap-1.5 px-3 py-1 bg-dark-800 rounded-lg text-[10px] border border-white/5">
                  <span className="text-slate-200">{item.name}</span>
                  <button onClick={() => toggleCompare(item)} className="text-slate-500 hover:text-red-400">
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowCompareModal(true)} 
                disabled={compareList.length < 2}
                className="px-5 py-2 bg-skyAccent-500 hover:bg-skyAccent-400 disabled:opacity-50 text-white text-[10px] font-extrabold uppercase rounded-lg shadow-md transition-colors"
              >
                Compare Now
              </button>
              <button onClick={clearCompare} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-bold rounded-lg border border-white/5">
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Detailed Vehicle Info Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl glass-card border border-white/10 shadow-2xl overflow-hidden animate-fade-in relative flex flex-col max-h-[90vh]">
            {/* Header image */}
            <div className="relative">
              <img src={selectedVehicle.image} alt={selectedVehicle.name} className="w-full h-56 object-cover" />
              <button
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-4 right-4 p-2 bg-dark-900/80 backdrop-blur-md rounded-full text-slate-400 hover:text-white border border-white/10 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Details content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-[10px] text-skyAccent-400 font-extrabold uppercase tracking-wider">{selectedVehicle.brand}</span>
                <h3 className="text-xl font-bold text-white font-outfit mt-0.5">{selectedVehicle.name}</h3>
                <span className="text-[10px] text-slate-500 italic mt-0.5 block">{selectedVehicle.category}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedVehicle.desc}
              </p>

              {/* Detailed specification table */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-2 border-r border-white/5 pr-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Seating Capacity</span>
                    <span className="font-bold text-white">{selectedVehicle.seats} Pax</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Luggage Space</span>
                    <span className="font-bold text-white">{selectedVehicle.bags} Bags</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AC / Ventilation</span>
                    <span className="font-bold text-white">{selectedVehicle.ac} Only</span>
                  </div>
                </div>

                <div className="space-y-2 pl-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Tariff</span>
                    <span className="font-bold text-goldAccent-400">{selectedVehicle.priceStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Outstation Minimum</span>
                    <span className="font-bold text-white">250 km/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className="font-bold text-emerald-400">{selectedVehicle.available}</span>
                  </div>
                </div>
              </div>

              {/* Core Features bullets */}
              <div className="space-y-1.5 pt-2">
                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Included Amenities</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVehicle.features.map((f, i) => (
                    <span key={i} className="text-[10px] bg-skyAccent-500/15 border border-skyAccent-500/20 text-skyAccent-400 px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <FaCheck className="text-[8px]" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer action button */}
              <div className="pt-4 border-t border-white/5">
                <Link
                  to="/contact"
                  onClick={() => setSelectedVehicle(null)}
                  className="block w-full py-3 bg-gradient-to-r from-skyAccent-500 to-blue-600 hover:from-skyAccent-400 hover:to-blue-500 text-white text-xs font-extrabold uppercase tracking-widest text-center rounded-xl shadow-lg"
                >
                  Book Chauffeur Ride
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Comparison Modal (Side-by-side Table format) */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl glass-card border border-white/10 shadow-2xl p-6 overflow-hidden animate-fade-in relative flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/5">
              <h3 className="text-lg font-bold text-white font-outfit uppercase tracking-wider flex items-center gap-2">
                <FaExchangeAlt className="text-skyAccent-400" />
                Vehicle Spec Comparison
              </h3>
              <button 
                onClick={() => setShowCompareModal(false)} 
                className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/5"
              >
                <FaTimes />
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="p-3">Specification</th>
                    {compareList.map(item => (
                      <th key={item.id} className="p-3 text-white text-center font-outfit font-bold">{item.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  
                  {/* Image */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400">Preview</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center">
                        <img src={item.image} alt={item.name} className="w-24 h-16 object-cover rounded-lg mx-auto border border-white/5" />
                      </td>
                    ))}
                  </tr>

                  {/* Brand */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400 font-outfit">Company Brand</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center text-slate-200 font-semibold">{item.brand}</td>
                    ))}
                  </tr>

                  {/* Capacity */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400">Seat Capacity</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center text-slate-200 font-bold">{item.seats} Passengers</td>
                    ))}
                  </tr>

                  {/* Luggage */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400">Luggage Limit</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center text-slate-200">{item.bags} Medium Bags</td>
                    ))}
                  </tr>

                  {/* Tariff */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400">Base Tarif Rate</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center text-goldAccent-400 font-black text-sm">{item.priceStr}</td>
                    ))}
                  </tr>

                  {/* Availability */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400">Availability</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center">
                        <span className={`text-[10px] font-bold ${
                          item.available === 'Available Now' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {item.available}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* AC Status */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400">Cabin Comfort</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center text-slate-200">Air Conditioned ({item.ac})</td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/5 flex justify-end gap-2">
              <button 
                onClick={() => setShowCompareModal(false)} 
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl border border-white/5 text-[10px]"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Fleet;
