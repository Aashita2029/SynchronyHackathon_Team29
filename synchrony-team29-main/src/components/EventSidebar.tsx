import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, Users, Sparkles, AlertCircle } from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

interface EventSidebarProps {
  selectedDate: Date;
  selectedSprint: string;
  events: any[];
}

export const EventSidebar: React.FC<EventSidebarProps> = ({
  selectedDate,
  selectedSprint,
  events = [],
}) => {
  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  // Get upcoming events (next 7 days)
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.start);
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      return eventDate >= today && eventDate <= weekFromNow;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'planning':
        return 'from-green-500 to-emerald-600';
      case 'review':
        return 'from-purple-500 to-violet-600';
      case 'deadline':
        return 'from-red-500 to-rose-600';
      case 'meeting':
        return 'from-orange-500 to-amber-600';
      case 'standup':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-blue-500 to-cyan-600';
      case 'in-progress':
        return 'from-yellow-500 to-amber-600';
      case 'pending':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '🔵';
      case 'in-progress':
        return '🟡';
      case 'pending':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
        return 'Yet to Start';
      default:
        return 'Unknown';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return AlertCircle;
      case 'planning':
      case 'review':
        return CalendarDays;
      default:
        return Clock;
    }
  };

  const formatEventDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd');
  };

  const EventCard = ({ event, isUpcoming = false }: { event: any; isUpcoming?: boolean }) => {
    const EventIcon = getEventTypeIcon(event.type);
    const statusColorClass = getStatusColor(event.status);

    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl -z-10 from-blue-400/20 to-purple-400/20"></div>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${statusColorClass} shadow-lg flex-shrink-0`}>
                <EventIcon className="h-4 w-4 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate pr-2">
                    {event.title}
                  </h4>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-xs">{getStatusIcon(event.status)}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs bg-gradient-to-r ${statusColorClass} text-white border-0 shadow-sm`}
                    >
                      {event.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {isUpcoming 
                        ? `${formatEventDate(new Date(event.start))} • ${format(new Date(event.start), 'HH:mm')}`
                        : `${format(new Date(event.start), 'HH:mm')} - ${format(new Date(event.end), 'HH:mm')}`
                      }
                    </span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                  
                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
                
                {event.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {event.description}
                  </p>
                )}
                
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {event.sprint}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs bg-gradient-to-r ${statusColorClass} text-white border-0 shadow-sm`}
                  >
                    {getStatusLabel(event.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Selected Date Events */}
      <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5"></div>
        
        <CardHeader className="relative z-10 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                {formatEventDate(selectedDate)}
              </span>
              <div className="flex items-center space-x-1 mt-1">
                <Sparkles className="h-3 w-3 text-yellow-500 animate-pulse" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 space-y-3 relative z-10 max-h-80 overflow-y-auto">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="p-3 bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-800 dark:to-blue-900/20 rounded-full w-fit mx-auto mb-3">
                <CalendarDays className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No events scheduled for this day
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Click on the calendar to add an event
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 dark:from-green-400/5 dark:via-blue-400/5 dark:to-purple-400/5"></div>
        
        <CardHeader className="relative z-10 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-green-800 dark:from-white dark:to-green-200 bg-clip-text text-transparent">
                Upcoming Events
              </span>
              <div className="flex items-center space-x-1 mt-1">
                <Sparkles className="h-3 w-3 text-green-500 animate-pulse" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Next 7 days
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 space-y-3 relative z-10 max-h-80 overflow-y-auto">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard key={`upcoming-${event.id}`} event={event} isUpcoming />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full w-fit mx-auto mb-3">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No upcoming events
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Your schedule is clear for the week!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
