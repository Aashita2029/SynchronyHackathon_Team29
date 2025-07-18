
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const legendItems = [
  { 
    color: 'bg-gradient-to-r from-red-500 to-rose-600', 
    label: 'Deadline', 
    description: 'Critical project deadlines',
    shadow: 'shadow-red-200 dark:shadow-red-900/50'
  },
  { 
    color: 'bg-gradient-to-r from-green-500 to-emerald-600', 
    label: 'Planning', 
    description: 'Sprint planning sessions',
    shadow: 'shadow-green-200 dark:shadow-green-900/50'
  },
  { 
    color: 'bg-gradient-to-r from-purple-500 to-violet-600', 
    label: 'Review', 
    description: 'Sprint reviews & retrospectives',
    shadow: 'shadow-purple-200 dark:shadow-purple-900/50'
  },
  { 
    color: 'bg-gradient-to-r from-orange-500 to-amber-600', 
    label: 'Meeting', 
    description: 'Team meetings & standups',
    shadow: 'shadow-orange-200 dark:shadow-orange-900/50'
  },
];

export const ColorLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 shadow-sm hover:shadow-lg"
      >
        <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded">
          <Palette className="h-3 w-3 text-white" />
        </div>
        <span className="hidden sm:inline font-medium">Color Legend</span>
        {isOpen ? (
          <ChevronUp className="h-3 w-3 transition-transform duration-200" />
        ) : (
          <ChevronDown className="h-3 w-3 transition-transform duration-200" />
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-3 w-80 shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 rounded-lg"></div>
          
          <CardContent className="p-4 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-lg">
                  <Palette className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-base bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
                    Event Color Legend
                  </h4>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 text-yellow-500 animate-pulse" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Visual guide</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {legendItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-4 h-4 rounded-full ${item.color} shadow-lg ${item.shadow} group-hover:scale-110 transition-transform duration-200`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                          {item.label}
                        </span>
                        <Badge 
                          variant="outline" 
                          className="text-xs px-2 py-0.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border-gray-300 dark:border-gray-500"
                        >
                          {item.label.toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
