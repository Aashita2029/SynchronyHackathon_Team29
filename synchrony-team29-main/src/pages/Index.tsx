
import React, { useState } from 'react';
import { CalendarPanel } from '@/components/CalendarPanel';
import { EventSidebar } from '@/components/EventSidebar';
import { SprintTagBar } from '@/components/SprintTagBar';
import { ColorLegend } from '@/components/ColorLegend';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const [selectedSprint, setSelectedSprint] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<any[]>([]);

  const handleEventsChange = (newEvents: any[]) => {
    setEvents(newEvents);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">TC</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    Team Calendar
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sprint & Event Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ColorLegend />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Sprint Tag Bar */}
      <SprintTagBar 
        selectedSprint={selectedSprint} 
        onSprintChange={setSelectedSprint} 
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Panel - Takes up 3 columns */}
          <div className="lg:col-span-3">
            <CalendarPanel 
              selectedSprint={selectedSprint}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onEventsChange={handleEventsChange}
            />
          </div>
          
          {/* Event Sidebar - Takes up 1 column */}
          <div className="lg:col-span-1">
            <EventSidebar 
              selectedDate={selectedDate}
              selectedSprint={selectedSprint}
              events={events}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
