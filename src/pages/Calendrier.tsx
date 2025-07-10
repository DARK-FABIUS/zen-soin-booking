import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Calendrier: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  // Récupérer la prestation sélectionnée depuis le state ou utiliser une valeur par défaut
  const selectedService = location.state?.selectedService || 'Massage relaxant';

  // Créneaux horaires fictifs
  const timeSlots = [
    { time: "09:00", available: true },
    { time: "10:30", available: true },
    { time: "12:00", available: false },
    { time: "14:00", available: true },
    { time: "15:30", available: true },
    { time: "17:00", available: false },
    { time: "18:30", available: true }
  ];

  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleConfirmAppointment = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour prendre un rendez-vous.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date et un créneau horaire.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Récupérer l'ID du service depuis la base de données
      const { data: services, error: serviceError } = await supabase
        .from('services')
        .select('id, price')
        .eq('name', selectedService)
        .eq('active', true)
        .single();

      if (serviceError || !services) {
        throw new Error('Service non trouvé');
      }

      // Insérer le rendez-vous dans la table appointments
      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          service_id: services.id,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: selectedTimeSlot,
          status: 'confirmed',
          total_price: services.price
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Rendez-vous enregistré avec succès",
        description: `Votre rendez-vous pour ${selectedService} le ${format(selectedDate, 'd MMMM yyyy', { locale: fr })} à ${selectedTimeSlot} a été confirmé.`,
      });

      // Réinitialiser la sélection
      setSelectedTimeSlot(null);
      setSelectedDate(new Date());

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre rendez-vous.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Bouton retour */}
      <Link to="/prestation" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour aux prestations
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4">
          Choisissez une date pour votre soin
        </h1>
        <p className="text-muted-foreground">
          Sélectionnez d'abord une date, puis votre créneau horaire
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendrier */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-5 h-5 text-primary mr-2" />
              <h3 className="text-lg font-medium">Sélectionnez une date</h3>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border pointer-events-auto mx-auto"
              locale={fr}
            />
          </CardContent>
        </Card>

        {/* Créneaux horaires */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-primary mr-2" />
              <h3 className="text-lg font-medium">Créneaux disponibles</h3>
            </div>
            
            {selectedDate ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                      disabled={!slot.available}
                      onClick={() => slot.available && handleTimeSlotClick(slot.time)}
                      className={`h-12 text-base ${
                        slot.available 
                          ? selectedTimeSlot === slot.time
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-primary hover:text-primary-foreground border-2 border-primary/20" 
                          : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {slot.time}
                      {!slot.available && (
                        <span className="ml-1 text-xs">(Occupé)</span>
                      )}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Veuillez d'abord sélectionner une date</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bouton de confirmation - affiché seulement si un créneau est sélectionné */}
      {selectedTimeSlot && selectedDate && (
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Récapitulatif de votre réservation</h3>
            <p className="text-muted-foreground mb-4">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} à {selectedTimeSlot}
            </p>
            <Button 
              size="lg" 
              onClick={handleConfirmAppointment}
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-4 text-lg rounded-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Enregistrement..." : "Confirmer le rendez-vous"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Calendrier;