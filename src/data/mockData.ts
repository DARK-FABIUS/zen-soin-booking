
import { Service, TimeSlot, Appointment } from '@/types';

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Massage relaxant',
    duration: 60,
    price: 75,
    description: 'Massage complet du corps pour une détente absolue',
    category: 'Massages'
  },
  {
    id: '2',
    name: 'Soin visage hydratant',
    duration: 45,
    price: 65,
    description: 'Soin complet du visage avec masque hydratant',
    category: 'Soins visage'
  },
  {
    id: '3',
    name: 'Manucure française',
    duration: 30,
    price: 35,
    description: 'Manucure classique avec vernis français',
    category: 'Ongles'
  },
  {
    id: '4',
    name: 'Pédicure spa',
    duration: 45,
    price: 45,
    description: 'Pédicure complète avec bain relaxant',
    category: 'Ongles'
  },
  {
    id: '5',
    name: 'Massage dos et nuque',
    duration: 30,
    price: 45,
    description: 'Massage ciblé pour décontracter le dos et la nuque',
    category: 'Massages'
  }
];

export const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
  
  times.forEach(time => {
    slots.push({
      id: `${date}-${time}`,
      date,
      time,
      available: Math.random() > 0.3 // 70% de chances d'être disponible
    });
  });
  
  return slots;
};

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    userId: '2',
    serviceId: '1',
    date: '2024-01-15',
    time: '10:00',
    status: 'completed',
    totalPrice: 75,
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    userId: '2',
    serviceId: '3',
    date: '2024-01-20',
    time: '14:30',
    status: 'confirmed',
    totalPrice: 35,
    createdAt: '2024-01-18T15:30:00Z'
  }
];
