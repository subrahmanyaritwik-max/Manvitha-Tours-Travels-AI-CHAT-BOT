const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');
const storage = require('../utils/storage');
const { SYSTEM_PROMPT, detectTopic, getFallbackResponse } = require('../utils/geminiContext');

// Models
const Enquiry = require('../models/Enquiry');
const ChatLog = require('../models/ChatLog');
const Feedback = require('../models/Feedback');

// Middleware to check admin passcode
const requireAdmin = (req, res, next) => {
  const passcode = req.headers['x-admin-passcode'];
  const expectedPasscode = process.env.ADMIN_PASSCODE || 'admin123';
  if (passcode !== expectedPasscode) {
    return res.status(401).json({ error: 'Unauthorized. Invalid admin passcode.' });
  }
  next();
};

/* ==========================================================================
   AI FAQ CHATBOT ROUTE
   ========================================================================== */
router.post('/chat', async (req, res) => {
  const { message, chatHistory, language = 'English', sessionId } = req.body;
  const finalSessionId = sessionId || 'session_' + Date.now().toString(36);

  if (!message) {
    return res.status(400).json({ error: 'Message field is required.' });
  }

  const topic = detectTopic(message);
  let aiResponseText = '';

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    // API key not set, use local fallback
    console.log(`🤖 Gemini Key missing. Using local rule-based response in language: ${language}.`);
    aiResponseText = getFallbackResponse(message, language);
  } else {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const systemInstructionWithLanguage = `${SYSTEM_PROMPT}\nCRITICAL: The user has selected the language: "${language}". You MUST respond ONLY in "${language}". Maintain the exact same professional behavior, travel info, and vehicle recommendation details, but express everything in "${language}". Do not mix multiple languages.`;
      
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: systemInstructionWithLanguage,
      });

      // Simple generation or session context
      let contextPrompt = '';
      if (chatHistory && chatHistory.length > 0) {
        // Append last 4 messages to keep context without exceeding limits
        const historyText = chatHistory.slice(-4).map(msg => 
          `${msg.sender === 'user' ? 'Customer' : 'Assistant'}: ${msg.text}`
        ).join('\n');
        contextPrompt = `${historyText}\nCustomer: ${message}\nAssistant:`;
      } else {
        contextPrompt = message;
      }

      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      aiResponseText = response.text();
    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);
      // Failover to local responses
      aiResponseText = getFallbackResponse(message, language);
    }
  }

  // Save conversation log for dashboard analytics
  const logData = {
    sessionId: finalSessionId,
    userMessage: message,
    aiResponse: aiResponseText,
    topic: topic,
  };

  try {
    if (db.isFallback()) {
      storage.save('chatlogs', logData);
    } else {
      const chatLog = new ChatLog(logData);
      await chatLog.save();
    }
  } catch (err) {
    console.error('Error logging chat exchange:', err.message);
  }

  res.json({
    response: aiResponseText,
    topic: topic,
    timestamp: new Date().toISOString()
  });
});

/* ==========================================================================
   BOOKING ENQUIRIES ROUTES
   ========================================================================== */
router.post('/enquiries', async (req, res) => {
  const { 
    name, 
    email = 'N/A', 
    phone, 
    serviceType, 
    pickupDate, 
    pickupLocation = '', 
    destination = '', 
    passengerCount = 1, 
    details 
  } = req.body;

  if (!name || !phone || !pickupDate) {
    return res.status(400).json({ error: 'Name, Phone, and Pickup Date are required.' });
  }

  // Smart Categorization
  let resolvedServiceType = serviceType;
  if (!resolvedServiceType) {
    const textToAnalyze = `${pickupLocation} ${destination} ${details || ''}`.toLowerCase();
    if (passengerCount >= 8) {
      resolvedServiceType = 'Family Tour Package';
    } else if (textToAnalyze.includes('airport') || textToAnalyze.includes('rgia') || textToAnalyze.includes('shamshabad')) {
      resolvedServiceType = 'Airport Transfer';
    } else if (textToAnalyze.includes('corporate') || textToAnalyze.includes('office') || textToAnalyze.includes('contract') || textToAnalyze.includes('business')) {
      resolvedServiceType = 'Corporate Travel';
    } else if (textToAnalyze.includes('local') || textToAnalyze.includes('hourly') || textToAnalyze.includes('8hr') || textToAnalyze.includes('rent')) {
      resolvedServiceType = 'Local Rental';
    } else {
      resolvedServiceType = 'Outstation Trip';
    }
  }

  const resolvedDetails = details || `Chatbot Booking: Pickup from "${pickupLocation}" to "${destination}" for ${passengerCount} passengers.`;

  const enquiryData = { 
    name, 
    email, 
    phone, 
    serviceType: resolvedServiceType, 
    pickupDate, 
    pickupLocation, 
    destination, 
    passengerCount: Number(passengerCount), 
    details: resolvedDetails,
    status: 'Pending'
  };

  try {
    // Save/Update Customer Profile
    const profileData = {
      name,
      phone,
      preferences: [resolvedServiceType],
      lastActivity: new Date()
    };

    const CustomerProfile = require('../models/CustomerProfile');
    if (db.isFallback()) {
      const existing = storage.find('customerprofiles', { phone })[0];
      if (existing) {
        const prefs = Array.from(new Set([...(existing.preferences || []), resolvedServiceType]));
        storage.update('customerprofiles', existing._id, {
          name,
          bookingCount: (existing.bookingCount || 1) + 1,
          preferences: prefs,
          lastActivity: new Date()
        });
      } else {
        storage.save('customerprofiles', { ...profileData, bookingCount: 1 });
      }
    } else {
      await CustomerProfile.findOneAndUpdate(
        { phone },
        {
          $set: { name, lastActivity: new Date() },
          $inc: { bookingCount: 1 },
          $addToSet: { preferences: resolvedServiceType }
        },
        { upsert: true, new: true }
      );
    }

    // Save Enquiry
    let savedEnquiry;
    if (db.isFallback()) {
      savedEnquiry = storage.save('enquiries', enquiryData);
    } else {
      const enquiry = new Enquiry(enquiryData);
      savedEnquiry = await enquiry.save();
    }

    // Email notifications (mock logs)
    console.log(`
============================================================
[MOCK EMAIL SENT]
To: ${email !== 'N/A' ? email : 'customer@email.com'}
Subject: Booking Enquiry Confirmation - Manivtha Travels
Body: Dear ${name}, we have received your booking enquiry for ${resolvedServiceType}. 
      Pickup Date: ${pickupDate}
      Details: ${resolvedDetails}
      Status: Pending
      We will contact you shortly at ${phone}.
============================================================
    `);

    console.log(`
============================================================
[MOCK EMAIL SENT]
To: admin@manivthatravels.com
Subject: ALERT: New Booking Request Received
Body: A new booking request has been submitted by ${name} (${phone}).
      Service: ${resolvedServiceType}
      Details: ${resolvedDetails}
============================================================
    `);

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully!', data: savedEnquiry });
  } catch (error) {
    console.error('❌ Error saving enquiry:', error.message);
    res.status(500).json({ error: 'Failed to submit enquiry. Please try again later.' });
  }
});

// Admin get all enquiries
router.get('/enquiries', requireAdmin, async (req, res) => {
  try {
    let enquiries;
    if (db.isFallback()) {
      enquiries = storage.findAll('enquiries');
    } else {
      enquiries = await Enquiry.find().sort({ createdAt: -1 });
    }
    res.json(enquiries);
  } catch (error) {
    console.error('❌ Error fetching enquiries:', error.message);
    res.status(500).json({ error: 'Failed to retrieve enquiries.' });
  }
});

// Admin update enquiry status
router.patch('/enquiries/:id/status', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Accepted', 'Completed', 'Cancelled', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  try {
    let updatedEnquiry;
    if (db.isFallback()) {
      updatedEnquiry = storage.update('enquiries', id, { status });
      if (!updatedEnquiry) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }
    } else {
      updatedEnquiry = await Enquiry.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );
      if (!updatedEnquiry) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }
    }

    res.json({ success: true, message: 'Enquiry status updated successfully!', data: updatedEnquiry });
  } catch (error) {
    console.error('❌ Error updating enquiry status:', error.message);
    res.status(500).json({ error: 'Failed to update enquiry status.' });
  }
});

/* ==========================================================================
   FEEDBACK ROUTES
   ========================================================================== */
router.post('/feedback', async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }

  const feedbackData = { rating: Number(rating), comment: comment || '' };

  try {
    let savedFeedback;
    if (db.isFallback()) {
      savedFeedback = storage.save('feedbacks', feedbackData);
    } else {
      const feedback = new Feedback(feedbackData);
      savedFeedback = await feedback.save();
    }
    res.status(201).json({ success: true, message: 'Feedback submitted. Thank you!', data: savedFeedback });
  } catch (error) {
    console.error('❌ Error saving feedback:', error.message);
    res.status(500).json({ error: 'Failed to save feedback.' });
  }
});

/* ==========================================================================
   ADMIN ANALYTICS ROUTE
   ========================================================================== */
router.get('/analytics', requireAdmin, async (req, res) => {
  try {
    let chatlogs = [];
    let enquiries = [];
    let feedbacks = [];

    if (db.isFallback()) {
      chatlogs = storage.findAll('chatlogs');
      enquiries = storage.findAll('enquiries');
      feedbacks = storage.findAll('feedbacks');
    } else {
      chatlogs = await ChatLog.find();
      enquiries = await Enquiry.find().sort({ createdAt: -1 });
      feedbacks = await Feedback.find();
    }

    // Calculations
    const totalEnquiries = enquiries.length;
    const pendingBookings = enquiries.filter(e => e.status === 'Pending' || !e.status).length;
    const acceptedBookings = enquiries.filter(e => e.status === 'Accepted').length;
    const completedTrips = enquiries.filter(e => e.status === 'Completed').length;
    
    const totalChats = chatlogs.length;
    const totalFeedbacks = feedbacks.length;
    
    // Average Rating
    const avgRating = totalFeedbacks > 0 
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks).toFixed(1)
      : '4.8'; // Default high rating baseline if no reviews logged

    // Topic distribution
    const topics = {};
    chatlogs.forEach(log => {
      topics[log.topic] = (topics[log.topic] || 0) + 1;
    });

    // Daily Requests volume for last 7 days
    const dailyVolume = {};
    const dateOptions = { month: 'short', day: 'numeric' };
    
    // Seed last 7 days with 0 to make chart look complete
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', dateOptions);
      dailyVolume[dateStr] = 0;
    }

    chatlogs.forEach(log => {
      const logDate = new Date(log.createdAt).toLocaleDateString('en-US', dateOptions);
      if (dailyVolume[logDate] !== undefined) {
        dailyVolume[logDate] += 1;
      }
    });

    const dailyData = Object.keys(dailyVolume).map(key => ({
      date: key,
      count: dailyVolume[key]
    }));

    // Top questions list (most common user messages - simple grouping)
    const questionsFreq = {};
    chatlogs.forEach(log => {
      const cleanMsg = log.userMessage.trim().replace(/[?.,]/g, '').toLowerCase();
      questionsFreq[cleanMsg] = (questionsFreq[cleanMsg] || 0) + 1;
    });

    const popularQuestions = Object.keys(questionsFreq)
      .map(q => ({ question: q, count: questionsFreq[q] }))
      .sort((a, b) => b.count - a.count);

    res.json({
      summary: {
        totalEnquiries,
        pendingBookings,
        acceptedBookings,
        completedTrips,
        averageRating: parseFloat(avgRating),
        totalChats
      },
      topicAnalytics: topics,
      dailyAnalytics: dailyData,
      popularQuestions,
      recentEnquiries: enquiries, // Return all enquiries for filter & search
      recentFeedbacks: feedbacks.slice(0, 10)
    });
  } catch (error) {
    console.error('❌ Error aggregating analytics:', error.message);
    res.status(500).json({ error: 'Failed to compile dashboard analytics.' });
  }
});

// Admin get grouped chat sessions list
router.get('/chat-sessions', requireAdmin, async (req, res) => {
  try {
    let logs = [];
    if (db.isFallback()) {
      logs = storage.findAll('chatlogs');
    } else {
      logs = await ChatLog.find().sort({ createdAt: 1 });
    }

    const sessionsMap = {};
    logs.forEach(log => {
      const sId = log.sessionId || 'legacy_session';
      if (!sessionsMap[sId]) {
        sessionsMap[sId] = {
          sessionId: sId,
          messageCount: 0,
          startedAt: log.createdAt,
          lastActive: log.createdAt,
          lastMessage: log.userMessage
        };
      }
      sessionsMap[sId].messageCount += 2; // user message and ai response pair
      sessionsMap[sId].lastActive = log.createdAt;
      sessionsMap[sId].lastMessage = log.userMessage;
    });

    const sessions = Object.values(sessionsMap).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
    res.json(sessions);
  } catch (error) {
    console.error('❌ Error fetching chat sessions:', error.message);
    res.status(500).json({ error: 'Failed to retrieve chat sessions.' });
  }
});

// Admin get single chat session transcript
router.get('/chat-sessions/:sessionId', requireAdmin, async (req, res) => {
  const { sessionId } = req.params;
  try {
    let logs = [];
    if (db.isFallback()) {
      logs = storage.find('chatlogs', { sessionId });
    } else {
      logs = await ChatLog.find({ sessionId }).sort({ createdAt: 1 });
    }

    const messages = [];
    logs.forEach(log => {
      messages.push({
        sender: 'user',
        text: log.userMessage,
        timestamp: log.createdAt
      });
      messages.push({
        sender: 'ai',
        text: log.aiResponse,
        timestamp: log.createdAt
      });
    });

    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching chat transcript:', error.message);
    res.status(500).json({ error: 'Failed to retrieve chat transcript.' });
  }
});

// Admin get customer profiles
router.get('/customer-profiles', requireAdmin, async (req, res) => {
  try {
    let profiles = [];
    if (db.isFallback()) {
      profiles = storage.findAll('customerprofiles');
    } else {
      const CustomerProfile = require('../models/CustomerProfile');
      profiles = await CustomerProfile.find().sort({ lastActivity: -1 });
    }
    res.json(profiles);
  } catch (error) {
    console.error('❌ Error fetching customer profiles:', error.message);
    res.status(500).json({ error: 'Failed to retrieve customer profiles.' });
  }
});

module.exports = router;
