
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  category: string;
}

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      console.log('Fetching services from Supabase...');
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }

      console.log('Services fetched:', data?.length || 0);
      return data?.map(service => ({
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: Number(service.price),
        description: service.description || '',
        category: service.category
      })) || [];
    },
  });
};
