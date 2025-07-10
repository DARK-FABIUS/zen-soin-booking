import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Calendrier: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

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

  const handleConfirmAppointment = () => {
    alert("Votre rendez-vous a bien été simulé !");
    setSelectedTimeSlot(null);
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
              className="w-full md:w-auto px-8 py-4 text-lg rounded-full bg-primary hover:bg-primary/90"
            >
              Confirmer le rendez-vous
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Calendrier;