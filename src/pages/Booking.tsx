
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockServices, generateTimeSlots } from '@/data/mockData';
import { Service, TimeSlot } from '@/types';
import { Clock, Euro, Calendar, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/ui/PageHeader';

const Booking: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = [...new Set(mockServices.map(service => service.category))];

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedDate('');
    setSelectedSlot(null);
    setTimeSlots([]);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    const slots = generateTimeSlots(date);
    setTimeSlots(slots);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour réserver un soin.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (selectedService && selectedSlot) {
      // Simulation de la réservation
      toast({
        title: "Réservation confirmée !",
        description: `Votre ${selectedService.name} est confirmé pour le ${selectedSlot.date} à ${selectedSlot.time}.`,
      });
      navigate('/confirmation', {
        state: {
          service: selectedService,
          slot: selectedSlot
        }
      });
    }
  };

  const getNextSevenDays = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <PageHeader 
          title="Réserver un soin"
          subtitle="Choisissez votre prestation et votre créneau idéal"
        />

        {/* Étape 1: Sélection du service */}
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-6 flex items-center">
            <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
            Choisissez votre soin
          </h2>
          
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium text-muted-foreground mb-3">{category}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {mockServices
                  .filter(service => service.category === category)
                  .map(service => (
                    <Card 
                      key={service.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedService?.id === service.id 
                          ? 'ring-2 ring-primary border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-lg">{service.name}</h4>
                          {selectedService?.id === service.id && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration} min
                          </div>
                          <div className="flex items-center font-medium text-primary">
                            <Euro className="w-4 h-4 mr-1" />
                            {service.price}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Étape 2: Sélection de la date */}
        {selectedService && (
          <div className="mb-8">
            <h2 className="text-2xl font-light mb-6 flex items-center">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
              Choisissez une date
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {getNextSevenDays().map(date => (
                <Button
                  key={date}
                  variant={selectedDate === date ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col rounded-2xl"
                  onClick={() => handleDateSelect(date)}
                >
                  <span className="text-xs opacity-70 mb-1">
                    {formatDate(date).split(' ')[0]}
                  </span>
                  <span className="font-medium">
                    {formatDate(date).split(' ')[1]}
                  </span>
                  <span className="text-xs opacity-70">
                    {formatDate(date).split(' ')[2]}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Étape 3: Sélection du créneau */}
        {selectedDate && timeSlots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light mb-6 flex items-center">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
              Choisissez un horaire
            </h2>
            
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {timeSlots.map(slot => (
                <Button
                  key={slot.id}
                  variant={selectedSlot?.id === slot.id ? 'default' : 'outline'}
                  className="rounded-full"
                  disabled={!slot.available}
                  onClick={() => handleSlotSelect(slot)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Récapitulatif et confirmation */}
        {selectedService && selectedSlot && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Récapitulatif de votre réservation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Prestation :</span>
                <span className="font-medium">{selectedService.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date :</span>
                <span className="font-medium">{formatDate(selectedSlot.date)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Heure :</span>
                <span className="font-medium">{selectedSlot.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Durée :</span>
                <span className="font-medium">{selectedService.duration} minutes</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Total :</span>
                <span className="font-bold text-primary">{selectedService.price} €</span>
              </div>
              
              <Button 
                onClick={handleBooking}
                className="w-full rounded-full py-6 text-lg bg-primary hover:bg-primary/90 transition-all duration-300"
              >
                Confirmer ma réservation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Booking;
