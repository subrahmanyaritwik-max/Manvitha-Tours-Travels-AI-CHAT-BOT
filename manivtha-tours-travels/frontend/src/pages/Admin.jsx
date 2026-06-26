import React, { useState, useEffect } from 'react';
import { FaLock, FaUsers, FaComments, FaCalendarCheck, FaStar, FaCircle, FaUserClock, FaEye, FaTimes } from 'react-icons/fa';

const Admin = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Search and filter states for enquiries
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterService, setFilterService] = useState('All');

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [sessionTranscript, setSessionTranscript] = useState([]);
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);

  // Customer profiles state
  const [customerProfiles, setCustomerProfiles] = useState([]);
  const [isProfilesLoading, setIsProfilesLoading] = useState(false);

  // Save/Load auth session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('manivtha_admin_auth');
    if (savedAuth) {
      setPasscode(savedAuth);
      fetchAnalytics(savedAuth);
    }
  }, []);

  // Fetch relevant tab data
  useEffect(() => {
    if (isAuthorized) {
      if (activeTab === 'bookings') {
        fetchAnalytics(passcode);
      } else if (activeTab === 'chat_sessions') {
        fetchChatSessions();
      } else if (activeTab === 'customers') {
        fetchCustomerProfiles();
      }
    }
  }, [activeTab, isAuthorized]);

  const fetchAnalytics = async (passToUse) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passToUse
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authorization failed.');
      }

      setAnalytics(data);
      setIsAuthorized(true);
      sessionStorage.setItem('manivtha_admin_auth', passToUse);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Access Denied. Check passcode.');
      setIsAuthorized(false);
      sessionStorage.removeItem('manivtha_admin_auth');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatSessions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/chat-sessions`, {
        headers: { 'x-admin-passcode': passcode }
      });
      if (!response.ok) throw new Error('Failed to load chat sessions');
      const data = await response.json();
      setChatSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSessionTranscript = async (sId) => {
    setIsTranscriptLoading(true);
    setActiveSessionId(sId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/chat-sessions/${sId}`, {
        headers: { 'x-admin-passcode': passcode }
      });
      if (!response.ok) throw new Error('Failed to load transcript');
      const data = await response.json();
      setSessionTranscript(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load transcript.');
    } finally {
      setIsTranscriptLoading(false);
    }
  };

  const fetchCustomerProfiles = async () => {
    setIsProfilesLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/customer-profiles`, {
        headers: { 'x-admin-passcode': passcode }
      });
      if (!response.ok) throw new Error('Failed to load customer profiles');
      const data = await response.json();
      setCustomerProfiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProfilesLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!passcode) return;
    fetchAnalytics(passcode);
  };

  const handleLogout = () => {
    setPasscode('');
    setIsAuthorized(false);
    setAnalytics(null);
    sessionStorage.removeItem('manivtha_admin_auth');
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/enquiries/${enquiryId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status.');
      }

      // Re-fetch analytics immediately to reflect status changes and refresh summaries
      fetchAnalytics(passcode);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to update status.');
    }
  };

  // Filter logic for enquiries table
  const filteredEnquiries = (analytics?.recentEnquiries || []).filter(enq => {
    const nameMatch = !searchName || enq.name.toLowerCase().includes(searchName.toLowerCase());
    const phoneMatch = !searchPhone || enq.phone.includes(searchPhone);
    const statusMatch = filterStatus === 'All' || enq.status === filterStatus;
    const serviceMatch = filterService === 'All' || enq.serviceType === filterService;
    return nameMatch && phoneMatch && statusMatch && serviceMatch;
  });

  if (!isAuthorized) {
    return (
      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl glass-card space-y-6 text-center border border-white/10 shadow-2xl">
          <div className="p-4 bg-skyAccent-500/10 text-skyAccent-400 w-fit rounded-full mx-auto text-3xl animate-bounce">
            <FaLock />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-outfit">Admin Control Panel</h1>
            <p className="text-xs text-slate-400 mt-1">Please authenticate to access site bookings and chat logs.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/20 rounded-xl text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label htmlFor="passcode" className="text-xs font-semibold text-slate-400">Security Passcode</label>
              <input
                type="password"
                id="passcode"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2.5 text-sm glass-input rounded-xl"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-skyAccent-500 to-blue-600 hover:from-skyAccent-400 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Unlock Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-outfit font-black">Admin Control Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time statistics compiled from enquiries, Customer profiles and Gemini AI chat sessions.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg border border-red-500/20 transition-all"
        >
          Lock Dashboard
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2 pb-px">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'bookings'
              ? 'border-skyAccent-400 text-skyAccent-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          📊 Bookings & Analytics
        </button>
        <button
          onClick={() => setActiveTab('chat_sessions')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'chat_sessions'
              ? 'border-skyAccent-400 text-skyAccent-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          💬 Chat Session Logs
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'customers'
              ? 'border-skyAccent-400 text-skyAccent-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          👥 Customer Profiles
        </button>
      </div>

      {/* Content for Bookings & Analytics tab */}
      {analytics && activeTab === 'bookings' && (
        <>
          {/* Metrics Overview Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl glass-card flex items-center gap-3">
              <div className="p-2 bg-skyAccent-500/10 text-skyAccent-400 text-lg rounded-lg">
                <FaCalendarCheck />
              </div>
              <div>
                <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Total Enquiries</span>
                <span className="text-lg font-black text-white font-outfit mt-0.5">{analytics.summary.totalEnquiries}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-card flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 text-lg rounded-lg">
                <FaCircle className="text-amber-400 animate-pulse text-[8px]" />
              </div>
              <div>
                <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Pending Bookings</span>
                <span className="text-lg font-black text-white font-outfit mt-0.5">{analytics.summary.pendingBookings}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-card flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 text-lg rounded-lg">
                <FaCircle className="text-emerald-400 text-[8px]" />
              </div>
              <div>
                <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Accepted Bookings</span>
                <span className="text-lg font-black text-white font-outfit mt-0.5">{analytics.summary.acceptedBookings}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-card flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 text-lg rounded-lg">
                <FaCircle className="text-blue-400 text-[8px]" />
              </div>
              <div>
                <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Completed Trips</span>
                <span className="text-lg font-black text-white font-outfit mt-0.5">{analytics.summary.completedTrips}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-card flex items-center gap-3">
              <div className="p-2 bg-skyAccent-500/10 text-goldAccent-400 text-lg rounded-lg">
                <FaStar className="text-goldAccent-400" />
              </div>
              <div>
                <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Avg Rating</span>
                <span className="text-lg font-black text-white font-outfit mt-0.5">{analytics.summary.averageRating} <span className="text-[10px] text-slate-500 font-normal">/ 5</span></span>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-card flex items-center gap-3">
              <div className="p-2 bg-skyAccent-500/10 text-skyAccent-400 text-lg rounded-lg">
                <FaComments />
              </div>
              <div>
                <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">AI Chat Queries</span>
                <span className="text-lg font-black text-white font-outfit mt-0.5">{analytics.summary.totalChats}</span>
              </div>
            </div>
          </div>

          {/* FAQ Topics and Daily Graph placeholders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Frequently Asked Topics</h3>
              <div className="space-y-3">
                {Object.keys(analytics.topicAnalytics).length > 0 ? (
                  Object.keys(analytics.topicAnalytics).map((topic) => {
                    const count = analytics.topicAnalytics[topic];
                    const percent = Math.min(100, Math.max(10, (count / analytics.summary.totalChats) * 100));
                    return (
                      <div key={topic} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">{topic}</span>
                          <span className="text-skyAccent-400">{count} queries</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                          <div className="bg-skyAccent-400 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">No chat logs recorded yet. Start conversing with the chatbot!</p>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-4">
              <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Top User FAQ Queries</h3>
              <div className="divide-y divide-white/5 text-xs">
                {analytics.popularQuestions.length > 0 ? (
                  analytics.popularQuestions.map((item, index) => (
                    <div key={index} className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-300 capitalize">"{item.question}"</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-skyAccent-400 font-bold border border-white/5">{item.count} hits</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4">No query logs recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Enquiry Logs Table */}
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider flex items-center gap-2">
              <FaUserClock className="text-skyAccent-400" />
              Customer Booking Enquiries ({filteredEnquiries.length})
            </h3>
            
            {/* Search & Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-950/40 rounded-xl border border-white/5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search Name</label>
                <input
                  type="text"
                  placeholder="e.g. Name"
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-lg text-white focus:outline-none focus:border-skyAccent-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search Phone</label>
                <input
                  type="text"
                  placeholder="e.g. Phone"
                  value={searchPhone}
                  onChange={e => setSearchPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-lg text-white focus:outline-none focus:border-skyAccent-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filter Status</label>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-lg text-white focus:outline-none focus:border-skyAccent-400 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filter Service</label>
                <select
                  value={filterService}
                  onChange={e => setFilterService(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-lg text-white focus:outline-none focus:border-skyAccent-400 cursor-pointer"
                >
                  <option value="All">All Services</option>
                  <option value="Outstation Trip">Outstation Trip</option>
                  <option value="Airport Transfer">Airport Transfer</option>
                  <option value="Local Rental">Local Rental</option>
                  <option value="Family Tour Package">Family Tour Package</option>
                  <option value="Corporate Travel">Corporate Travel</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto border border-white/5 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-white/5 text-slate-400 font-bold">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Phone / Email</th>
                    <th className="p-4">Requested Service</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Trip Destination / Preferences</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-900/10">
                  {filteredEnquiries.length > 0 ? (
                    filteredEnquiries.map((enq) => (
                      <tr key={enq._id} className="hover:bg-white/5">
                        <td className="p-4 font-bold text-white">{enq.name}</td>
                        <td className="p-4">
                          <span className="block">{enq.phone}</span>
                          <span className="text-[10px] text-slate-500">{enq.email}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-skyAccent-500/15 border border-skyAccent-500/20 rounded-lg text-skyAccent-400 font-medium">
                            {enq.serviceType}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300 font-mono">
                          {new Date(enq.pickupDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="p-4 text-slate-400 max-w-xs truncate" title={enq.details}>
                          {enq.details}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border flex items-center gap-1.5 ${
                              enq.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              enq.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              enq.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              enq.status === 'Cancelled' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              <FaCircle className={`text-[6px] ${(enq.status === 'Pending' || !enq.status) ? 'animate-pulse' : ''}`} />
                              {enq.status || 'Pending'}
                            </span>
                            <select
                              value={enq.status || 'Pending'}
                              onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                              className="bg-slate-950 border border-white/5 hover:border-white/10 rounded-lg text-[10px] text-slate-400 py-0.5 px-1.5 focus:outline-none focus:border-skyAccent-400 cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">No enquiries match the filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chat User Feedback List */}
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider flex items-center gap-2">
              <FaEye className="text-skyAccent-400" />
              Chat Ratings & Comments ({analytics.recentFeedbacks.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.recentFeedbacks.length > 0 ? (
                analytics.recentFeedbacks.map((f) => (
                  <div key={f._id} className="p-4 rounded-xl bg-slate-950/40 border border-white/5 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-goldAccent-400 text-sm">
                        {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-normal italic">
                      {f.comment ? `"${f.comment}"` : '(No written comment)'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-slate-500">No ratings submitted yet.</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Content for Chat Session Logs tab */}
      {activeTab === 'chat_sessions' && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider flex items-center gap-2">
            <FaComments className="text-skyAccent-400" />
            Chat Conversation Logs ({chatSessions.length})
          </h3>
          
          <div className="overflow-x-auto border border-white/5 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-white/5 text-slate-400 font-bold">
                  <th className="p-4">Session ID</th>
                  <th className="p-4">Message Count</th>
                  <th className="p-4">Last Message Sneak-peek</th>
                  <th className="p-4">Last Active Time</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-900/10">
                {chatSessions.length > 0 ? (
                  chatSessions.map((sess) => (
                    <tr key={sess.sessionId} className="hover:bg-white/5">
                      <td className="p-4 font-mono font-bold text-slate-300">{sess.sessionId}</td>
                      <td className="p-4 text-slate-300">{sess.messageCount} messages</td>
                      <td className="p-4 text-slate-400 max-w-xs truncate italic" title={sess.lastMessage}>
                        "{sess.lastMessage}"
                      </td>
                      <td className="p-4 text-slate-400 font-mono">
                        {new Date(sess.lastActive).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => fetchSessionTranscript(sess.sessionId)}
                          className="px-3 py-1 bg-[#00a884]/20 border border-[#00a884]/30 rounded-lg text-[#00a884] font-bold hover:bg-[#00a884] hover:text-white transition-colors"
                        >
                          View Transcript
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">No chat sessions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content for Customer Profiles tab */}
      {activeTab === 'customers' && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider flex items-center gap-2">
            <FaUsers className="text-skyAccent-400" />
            Customer Profiles & Booking Metrics ({customerProfiles.length})
          </h3>
          
          {isProfilesLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-skyAccent-400"></div>
            </div>
          ) : customerProfiles.length > 0 ? (
            <div className="overflow-x-auto border border-white/5 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-white/5 text-slate-400 font-bold">
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Total Bookings</th>
                    <th className="p-4">Service Preferences</th>
                    <th className="p-4">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-900/10">
                  {customerProfiles.map((prof) => (
                    <tr key={prof._id || prof.phone} className="hover:bg-white/5">
                      <td className="p-4 font-bold text-white">{prof.name}</td>
                      <td className="p-4 text-slate-300">{prof.phone}</td>
                      <td className="p-4 font-bold text-skyAccent-400">{prof.bookingCount} bookings</td>
                      <td className="p-4 font-mono">
                        <div className="flex flex-wrap gap-1">
                          {(prof.preferences || []).map((pref, i) => (
                            <span key={i} className="px-2 py-0.5 bg-skyAccent-500/15 border border-skyAccent-500/20 rounded-lg text-skyAccent-400 text-[10px] font-medium font-sans">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 font-mono">
                        {new Date(prof.lastActivity).toLocaleDateString([], { dateStyle: 'medium' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12 text-xs">No customer profiles recorded yet.</p>
          )}
        </div>
      )}

      {/* Transcript Modal Overlay */}
      {activeSessionId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0b141a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[550px]">
            
            {/* Modal Header */}
            <div className="px-4 py-3 bg-[#111b21] border-b border-[#222e35] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide uppercase">Session Logs</h4>
                <span className="text-[10px] text-slate-400 font-mono font-bold">{activeSessionId}</span>
              </div>
              <button 
                onClick={() => setActiveSessionId('')} 
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#202c33] transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 relative bg-[#0b141a]">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none"></div>
              <div className="relative z-10 space-y-4 flex flex-col">
                {isTranscriptLoading ? (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs py-20">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-skyAccent-400"></div>
                  </div>
                ) : sessionTranscript.length > 0 ? (
                  sessionTranscript.map((msg, index) => (
                    <div 
                      key={index}
                      className={`flex flex-col max-w-[80%] ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className={`p-3 rounded-xl relative shadow text-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                          : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border border-white/5'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-[#8696a0] mt-1 px-1 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 text-xs py-20">No messages logged in this session.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
