import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { mockCalendarEvents } from '../services/mockData';
import { CalendarEvent } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '../components/Icons';

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    date: new Date(),
    description: '',
    color: 'bg-primary-500' // Default color
  });
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null);


  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)

  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    
    const grid: ({ day: number; isCurrentMonth: boolean; date: Date; events: CalendarEvent[] } | null)[] = [];
    
    // Previous month's trailing days
    const prevMonthDays = daysInMonth(year, month - 1);
    for (let i = 0; i < firstDay; i++) {
      const day = prevMonthDays - firstDay + i + 1;
      const date = new Date(year, month -1, day);
      grid.push({day, isCurrentMonth: false, date, events: [] });
    }

    // Current month's days
    for (let day = 1; day <= numDays; day++) {
      const date = new Date(year, month, day);
      const dayEvents = events.filter(e => 
        new Date(e.date).getFullYear() === date.getFullYear() &&
        new Date(e.date).getMonth() === date.getMonth() &&
        new Date(e.date).getDate() === date.getDate()
      );
      grid.push({ day, isCurrentMonth: true, date, events: dayEvents });
    }

    // Next month's leading days to fill the grid (typically up to 6 weeks * 7 days = 42 cells)
    const remainingCells = 42 - grid.length; // Ensure 6 rows for consistent height
    for (let i = 1; i <= remainingCells; i++) {
       const date = new Date(year, month + 1, i);
      grid.push({ day: i, isCurrentMonth: false, date, events: [] });
    }
    
    return grid;
  }, [currentDate, events]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (dayData: { day: number; isCurrentMonth: boolean; date: Date; events: CalendarEvent[] } | null) => {
    if (dayData && dayData.isCurrentMonth) {
        setSelectedDateEvents(dayData.events);
        setNewEvent({ ...newEvent, date: dayData.date }); // Pre-fill date for new event
        setIsModalOpen(true); // Open modal to show events or add new
    } else if (dayData && !dayData.isCurrentMonth) {
        // Navigate to that month if a day from prev/next month is clicked
        setCurrentDate(dayData.date);
    }
  };
  
  const handleViewEvent = (event: CalendarEvent) => {
    setViewingEvent(event);
    setIsModalOpen(false); // Close day modal if open
    setEventDetailsModalOpen(true);
  };


  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      alert('Event title and date are required.');
      return;
    }
    const finalEvent: CalendarEvent = {
      id: String(Date.now()),
      title: newEvent.title!,
      date: new Date(newEvent.date!), // Ensure it's a Date object
      description: newEvent.description,
      color: newEvent.color || 'bg-primary-500',
    };
    setEvents([...events, finalEvent]);
    setIsModalOpen(false);
    setNewEvent({ title: '', date: new Date(newEvent.date!), description: '', color: 'bg-primary-500' }); // Reset for next, keep selected date
    // Re-fetch events for the selected day if modal was for a specific day
    const dayDate = new Date(finalEvent.date);
    const dayEvents = [...events, finalEvent].filter(e => 
        new Date(e.date).getFullYear() === dayDate.getFullYear() &&
        new Date(e.date).getMonth() === dayDate.getMonth() &&
        new Date(e.date).getDate() === dayDate.getDate()
      );
    setSelectedDateEvents(dayEvents);
  };
  
  const formatDateForInput = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <Card title="Calendar">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700">
              <ChevronLeftIcon className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </button>
            <h2 className="text-xl md:text-2xl font-semibold text-secondary-800 dark:text-secondary-200">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700">
              <ChevronRightIcon className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </button>
            <button 
                onClick={handleToday}
                className="ml-2 px-3 py-1.5 text-sm font-medium border border-secondary-300 dark:border-secondary-600 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
                Today
            </button>
          </div>
          <button
            onClick={() => { 
                setSelectedDateEvents([]); // Clear selected day events
                setNewEvent({ title: '', date: currentDate, description: '', color: 'bg-primary-500' });
                setIsModalOpen(true); 
            }}
            className="flex items-center bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Add Event
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px border border-secondary-200 dark:border-secondary-700 bg-secondary-200 dark:bg-secondary-700 rounded-lg overflow-hidden">
          {weekdays.map(day => (
            <div key={day} className="py-2 text-center text-xs font-medium text-secondary-600 dark:text-secondary-300 bg-secondary-50 dark:bg-secondary-800">
              {day}
            </div>
          ))}
          {calendarGrid.map((dayData, index) => (
            <div
              key={index}
              className={`p-1.5 md:p-2 h-24 md:h-32 flex flex-col cursor-pointer transition-colors duration-150 ease-in-out
                ${dayData?.isCurrentMonth ? 'bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700/50' : 'bg-secondary-100 dark:bg-secondary-800/50 text-secondary-400 dark:text-secondary-500 hover:bg-secondary-200 dark:hover:bg-secondary-700/30'}
                ${dayData?.date && new Date().toDateString() === dayData.date.toDateString() && dayData.isCurrentMonth ? 'ring-2 ring-primary-500 ring-inset' : ''}
              `}
              onClick={() => handleDayClick(dayData)}
            >
              <span className={`text-xs md:text-sm font-medium ${dayData?.isCurrentMonth ? 'text-secondary-700 dark:text-secondary-300' : 'text-secondary-400 dark:text-secondary-500'}`}>
                {dayData?.day}
              </span>
              {dayData?.isCurrentMonth && dayData.events.length > 0 && (
                <div className="mt-1 space-y-0.5 overflow-y-auto max-h-full text-[10px] md:text-xs leading-tight">
                  {dayData.events.slice(0,3).map(event => ( // Show max 3 events initially
                    <div key={event.id} className={`${event.color || 'bg-primary-500'} text-white p-0.5 md:p-1 rounded-sm truncate`}>
                      {event.title}
                    </div>
                  ))}
                  {dayData.events.length > 3 && (
                     <div className="text-primary-500 dark:text-primary-400 font-medium p-0.5 md:p-1 rounded-sm truncate">
                        + {dayData.events.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Add/View Event Modal */}
      <Modal 
        title={selectedDateEvents.length > 0 ? `Events on ${new Date(newEvent.date!).toLocaleDateString()}` : `Add Event for ${new Date(newEvent.date!).toLocaleDateString()}`}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        footer={ selectedDateEvents.length === 0 ? // Only show add event footer if no events to display initially
            <>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-600 hover:bg-secondary-200 dark:hover:bg-secondary-500 rounded-lg">Cancel</button>
              <button onClick={handleAddEvent} className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg">Add Event</button>
            </> : null
        }
      >
        {selectedDateEvents.length > 0 && (
            <div className="mb-4">
                <h4 className="text-md font-semibold mb-2 text-secondary-800 dark:text-secondary-200">Existing Events:</h4>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedDateEvents.map(event => (
                        <li key={event.id} 
                            onClick={() => handleViewEvent(event)}
                            className={`p-2 rounded-md ${event.color || 'bg-primary-500'} text-white cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                            {event.title}
                        </li>
                    ))}
                </ul>
                <hr className="my-4 border-secondary-200 dark:border-secondary-700"/>
                <h4 className="text-md font-semibold mb-2 text-secondary-800 dark:text-secondary-200">Add New Event for this day:</h4>
            </div>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Title *</label>
            <input type="text" id="event-title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white" />
          </div>
          <div>
            <label htmlFor="event-date" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Date *</label>
            <input type="date" id="event-date" value={formatDateForInput(newEvent.date!)} onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value + 'T00:00:00') })} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white" />
          </div>
          <div>
            <label htmlFor="event-description" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Description</label>
            <textarea id="event-description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} rows={3} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white"></textarea>
          </div>
          <div>
            <label htmlFor="event-color" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Color</label>
            <select id="event-color" value={newEvent.color} onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white">
              <option value="bg-primary-500" className="bg-primary-500 text-white">Primary Blue</option>
              <option value="bg-green-500" className="bg-green-500 text-white">Green</option>
              <option value="bg-yellow-500" className="bg-yellow-500 text-white">Yellow</option>
              <option value="bg-red-500" className="bg-red-500 text-white">Red</option>
              <option value="bg-purple-500" className="bg-purple-500 text-white">Purple</option>
              <option value="bg-pink-500" className="bg-pink-500 text-white">Pink</option>
            </select>
          </div>
        </div>
        { selectedDateEvents.length > 0 && // Show add event button if there were events displayed
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-600 hover:bg-secondary-200 dark:hover:bg-secondary-500 rounded-lg">Cancel</button>
              <button onClick={handleAddEvent} className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg">Add This Event</button>
            </div>
        }
      </Modal>

      {/* Event Details Modal */}
      {viewingEvent && (
        <Modal 
            title="Event Details" 
            isOpen={eventDetailsModalOpen} 
            onClose={() => setEventDetailsModalOpen(false)}
            footer={
                <button onClick={() => setEventDetailsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-600 hover:bg-secondary-200 dark:hover:bg-secondary-500 rounded-lg">Close</button>
            }
        >
            <div className="space-y-3">
                <h3 className={`text-xl font-semibold p-2 rounded ${viewingEvent.color || 'bg-primary-500'} text-white`}>{viewingEvent.title}</h3>
                <p><strong className="text-secondary-600 dark:text-secondary-400">Date:</strong> {new Date(viewingEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                {viewingEvent.description && <p><strong className="text-secondary-600 dark:text-secondary-400">Description:</strong> {viewingEvent.description}</p>}
                {/* Add Edit/Delete buttons here later if needed */}
            </div>
        </Modal>
      )}
    </div>
  );
};

export default CalendarPage;
