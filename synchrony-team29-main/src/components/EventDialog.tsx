
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Clock, MapPin, Users, Sparkles, Edit, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface EventDialogProps {
  selectedDate?: Date;
  onEventAdd: (event: any) => void;
  onEventDelete?: (eventId: number) => void;
  editingEvent?: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  selectedDate,
  onEventAdd,
  onEventDelete,
  editingEvent,
  isOpen,
  onOpenChange,
}) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: selectedDate || new Date(),
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting',
    status: 'pending',
    sprint: 'Sprint 1',
    location: '',
    attendees: '',
  });

  const eventTypes = [
    { value: 'meeting', label: 'Team Meeting', color: 'from-orange-500 to-amber-600' },
    { value: 'planning', label: 'Sprint Planning', color: 'from-green-500 to-emerald-600' },
    { value: 'review', label: 'Sprint Review', color: 'from-purple-500 to-violet-600' },
    { value: 'deadline', label: 'Deadline', color: 'from-red-500 to-rose-600' },
    { value: 'standup', label: 'Daily Standup', color: 'from-blue-500 to-cyan-600' },
  ];

  const eventStatuses = [
    { value: 'pending', label: 'Yet to Start', color: 'from-red-500 to-rose-600', icon: '🔴' },
    { value: 'in-progress', label: 'In Progress', color: 'from-yellow-500 to-amber-600', icon: '🟡' },
    { value: 'completed', label: 'Completed', color: 'from-blue-500 to-cyan-600', icon: '🔵' },
  ];

  const sprints = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'];

  // Load editing event data
  useEffect(() => {
    if (editingEvent) {
      setEventData({
        title: editingEvent.title || '',
        description: editingEvent.description || '',
        date: editingEvent.start || selectedDate || new Date(),
        startTime: format(new Date(editingEvent.start), 'HH:mm'),
        endTime: format(new Date(editingEvent.end), 'HH:mm'),
        type: editingEvent.type || 'meeting',
        status: editingEvent.status || 'pending',
        sprint: editingEvent.sprint || 'Sprint 1',
        location: editingEvent.location || '',
        attendees: editingEvent.attendees ? editingEvent.attendees.join(', ') : '',
      });
    } else {
      setEventData({
        title: '',
        description: '',
        date: selectedDate || new Date(),
        startTime: '09:00',
        endTime: '10:00',
        type: 'meeting',
        status: 'pending',
        sprint: 'Sprint 1',
        location: '',
        attendees: '',
      });
    }
  }, [editingEvent, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [startHour, startMinute] = eventData.startTime.split(':').map(Number);
    const [endHour, endMinute] = eventData.endTime.split(':').map(Number);
    
    const startDate = new Date(eventData.date);
    startDate.setHours(startHour, startMinute);
    
    const endDate = new Date(eventData.date);
    endDate.setHours(endHour, endMinute);

    const newEvent = {
      id: editingEvent?.id || Date.now(),
      title: eventData.title,
      description: eventData.description,
      start: startDate,
      end: endDate,
      type: eventData.type,
      status: eventData.status,
      sprint: eventData.sprint,
      location: eventData.location,
      attendees: eventData.attendees.split(',').map(a => a.trim()).filter(Boolean),
    };

    onEventAdd(newEvent);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (editingEvent && onEventDelete) {
      onEventDelete(editingEvent.id);
      onOpenChange(false);
    }
  };

  const selectedEventType = eventTypes.find(type => type.value === eventData.type);
  const selectedStatus = eventStatuses.find(status => status.value === eventData.status);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10 rounded-lg"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="flex items-center justify-between text-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent font-bold">
                {editingEvent ? 'Edit Event' : 'Mark Your Calendar'}
              </span>
            </div>
            {editingEvent && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {editingEvent ? 'Update your event details' : 'Add a new event to your team calendar'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Title */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Event Title *
              </Label>
              <Input
                id="title"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Enter event title..."
                required
                className="h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Event Type *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setEventData({ ...eventData, type: type.value })}
                    className={cn(
                      "p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2",
                      eventData.type === type.value
                        ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-lg transform scale-105`
                        : "bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 hover:bg-blue-50/50"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Status */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status *
              </Label>
              <div className="space-y-2">
                {eventStatuses.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setEventData({ ...eventData, status: status.value })}
                    className={cn(
                      "w-full p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 flex items-center space-x-2",
                      eventData.status === status.value
                        ? `bg-gradient-to-r ${status.color} text-white border-transparent shadow-lg transform scale-105`
                        : "bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 hover:bg-blue-50/50"
                    )}
                  >
                    <span>{status.icon}</span>
                    <span>{status.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sprint Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sprint
              </Label>
              <select
                value={eventData.sprint}
                onChange={(e) => setEventData({ ...eventData, sprint: e.target.value })}
                className="w-full h-12 px-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg focus:border-blue-500 transition-colors"
              >
                {sprints.map((sprint) => (
                  <option key={sprint} value={sprint}>
                    {sprint}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50",
                      !eventData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventData.date ? format(eventData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventData.date}
                    onSelect={(date) => date && setEventData({ ...eventData, date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Time *
              </Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    type="time"
                    value={eventData.startTime}
                    onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
                    className="h-12 bg-white/50 dark:bg-gray-800/50"
                  />
                </div>
                <span className="text-gray-400">to</span>
                <div className="flex-1">
                  <Input
                    type="time"
                    value={eventData.endTime}
                    onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
                    className="h-12 bg-white/50 dark:bg-gray-800/50"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </Label>
              <Input
                id="location"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder="Meeting room, video call link..."
                className="h-12 bg-white/50 dark:bg-gray-800/50"
              />
            </div>

            {/* Attendees */}
            <div className="space-y-2">
              <Label htmlFor="attendees" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Attendees
              </Label>
              <Input
                id="attendees"
                value={eventData.attendees}
                onChange={(e) => setEventData({ ...eventData, attendees: e.target.value })}
                placeholder="john@team.com, jane@team.com..."
                className="h-12 bg-white/50 dark:bg-gray-800/50"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="Event details and agenda..."
                rows={3}
                className="bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                "px-8 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105",
                selectedEventType ? `bg-gradient-to-r ${selectedEventType.color}` : "bg-gradient-to-r from-blue-500 to-purple-600"
              )}
            >
              {editingEvent ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
