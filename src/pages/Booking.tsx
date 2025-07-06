
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useCreateAppointment } from '@/hooks/useAppointments';
import { Calendar, Clock, Euro, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import { toast } from 'sonner';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const Booking: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const createAppointmentMutation = useCreateAppointment();
  
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Generate available time slots (simplified for demo)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    
    times.forEach((time, index) => {
      slots.push({
        id: `slot-${index}`,
        time,
        available: Math.random() > 0.3 // Random availability for demo
      });
    });
    
    return slots;
  };

  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Vous devez être connecté pour réserver un rendez-vous.</p>
            <Link to="/login">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      toast.error('Veuillez sélectionner un service, une date et un créneau');
      return;
    }

    try {
      await createAppointmentMutation.mutateAsync({
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedSlot.time,
        totalPrice: selectedService.price
      });

      toast.success('Rendez-vous confirmé !');
      navigate('/confirmation', {
        state: {
          service: selectedService,
          slot: { date: selectedDate, time: selectedSlot.time }
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Erreur lors de la réservation');
    }
  };

  const getServicesByCategory = () => {
    const categories: { [key: string]: any[] } = {};
    services.forEach(service => {
      if (!categories[service.category]) {
        categories[service.category] = [];
      }
      categories[service.category].push(service);
    });
    return categories;
  };

  if (servicesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <PageHeader title="Chargement..." subtitle="Récupération des prestations..." />
        </div>
      </div>
    );
  }

  const servicesByCategory = getServicesByCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <PageHeader 
          title="Réserver un rendez-vous"
          subtitle="Choisissez votre prestation et votre créneau préféré"
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Selection des services */}
          <div className="space-y-6">
            <Card className="border-0 gradient-card shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-light">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Nos prestations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                  <div key={category}>
                    <h3 className="font-medium text-lg mb-3 text-primary">{category}</h3>
                    <div className="space-y-2">
                      {categoryServices.map(service => (
                        <div
                          key={service.id}
                          className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                            selectedService?.id === service.id
                              ? 'bg-primary/20 border-2 border-primary'
                              : 'bg-white/50 hover:bg-white/70 border-2 border-transparent'
                          }`}
                          onClick={() => setSelectedService(service)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{service.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {service.duration} min
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-primary">{service.price} €</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Selection date et créneau */}
          <div className="space-y-6">
            {selectedService && (
              <>
                <Card className="border-0 gradient-card shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl font-light">
                      <Calendar className="w-5 h-5 mr-2" />
                      Choisir la date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </CardContent>
                </Card>

                {selectedDate && (
                  <Card className="border-0 gradient-card shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-light">
                        <Clock className="w-5 h-5 mr-2" />
                        Créneaux disponibles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map(slot => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slot)}
                            className="p-4 h-auto rounded-xl"
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedService && selectedDate && selectedSlot && (
                  <Card className="border-0 gradient-card shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-light">
                        <Euro className="w-5 h-5 mr-2" />
                        Récapitulatif
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white/50 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Prestation</span>
                          <span className="font-medium">{selectedService.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date</span>
                          <span className="font-medium">{new Date(selectedDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Heure</span>
                          <span className="font-medium">{selectedSlot.time}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Total</span>
                          <span className="font-bold text-primary text-lg">{selectedService.price} €</span>
                        </div>
                      </div>
                      <Button 
                        onClick={handleBooking}
                        disabled={createAppointmentMutation.isPending}
                        className="w-full py-6 rounded-full bg-primary hover:bg-primary/90"
                      >
                        {createAppointmentMutation.isPending ? 'Confirmation...' : 'Confirmer la réservation'}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
