
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Sparkles } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'dark' || (!theme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`
        relative overflow-hidden transition-all duration-500 shadow-sm hover:shadow-lg transform hover:scale-105
        ${isDark 
          ? 'bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-indigo-600 text-indigo-200 hover:from-indigo-800/80 hover:to-purple-800/80' 
          : 'bg-gradient-to-r from-yellow-100/80 to-orange-100/80 border-orange-300 text-orange-800 hover:from-yellow-200/80 hover:to-orange-200/80'
        }
        backdrop-blur-sm
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
      
      <div className={`flex items-center space-x-2 relative z-10 transition-all duration-300`}>
        {isDark ? (
          <>
            <div className="relative">
              <Moon className="h-4 w-4 text-indigo-300" />
              <Sparkles className="absolute -top-1 -right-1 h-2 w-2 text-yellow-300 animate-pulse" />
            </div>
            <span className="hidden sm:inline font-medium">Dark</span>
          </>
        ) : (
          <>
            <div className="relative">
              <Sun className="h-4 w-4 text-orange-600 animate-pulse" />
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-sm animate-pulse"></div>
            </div>
            <span className="hidden sm:inline font-medium">Light</span>
          </>
        )}
      </div>
    </Button>
  );
};
