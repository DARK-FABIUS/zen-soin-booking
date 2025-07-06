
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  createdAt: string;
}

export const useAppointments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching appointments for user:', user.id);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      console.log('Appointments fetched:', data?.length || 0);
      return data?.map(apt => ({
        id: apt.id,
        userId: apt.user_id,
        serviceId: apt.service_id,
        date: apt.appointment_date,
        time: apt.appointment_time,
        status: apt.status as 'confirmed' | 'cancelled' | 'completed',
        totalPrice: Number(apt.total_price),
        createdAt: apt.created_at
      })) || [];
    },
    enabled: !!user,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (appointmentData: {
      serviceId: string;
      date: string;
      time: string;
      totalPrice: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Creating appointment:', appointmentData);
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          service_id: appointmentData.serviceId,
          appointment_date: appointmentData.date,
          appointment_time: appointmentData.time,
          total_price: appointmentData.totalPrice,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }

      console.log('Appointment created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
