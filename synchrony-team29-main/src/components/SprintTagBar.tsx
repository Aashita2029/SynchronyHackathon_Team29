
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X, Sparkles } from 'lucide-react';

const sprints = [
  { id: 'all', name: 'All Sprints', count: 12, color: 'from-gray-500 to-gray-600' },
  { id: 'Sprint 1', name: 'Sprint 1', count: 5, color: 'from-blue-500 to-blue-600' },
  { id: 'Sprint 2', name: 'Sprint 2', count: 4, color: 'from-purple-500 to-purple-600' },
  { id: 'Sprint 3', name: 'Sprint 3', count: 3, color: 'from-pink-500 to-pink-600' },
];

interface SprintTagBarProps {
  selectedSprint: string;
  onSprintChange: (sprint: string) => void;
}

export const SprintTagBar: React.FC<SprintTagBarProps> = ({
  selectedSprint,
  onSprintChange,
}) => {
  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-lg">
                <Filter className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Sprint Filter
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Select active sprint</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {sprints.map((sprint) => (
                <Button
                  key={sprint.id}
                  variant={selectedSprint === sprint.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSprintChange(sprint.id)}
                  className={`
                    relative overflow-hidden group transition-all duration-300 transform hover:scale-105
                    ${selectedSprint === sprint.id 
                      ? `bg-gradient-to-r ${sprint.color} text-white shadow-xl border-0` 
                      : 'hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-700 hover:border-pink-300 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20'
                    }
                  `}
                >
                  {selectedSprint === sprint.id && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                      <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                    </>
                  )}
                  <span className="relative z-10">{sprint.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={`
                      ml-2 text-xs relative z-10
                      ${selectedSprint === sprint.id 
                        ? 'bg-white/25 text-white border-white/30' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                      }
                    `}
                  >
                    {sprint.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
          
          {selectedSprint !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSprintChange('all')}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
            >
              <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="text-sm font-medium">Clear Filter</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
