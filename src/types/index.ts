
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isAdmin: boolean;
  loyaltyPoints: number;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // en minutes
  price: number;
  description: string;
  category: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

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

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'isAdmin' | 'loyaltyPoints'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
