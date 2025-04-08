
import { useState, useEffect } from 'react';
import { RecentSearch } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'weather_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export default function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  
  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const storedSearches = localStorage.getItem(STORAGE_KEY);
    if (storedSearches) {
      try {
        const parsedSearches = JSON.parse(storedSearches);
        setRecentSearches(parsedSearches);
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);
  
  // Save to localStorage whenever recent searches change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);
  
  // Add a new search to the history
  const addSearch = (city: string, country: string) => {
    setRecentSearches(prev => {
      // Check if this city is already in recent searches
      const existingIndex = prev.findIndex(item => 
        item.city.toLowerCase() === city.toLowerCase() && 
        item.country.toLowerCase() === country.toLowerCase()
      );
      
      let newSearches;
      const newSearch = {
        id: uuidv4(),
        city,
        country,
        timestamp: Date.now()
      };
      
      if (existingIndex >= 0) {
        // Remove the existing entry and add the new one at the beginning
        newSearches = [
          newSearch,
          ...prev.slice(0, existingIndex),
          ...prev.slice(existingIndex + 1)
        ];
      } else {
        // Add new search at the beginning
        newSearches = [newSearch, ...prev];
      }
      
      // Limit to MAX_RECENT_SEARCHES items
      return newSearches.slice(0, MAX_RECENT_SEARCHES);
    });
  };
  
  // Clear all recent searches
  const clearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };
  
  // Remove a specific search
  const removeSearch = (id: string) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };
  
  return { recentSearches, addSearch, clearSearches, removeSearch };
}
