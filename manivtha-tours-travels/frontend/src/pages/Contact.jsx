import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaUser, FaInfoCircle } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Airport Transfer',
    pickupDate: '',
    details: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const services = [
    'Airport Transfer',
    'Outstation Roundtrip',
    'Local Hourly Rental',
    'Corporate Contract',
    'Wedding Transportation',
    'Tempo Traveller Group Rental'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error occurred');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Your booking enquiry has been submitted. Our team will contact you shortly!'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: 'Airport Transfer',
        pickupDate: '',
        details: ''
      });
    } catch (error) {
      console.error(error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to submit enquiry. Please call us directly.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-widest">Connect with Us</span>
        <h1 className="text-4xl font-extrabold text-white font-outfit">Plan Your Next Trip</h1>
        <p className="text-sm text-slate-400">
          Book cabs online or request standard route estimates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* 1. Contact Form Card */}
        <div className="p-6 sm:p-8 rounded-2xl glass-card space-y-6">
          <h2 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
            <FaCalendarAlt className="text-skyAccent-400" />
            Booking Enquiry Form
          </h2>

          {submitStatus.message && (
            <div className={`p-4 rounded-xl flex items-start gap-3 border text-sm ${
              submitStatus.type === 'success' 
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-950/60 border-red-500/30 text-red-400'
            }`}>
              {submitStatus.type === 'success' && <FaCheckCircle className="mt-0.5 flex-shrink-0 text-base" />}
              <p>{submitStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-slate-400">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-3 text-slate-500 text-xs" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm glass-input rounded-xl"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm glass-input rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-slate-400">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm glass-input rounded-xl"
                />
              </div>
            </div>

            {/* Service & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="serviceType" className="text-xs font-semibold text-slate-400">Service Category</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm glass-input rounded-xl bg-dark-900 border-white/10"
                >
                  {services.map((serv, idx) => (
                    <option key={idx} value={serv}>{serv}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="pickupDate" className="text-xs font-semibold text-slate-400">Pickup Date & Time</label>
                <input
                  type="datetime-local"
                  id="pickupDate"
                  name="pickupDate"
                  required
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm glass-input rounded-xl"
                />
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-1.5">
              <label htmlFor="details" className="text-xs font-semibold text-slate-400">Trip Destination & Details</label>
              <textarea
                id="details"
                name="details"
                required
                rows={3}
                placeholder="Mention pickup point, drop location, specific vehicle preference..."
                value={formData.details}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm glass-input rounded-xl"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-skyAccent-500 to-blue-600 hover:from-skyAccent-400 hover:to-blue-500 disabled:from-sky-800 disabled:to-blue-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Submitting request...' : 'Submit Booking Request'}
            </button>

          </form>
        </div>

        {/* 2. Contact Info & Interactive Map */}
        <div className="space-y-8 flex flex-col justify-between">
          
          {/* Details Card */}
          <div className="p-6 rounded-2xl glass-card space-y-6">
            <h3 className="text-lg font-bold text-white font-outfit">Company Coordinates</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-skyAccent-500/10 text-skyAccent-400 rounded-xl text-lg mt-1">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Registered Office</h4>
                  <p className="text-sm text-slate-200 mt-1">
                    Flat No. 302, Sai Teja Residency, Miyapur, Hyderabad, Telangana - 500049
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-skyAccent-500/10 text-skyAccent-400 rounded-xl text-lg mt-1">
                  <FaPhone />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Hotlines (24/7 Support)</h4>
                  <p className="text-sm text-slate-200 mt-1 flex flex-col">
                    <a href="tel:+919490102588" className="hover:text-skyAccent-400 transition-colors">+91 94901 02588</a>
                    <a href="tel:+918008812588" className="hover:text-skyAccent-400 transition-colors">+91 80088 12588 (Corporate)</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-skyAccent-500/10 text-skyAccent-400 rounded-xl text-lg mt-1">
                  <FaEnvelope />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Enquiries</h4>
                  <p className="text-sm text-slate-200 mt-1">
                    <a href="mailto:info@manivthatravels.com" className="hover:text-skyAccent-400 transition-colors">info@manivthatravels.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Styled Map Mockup */}
          <div className="p-6 rounded-2xl glass-card relative overflow-hidden flex-1 flex flex-col justify-center min-h-[200px]">
            <div className="absolute inset-0 bg-slate-950/70 z-0"></div>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10 text-center space-y-4 p-4">
              <FaMapMarkerAlt className="text-red-500 text-3xl mx-auto animate-bounce" />
              <div>
                <h4 className="text-base font-bold text-white font-outfit">Miyapur, Hyderabad Map</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Located near Miyapur Metro Station. Perfect dispatch point for airport runs and outstation trips across NH65.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5 bg-dark-900/80 w-fit mx-auto px-3 py-1 rounded border border-white/5">
                <FaInfoCircle className="text-skyAccent-400" />
                <span>LAT: 17.4967° N | LNG: 78.3489° E</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;
