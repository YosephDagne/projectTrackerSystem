'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { MenuItem } from '@/types/menuTypes';
//import { fetchMenu } from '@/services/menu',  Make sure this uses axiosInstance

export const useMenuData = (initialData?: MenuItem[]) => {
  const [menuData, setMenuData] = useState<MenuItem[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const fetchMenuData = async () => {
    // console.log('Starting menu fetch...');
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      // console.log('Using token:', token);
      
      const response = await axios.get(`${BASE_URL}/api/Menu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log('Menu response:', response);
      setMenuData(response.data);
      localStorage.setItem('menu', JSON.stringify(response.data));
    } catch (err) {
      // console.error('Menu fetch error:', err);
      setError(err instanceof Error ? err : new Error('Menu fetch failed'));
      
      // Try to fallback to localStorage
      try {
        const stored = localStorage.getItem('menu');
        if (stored) {
          // console.log('Using stored menu data');
          setMenuData(JSON.parse(stored));
        }
      } catch (parseError) {
       // console.error('Failed to parse stored menu:', parseError);
      }
    } finally {
      setLoading(false);
      // console.log('Fetch completed');
    }
  };

  useEffect(() => {
   // console.log('Initializing useMenuData');
    if (!initialData) {
      fetchMenuData();
    }
  }, []);

  return { 
    menuData, 
    loading, 
    error, 
    refetch: fetchMenuData 
  };
};


