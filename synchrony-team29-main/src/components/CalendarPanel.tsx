import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventDialog } from '@/components/EventDialog';
import { useToast } from '@/hooks/use-toast';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Initial mock events data with status
const initialEvents = [
  {
    id: 1,
    title: 'Sprint 1 Planning',
    start: new Date(2024, 6, 15, 9, 0),
    end: new Date(2024, 6, 15, 11, 0),
    type: 'planning',
    status: 'completed',
    sprint: 'Sprint 1',
    description: 'Plan the upcoming sprint goals and tasks',
    location: 'Conference Room A',
    attendees: ['john@team.com', 'jane@team.com'],
  },
  {
    id: 2,
    title: 'Sprint 1 Review',
    start: new Date(2024, 6, 29, 14, 0),
    end: new Date(2024, 6, 29, 16, 0),
    type: 'review',
    status: 'in-progress',
    sprint: 'Sprint 1',
    description: 'Review completed work and demonstrate features',
    location: 'Main Hall',
    attendees: ['team@company.com'],
  },
  {
    id: 3,
    title: 'Feature Deadline',
    start: new Date(2024, 6, 22, 23, 59),
    end: new Date(2024, 6, 22, 23, 59),
    type: 'deadline',
    status: 'pending',
    sprint: 'Sprint 1',
    description: 'Final deadline for user authentication feature',
  },
  {
    id: 4,
    title: 'Team Standup',
    start: new Date(2024, 6, 16, 9, 30),
    end: new Date(2024, 6, 16, 10, 0),
    type: 'meeting',
    status: 'pending',
    sprint: 'Sprint 1',
    description: 'Daily team sync and progress update',
    location: 'Zoom Meeting',
    attendees: ['dev-team@company.com'],
  },
];

interface CalendarPanelProps {
  selectedSprint: string;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEventsChange: (events: any[]) => void;
}

export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  selectedSprint,
  selectedDate,
  onDateChange,
  onEventsChange,
}) => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState(initialEvents);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedSlotDate, setSelectedSlotDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const { toast } = useToast();

  const filteredEvents = selectedSprint === 'all' 
    ? events 
    : events.filter(event => event.sprint === selectedSprint);

  // Update parent component when events change
  useEffect(() => {
    onEventsChange(filteredEvents);
  }, [events, selectedSprint, onEventsChange]);

  // Check for reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      events.forEach(event => {
        const eventTime = new Date(event.start);
        const timeDiff = eventTime.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        
        if (minutesDiff === 15) {
          // Show browser notification
          if (Notification.permission === 'granted') {
            new Notification(`Upcoming Event: ${event.title}`, {
              body: `Starting in 15 minutes at ${format(eventTime, 'HH:mm')}`,
              icon: '/favicon.ico'
            });
          }
          
          toast({
            title: "📅 Upcoming Event Reminder",
            description: `"${event.title}" starts in 15 minutes!`,
          });
        }
      });
    };

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#3B82F6'; // Blue
      case 'in-progress':
        return '#F59E0B'; // Yellow/Amber
      case 'pending':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  const eventStyleGetter = (event: any) => {
    const statusColor = getStatusColor(event.status);
    
    return {
      style: {
        backgroundColor: statusColor,
        borderRadius: '8px',
        opacity: 0.95,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: `0 4px 12px ${statusColor}30`,
        transform: 'translateY(0)',
        transition: 'all 0.2s ease',
      }
    };
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedSlotDate(start);
    setEditingEvent(null);
    setIsEventDialogOpen(true);
  };

  const handleEventAdd = (newEvent: any) => {
    if (editingEvent) {
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id ? { ...newEvent, id: editingEvent.id } : event
      ));
      toast({
        title: "Event Updated Successfully! ✏️",
        description: `"${newEvent.title}" has been updated.`,
      });
    } else {
      setEvents(prev => [...prev, newEvent]);
      toast({
        title: "Event Added Successfully! 🎉",
        description: `"${newEvent.title}" has been added to your calendar.`,
      });
    }
    setEditingEvent(null);
  };

  const handleSelectEvent = (event: any) => {
    setEditingEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "The event has been removed from your calendar.",
    });
  };

  return (
    <>
      <Card className="h-[700px] shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5"></div>
        
        <CardHeader className="relative z-10 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                  Team Calendar
                </span>
                <div className="flex items-center space-x-1 mt-1">
                  <Sparkles className="h-3 w-3 text-yellow-500 animate-pulse" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {filteredEvents.length} events
                  </span>
                </div>
              </div>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsEventDialogOpen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
              {['month', 'week', 'day'].map((viewType) => (
                <Button
                  key={viewType}
                  variant="outline"
                  size="sm"
                  onClick={() => setView(viewType as 'month' | 'week' | 'day')}
                  className={`
                    transition-all duration-200 capitalize font-medium
                    ${view === viewType 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg transform scale-105' 
                      : 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-900/20'
                    }
                  `}
                >
                  {viewType}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 h-[calc(100%-100px)] relative z-10">
          <div className="h-full calendar-container">
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              onView={setView}
              date={selectedDate}
              onNavigate={onDateChange}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              eventPropGetter={eventStyleGetter}
              popup
              showMultiDayTimes
              components={{
                toolbar: ({ label, onNavigate }) => (
                  <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('PREV')}
                        className="hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('NEXT')}
                        className="hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                      {label}
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('TODAY')}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Today
                    </Button>
                  </div>
                ),
              }}
            />
          </div>
        </CardContent>
      </Card>

      <EventDialog
        selectedDate={selectedSlotDate || selectedDate}
        onEventAdd={handleEventAdd}
        onEventDelete={handleDeleteEvent}
        editingEvent={editingEvent}
        isOpen={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
      />
    </>
  );
};
