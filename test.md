import mongoose from "mongoose";
import User from "../models/userModel.js";
import Gratitude from "../models/gamification/gratitudeModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";

// Create a new gratitude entry
export const createGratitude = async (req, res) => {
  try {
    const { text } = req.body;
    const { userId } = req.user;
    
    // Check if user already has an entry for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingEntry = await Gratitude.findOne({
      userId,
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    if (existingEntry) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false, 
        message: 'You already have a gratitude entry for today' 
      });
    }
    
    // Create new gratitude entry
    const gratitude = await Gratitude.create({
      userId,
      text,
      createdAt: new Date()
    });
    
    // Calculate streak and update user's stats
    await updateUserStats(userId);
    
    return res.status(201).json({
      success: true,
      data: gratitude
    });
  } catch (error) {
    console.error('Error creating gratitude entry:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get gratitude entries with date filtering and pagination
export const getUserGratitudes = async (req, res) => {
  try {
    const { userId } = req.user;
    const { 
      year, 
      month, 
      day, 
      page = 1, 
      limit = 10,
      startDate,
      endDate
    } = req.query;
    
    const query = { userId };
    
    // Handle date filtering
    if (startDate && endDate) {
      // Date range filter
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Include the end date
      
      query.createdAt = { 
        $gte: start, 
        $lt: end 
      };
    } else if (year && month && day) {
      // Specific day filter
      const targetDate = new Date(year, month - 1, day);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.createdAt = { 
        $gte: targetDate, 
        $lt: nextDay 
      };
    } else if (year && month) {
      // Month filter
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      query.createdAt = { 
        $gte: startOfMonth, 
        $lte: endOfMonth 
      };
    } else if (year) {
      // Year filter
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31);
      endOfYear.setHours(23, 59, 59, 999);
      
      query.createdAt = { 
        $gte: startOfYear, 
        $lte: endOfYear 
      };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get entries count for the query
    const totalEntries = await Gratitude.countDocuments(query);
    
    // Get paginated entries
    const gratitudes = await Gratitude.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    return res.status(200).json({
      success: true,
      count: gratitudes.length,
      totalEntries,
      totalPages: Math.ceil(totalEntries / limit),
      currentPage: parseInt(page),
      data: gratitudes
    });
  } catch (error) {
    console.error('Error fetching gratitude entries:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get entry dates for calendar view
export const getDates = async (req, res) => {
  try {
    const { userId } = req.user;
    const { year, month } = req.query;
    
    let query = { userId };
    
    // Filter by month if provided
    if (year && month) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      query.createdAt = { 
        $gte: startOfMonth, 
        $lte: endOfMonth 
      };
    }
    
    // Only fetch dates (not full entries) for efficiency
    const entries = await Gratitude.find(query)
      .select('createdAt')
      .sort({ createdAt: 1 });
    
    // Format dates as YYYY-MM-DD
    const dates = entries.map(entry => {
      const date = new Date(entry.createdAt);
      return {
        date: date.toISOString().split('T')[0],
        id: entry._id
      };
    });
    
    return res.status(200).json({
      success: true,
      count: dates.length,
      data: dates
    });
  } catch (error) {
    console.error('Error fetching entry dates:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single gratitude entry by id
export const getGratitudeById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    
    const entry = await Gratitude.findOne({
      _id: id,
      userId
    });
    
    if (!entry) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Entry not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Error fetching gratitude entry:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user's current streak and badges
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const user = await User.findById(userId).select('gratitudeStats');
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: user.gratitudeStats || {
        currentStreak: 0,
        longestStreak: 0,
        totalEntries: 0,
        badges: []
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get leaderboard for gratitude streaks
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({
      'gratitudeStats.currentStreak': { $gt: 0 }
    })
    .select('username gratitudeStats.currentStreak gratitudeStats.longestStreak avatar')
    .sort({ 'gratitudeStats.currentStreak': -1 })
    .limit(10);
      
    return res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to update user stats
async function updateUserStats(userId) {
  try {
    // Get all user's gratitude entries sorted by date
    const entries = await Gratitude.find({ userId })
      .sort({ createdAt: 1 });
    
    if (!entries.length) return;
    
    // Calculate current streak
    let currentStreak = 1;
    let longestStreak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get most recent entry date
    const latestEntry = entries[entries.length - 1];
    const latestDate = new Date(latestEntry.createdAt);
    latestDate.setHours(0, 0, 0, 0);
    
    // Check if most recent entry is from today
    const isToday = latestDate.getTime() === today.getTime();
    
    if (!isToday) {
      // If latest entry is not today, user broke their streak
      currentStreak = 0;
    } else {
      // Calculate streak by checking consecutive days
      for (let i = entries.length - 2; i >= 0; i--) {
        const currentDate = new Date(entries[i].createdAt);
        currentDate.setHours(0, 0, 0, 0);
        
        const prevDate = new Date(entries[i + 1].createdAt);
        prevDate.setHours(0, 0, 0, 0);
        
        // Check if entries are from consecutive days
        const diffTime = Math.abs(prevDate - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Determine badges based on streaks and total entries
    const badges = [];
    
    if (currentStreak >= 3) badges.push('three-day-streak');
    if (currentStreak >= 7) badges.push('week-streak');
    if (currentStreak >= 30) badges.push('month-streak');
    if (currentStreak >= 100) badges.push('hundred-day-streak');
    
    if (entries.length >= 10) badges.push('gratitude-beginner');
    if (entries.length >= 50) badges.push('gratitude-enthusiast');
    if (entries.length >= 100) badges.push('gratitude-master');
    
    // Update user stats
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'gratitudeStats.currentStreak': currentStreak,
          'gratitudeStats.longestStreak': Math.max(longestStreak, currentStreak),
          'gratitudeStats.totalEntries': entries.length,
          'gratitudeStats.badges': badges
        },
        $inc: { 'points': 5 } // Add points for creating an entry
      }
    );
    
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}










import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FaLeaf, 
  FaCalendarCheck, 
  FaMedal, 
  FaTrophy, 
  FaFire, 
  FaChevronLeft, 
  FaChevronRight,
  FaPlus,
  FaTimes,
  FaPencilAlt,
  FaCheck
} from 'react-icons/fa';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  parseISO 
} from 'date-fns';

const GratitudeJournal = () => {
  // Base states
  const [gratitudeText, setGratitudeText] = useState('');
  const [entries, setEntries] = useState([]);
  const [entryDates, setEntryDates] = useState([]);
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalEntries: 0,
    badges: []
  });
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editText, setEditText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [entrySubmittedToday, setEntrySubmittedToday] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notification system
  const toast = {
    show: (message, type = 'info') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    },
    success: (message) => toast.show(message, 'success'),
    error: (message) => toast.show(message, 'error'),
    info: (message) => toast.show(message, 'info'),
  };

  // Calendar navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Data fetching functions
  const fetchEntryForDate = useCallback(async (date) => {
    try {
      setLoading(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await customFetch.get(`/gratitude?date=${formattedDate}`);
      
      if (response.data.data.length > 0) {
        setSelectedEntry(response.data.data[0]);
        setIsViewModalOpen(true);
      } else {
        setSelectedEntry(null);
        if (isToday(date)) {
          setIsAddModalOpen(true);
        } else {
          toast.info('No gratitude entry for this date');
        }
      }
    } catch (err) {
      console.error('Error fetching entry for date:', err);
      toast.error('Failed to fetch entry');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCalendarDates = useCallback(async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      
      const response = await customFetch.get(`/gratitude/dates?year=${year}&month=${month}`);
      console.log({response});
      // Make sure to parse string dates to Date objects
      setEntryDates(response.data.data.map(date => parseISO(date)));
    } catch (err) {
      console.log(err);
      console.error('Error fetching calendar dates:', err);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  const fetchUserStats = useCallback(async () => {
    try {
      const response = await customFetch.get('/gratitude/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  }, []);

  const checkTodayEntry = useCallback(async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await customFetch.get(`/gratitude?date=${today}`);
      setEntrySubmittedToday(response.data.data.length > 0);
    } catch (err) {
      console.error('Error checking today entry:', err);
    }
  }, []);

  // CRUD operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gratitudeText.trim()) {
      toast.error('Please enter something you are grateful for');
      return;
    }

    try {
      setLoading(true);
      const response = await customFetch.post('/gratitude', { text: gratitudeText });
      setGratitudeText('');
      setIsAddModalOpen(false);
      
      // Update data
      await Promise.all([
        fetchCalendarDates(),
        fetchUserStats(),
        checkTodayEntry()
      ]);
      
      toast.success('Gratitude entry added successfully!');
      
      if (isToday(selectedDate)) {
        setSelectedEntry(response.data.data);
      }
    } catch (err) {
      console.error('Error submitting gratitude:', err);
      toast.error(err.response?.data?.msg || 'Failed to add gratitude entry');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = async () => {
    if (!editText.trim()) {
      toast.error('Please enter something you are grateful for');
      return;
    }

    try {
      setLoading(true);
      await customFetch.patch(`/gratitude/${selectedEntry._id}`, { text: editText });
      
      setSelectedEntry({ ...selectedEntry, text: editText });
      setIsEditMode(false);
      
      await Promise.all([
        fetchCalendarDates(),
        fetchUserStats()
      ]);
      
      toast.success('Gratitude entry updated successfully!');
    } catch (err) {
      console.error('Error updating gratitude:', err);
      toast.error(err.response?.data?.msg || 'Failed to update gratitude entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async () => {
    if (!selectedEntry) return;

    try {
      setLoading(true);
      await customFetch.delete(`/gratitude/${selectedEntry._id}`);
      
      setIsViewModalOpen(false);
      setSelectedEntry(null);
      
      await Promise.all([
        fetchCalendarDates(),
        fetchUserStats(),
        checkTodayEntry()
      ]);
      
      toast.success('Gratitude entry deleted successfully!');
    } catch (err) {
      console.error('Error deleting gratitude:', err);
      toast.error(err.response?.data?.msg || 'Failed to delete gratitude entry');
    } finally {
      setLoading(false);
    }
  };

  // Calendar rendering functions - Memoized for performance
  const daysOfWeek = useMemo(() => {
    const days = [];
    const dateFormat = 'EEEEEE';
    const startDate = startOfWeek(new Date());

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center p-2 font-semibold text-gray-600">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return days;
  }, []);

  const calendarCells = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'yyyy-MM-dd');
        const hasEntry = entryDates.some(date => date && isSameDay(date, day));
        
        days.push(
          <div
            key={formattedDate}
            className={`
              relative p-2 border border-gray-100 h-14 w-full cursor-pointer transition-all
              ${!isSameMonth(day, monthStart) ? 'text-gray-400 bg-gray-50' : ''}
              ${isSameDay(day, selectedDate) ? 'bg-blue-100 text-blue-600' : ''}
              ${isToday(day) ? 'border-blue-500 font-bold' : ''}
              hover:bg-gray-100
            `}
            onClick={() => onDateClick(day)}
          >
            <div className="text-right">{format(day, 'd')}</div>
            {hasEntry && (
              <div className="absolute bottom-1 left-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={`week-${rows.length}`} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  }, [currentMonth, entryDates, selectedDate]);

  // Event handlers
  const onDateClick = async (day) => {
    setSelectedDate(day);
    await fetchEntryForDate(day);
  };

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCalendarDates(),
        fetchUserStats(),
        checkTodayEntry()
      ]);
    };
    
    fetchData();
  }, [fetchCalendarDates, fetchUserStats, checkTodayEntry]);

  useEffect(() => {
    fetchCalendarDates();
  }, [currentMonth, fetchCalendarDates]);

  useEffect(() => {
    if (selectedEntry && isEditMode) {
      setEditText(selectedEntry.text);
    }
  }, [selectedEntry, isEditMode]);

  // UI Components
  const Toast = ({ message, type }) => (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    } text-white`}>
      {message}
    </div>
  );

  const Card = ({ children, className }) => (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className || ''}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children, className }) => (
    <div className={`p-4 ${className || ''}`}>
      {children}
    </div>
  );

  const CardTitle = ({ children, className }) => (
    <h3 className={`text-lg font-semibold ${className || ''}`}>
      {children}
    </h3>
  );

  const CardContent = ({ children, className }) => (
    <div className={`p-4 pt-0 ${className || ''}`}>
      {children}
    </div>
  );

  const CardFooter = ({ children, className }) => (
    <div className={`p-4 ${className || ''}`}>
      {children}
    </div>
  );

  const Button = ({ children, onClick, className, type = "button", disabled = false }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md transition-colors ${className || ''}`}
    >
      {children}
    </button>
  );

  const Textarea = ({ value, onChange, placeholder, className, disabled = false }) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
    />
  );

  const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
          {children}
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DialogContent = ({ children, className }) => (
    <div className={`p-6 ${className || ''}`}>
      {children}
    </div>
  );

  const DialogHeader = ({ children, className }) => (
    <div className={`mb-4 ${className || ''}`}>
      {children}
    </div>
  );

  const DialogTitle = ({ children, className }) => (
    <h3 className={`text-xl font-semibold ${className || ''}`}>
      {children}
    </h3>
  );

  const DialogFooter = ({ children, className }) => (
    <div className={`mt-6 flex justify-end space-x-2 ${className || ''}`}>
      {children}
    </div>
  );

  // Main Render
  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>

      {/* Header Card with Stats */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <FaLeaf className="text-green-500" />
              Gratitude Journal
            </CardTitle>
            <Button 
              className={`flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800`}
              onClick={() => {
                if (!entrySubmittedToday) {
                  setIsAddModalOpen(true);
                } else {
                  toast.info("You've already submitted an entry today!");
                }
              }}
            >
              <FaPlus className="text-green-500" />
              New Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-2 border rounded-md">
              <FaFire className="text-amber-500 text-xl" />
              <div>
                <div className="text-sm text-gray-500">Current Streak</div>
                <div className="font-bold">{stats.currentStreak} days</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded-md">
              <FaTrophy className="text-yellow-500 text-xl" />
              <div>
                <div className="text-sm text-gray-500">Longest Streak</div>
                <div className="font-bold">{stats.longestStreak} days</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded-md">
              <FaCalendarCheck className="text-blue-500 text-xl" />
              <div>
                <div className="text-sm text-gray-500">Total Entries</div>
                <div className="font-bold">{stats.totalEntries}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded-md">
              <FaMedal className="text-purple-500 text-xl" />
              <div>
                <div className="text-sm text-gray-500">Badges</div>
                <div className="font-bold">{stats.badges?.length || 0}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Button 
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
              onClick={prevMonth}
            >
              <FaChevronLeft />
            </Button>
            <h2 className="text-xl font-bold text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <Button 
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
              onClick={nextMonth}
            >
              <FaChevronRight />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="calendar-grid">
            <div className="grid grid-cols-7">
              {daysOfWeek}
            </div>
            <div className="calendar-body">
              {calendarCells}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-2 text-sm text-gray-500 flex justify-between">
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Entry present
          </span>
          <span className="italic">Click on a date to view or add an entry</span>
        </CardFooter>
      </Card>

      {/* Add Entry Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaLeaf className="text-green-500" />
              Add Gratitude Entry
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="What are you grateful for today?"
              className="min-h-[120px] resize-none"
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              disabled={loading}
            />
            <DialogFooter>
              <Button 
                onClick={() => setIsAddModalOpen(false)}
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Entry'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Entry Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaLeaf className="text-green-500" />
              {selectedEntry && format(parseISO(selectedEntry.createdAt), 'MMMM d, yyyy')}
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <>
              {isEditMode ? (
                <div className="space-y-4">
                  <Textarea
                    className="min-h-[120px] resize-none"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    disabled={loading}
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      onClick={() => setIsEditMode(false)}
                      className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateEntry}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-2 italic bg-green-50 rounded-r">
                    {selectedEntry.text}
                  </div>
                  <div className="text-sm text-gray-500 flex justify-between items-center">
                    <span>Created at {format(parseISO(selectedEntry.createdAt), 'h:mm a')}</span>
                    <div className="flex gap-2">
                      <Button 
                        className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 px-2 py-1 text-sm flex items-center gap-1"
                        onClick={() => setIsEditMode(true)}
                      >
                        <FaPencilAlt className="text-blue-500" />
                        Edit
                      </Button>
                      <Button 
                        className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 px-2 py-1 text-sm flex items-center gap-1"
                        onClick={handleDeleteEntry}
                      >
                        <FaTimes className="text-red-500" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GratitudeJournal;





'











import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { createGratitude, getUserGratitudes, getUserStats, getLeaderboard, getDates } from '../controllers/gratitudeController.js';

const router = express.Router();

router.post("/", authenticateUser, createGratitude);
router.get("/", authenticateUser, getUserGratitudes);
router.get("/dates", authenticateUser, getDates);
router.get("/stats", authenticateUser, getUserStats);
router.get("/leaderboard", getLeaderboard);

export default router;





