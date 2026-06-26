import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCar, FaRoute, FaPlaneDeparture, FaCalendarAlt, FaUserShield, FaAward, FaHeadphonesAlt, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const stats = [
    { label: 'Happy Customers', value: '10K+', description: 'Trusting our safe rides daily.' },
    { label: 'Trips Completed', value: '15K+', description: 'Across local & outstation routes.' },
    { label: 'Professional Drivers', value: '50+', description: 'Verified & certified chauffeurs.' },
    { label: 'Fleet Vehicles', value: '30+', description: 'Sedans, SUVs & Tempo Travellers.' }
  ];

  const serviceCategories = [
    {
      title: 'Airport Transfers',
      description: 'Fixed flat rates to/from Rajiv Gandhi International Airport (RGIA). Guaranteed on-time pickups.',
      icon: <FaPlaneDeparture className="text-3xl text-skyAccent-400" />,
      price: 'From ₹1,200 flat'
    },
    {
      title: 'Outstation Trips',
      description: 'Long distance family vacations, weekend roadtrips & custom tour packages with simple per-km pricing.',
      icon: <FaRoute className="text-3xl text-skyAccent-400" />,
      price: 'From ₹12 / km'
    },
    {
      title: 'Local City Rentals',
      description: 'Flexible packages (8hr/80km or 12hr/120km) for Hyderabad sightseeing, shopping trips & corporate runs.',
      icon: <FaCar className="text-3xl text-skyAccent-400" />,
      price: 'From ₹2,500 flat'
    },
    {
      title: 'Tempo Traveller Rental',
      description: 'Spacious 14 or 17-seater Tempo Travellers. Best choice for wedding transportations and group tours.',
      icon: <FaCalendarAlt className="text-3xl text-skyAccent-400" />,
      price: 'From ₹28 / km'
    }
  ];

  const fleetTeaser = [
    {
      name: 'Swift Dzire / Toyota Etios',
      category: 'Sedan',
      seats: '4+1 Seats',
      bags: '2 Bags',
      price: '₹12/km outstation',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Maruti Suzuki Ertiga',
      category: 'SUV',
      seats: '6+1 Seats',
      bags: '3 Bags',
      price: '₹15/km outstation',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Toyota Innova Crysta',
      category: 'Premium SUV',
      seats: '7+1 Seats',
      bags: '4 Bags',
      price: '₹20/km outstation',
      image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const benefits = [
    { title: 'Professional Drivers', desc: 'Background-verified, experienced, and multilingual chauffeurs who speak Telugu, Hindi, and English.', icon: <FaUserShield /> },
    { title: '24/7 Dispatch Desk', desc: 'Round-the-clock booking support, emergency assistance, and live trackings for absolute peace of mind.', icon: <FaHeadphonesAlt /> },
    { title: 'Affordable Rates', desc: 'Transparent upfront pricing with zero hidden costs. Tolls and permits calculated on actual receipts.', icon: <FaAward /> },
    { title: 'Safe & Secure Cabs', desc: 'GPS-tracked modern fleet equipped with SOS buttons and active speed limiters for complete safety.', icon: <FaShieldAlt /> }
  ];

  const reviews = [
    { name: 'Karthik Rao', role: 'Business Consultant', text: 'I book Manivtha travels for airport transfers regularly. Chauffeurs are always punctual, cabs are spotless, and flat rates are very fair!' },
    { name: 'Srinivas Reddy', role: 'Wedding Coordinator', text: 'Hired 3 Innovas and a Tempo Traveller for a wedding. Excellent coordination. The drivers were polite and knew the Hyderabad routes perfectly.' },
    { name: 'Pooja Sharma', role: 'Software Engineer', text: 'Used their outstation package for a trip to Srisailam. The booking assistant was very helpful, and the Ertiga SUV drove comfortably on the hills.' }
  ];

  return (
    <div className="pt-20 pb-12 overflow-x-hidden">

      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_60%)]"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left space-y-6"
          >
            <span className="px-3.5 py-1.5 bg-skyAccent-500/15 border border-skyAccent-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-skyAccent-400">
              ⚡ Reliable Travel Companion in Hyderabad
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-outfit">
              Premium Chauffeur Cabs & <br />
              <span className="bg-gradient-to-r from-skyAccent-400 via-sky-300 to-goldAccent-400 bg-clip-text text-transparent">
                Outstation Travel Packages
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Experience safe, reliable, and premium transportation solutions across South India. Book Sedan, SUV, and Tempo Travellers at unbeatable, upfront rates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-gradient-to-r from-skyAccent-500 to-blue-600 hover:from-skyAccent-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-skyAccent-500/25 transition-all text-center"
              >
                Book Your Cab Now
              </Link>
              <Link
                to="/chatbot"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2"
              >
                Chat with AI Assistant
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-skyAccent-500/20 to-blue-600/20 rounded-2xl filter blur-2xl"></div>
            <img
              src="https://arunodayatravels.com/wp-content/uploads/2025/11/Luxury-tempo-traveller-1.jpeg"
              alt="Premium Car Fleet"
              className="rounded-2xl border border-white/10 shadow-2xl relative z-10 w-full object-cover h-[450px]"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="py-12 bg-dark-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="p-6 rounded-2xl glass-card text-center"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-skyAccent-400 mb-1 font-outfit">{stat.value}</div>
                <div className="text-sm font-bold text-white mb-1">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section className="py-20 bg-dark-900/50 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-widest">Our Offerings</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-outfit">Core Transportation Services</h2>
            <p className="text-sm text-slate-400">Professional chauffeur-driven trips tailored for every travel plan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((serv, i) => (
              <div key={i} className="p-6 rounded-2xl glass-card flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-skyAccent-500/10 w-fit rounded-xl">
                    {serv.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white font-outfit">{serv.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{serv.description}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium uppercase">Indicative Fare</span>
                  <span className="text-sm font-bold text-goldAccent-400">{serv.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="text-sm font-bold text-skyAccent-400 hover:text-skyAccent-500 hover:underline">
              View Detailed Services & Extra Charges →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Fleet Section */}
      <section className="py-20 bg-dark-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-widest">Our Fleet Preview</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-outfit">Choose Your Riding Companion</h2>
            <p className="text-sm text-slate-400">We offer clean and completely GPS-equipped vehicles to suit your group size.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fleetTeaser.map((car, i) => (
              <div key={i} className="rounded-2xl overflow-hidden glass-card">
                <img src={car.image} alt={car.name} className="w-full h-48 object-cover border-b border-white/5" />
                <div className="p-6 space-y-4">
                  <div>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-slate-400 uppercase font-bold tracking-wider">{car.category}</span>
                    <h3 className="text-lg font-bold text-white mt-1.5 font-outfit">{car.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <span className="bg-dark-900/50 p-2 rounded">👥 {car.seats}</span>
                    <span className="bg-dark-900/50 p-2 rounded">🧳 {car.bags}</span>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Starting Fares</span>
                      <span className="text-sm font-extrabold text-goldAccent-400">{car.price}</span>
                    </div>
                    <Link to="/contact" className="px-4 py-2 bg-white/5 hover:bg-skyAccent-500 hover:text-white border border-white/10 hover:border-skyAccent-400 text-xs font-bold rounded-lg transition-colors">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/fleet" className="px-6 py-3 border border-skyAccent-500/25 text-skyAccent-400 hover:bg-skyAccent-500/10 text-xs font-bold rounded-xl transition-all">
              Filter Cabs & Check Seat Capacities
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="py-20 bg-dark-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-widest">Core Values</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-outfit">Safe, Punctual, and Seamless Journeys</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Manivtha Tours & Travels stands out in Hyderabad through our commitment to driver vetting, clean car standards, and completely clear estimations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-2xl text-skyAccent-400 p-2 bg-skyAccent-500/10 h-fit rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-outfit">{benefit.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.15),transparent_50%)]"></div>
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"
              alt="Experienced Drivers"
              className="rounded-2xl border border-white/10 shadow-2xl relative z-10 w-full object-cover h-[450px]"
            />
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 bg-dark-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-widest">Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-outfit">What Our Guests Say</h2>
            <p className="text-sm text-slate-400">Genuine feedback from travelers who have ridden with us.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, i) => (
              <div key={i} className="p-6 rounded-2xl glass-card flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-300 italic leading-relaxed">"{rev.text}"</p>
                <div>
                  <h4 className="text-sm font-bold text-white font-outfit">{rev.name}</h4>
                  <span className="text-[10px] text-slate-500 font-medium">{rev.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contact CTA Section */}
      <section className="py-16 bg-gradient-to-r from-dark-800 to-slate-900 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white font-outfit">Need a Quick Travel Quote?</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Get instant assistance for hourly city packages, outstation itineraries, or luxury car requirements. Talk to our AI chatbot or file a booking enquiry directly.
          </p>
          <div className="flex justify-center gap-4 flex-wrap pt-2">
            <Link to="/contact" className="px-6 py-3.5 bg-gradient-to-r from-skyAccent-500 to-blue-600 hover:from-skyAccent-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg">
              Book Cab / Ask Quote
            </Link>
            <Link to="/chatbot" className="px-6 py-3.5 bg-dark-800 hover:bg-dark-750 text-skyAccent-400 border border-white/10 hover:border-skyAccent-400 text-xs font-bold uppercase tracking-wider rounded-xl">
              Ask AI Travel Assistant
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
