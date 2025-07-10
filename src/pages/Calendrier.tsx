import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const Calendrier: React.FC = () => {
  // Exemple de créneaux disponibles
  const creneaux = [
    { time: "09:00", available: true },
    { time: "10:30", available: true },
    { time: "12:00", available: false },
    { time: "14:00", available: true },
    { time: "15:30", available: true },
    { time: "17:00", available: false }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Bouton retour */}
      <Link to="/prestation" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour aux prestations
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4">
          Choisissez votre créneau
        </h1>
        <p className="text-muted-foreground">
          Sélectionnez l'heure qui vous convient le mieux
        </p>
      </div>

      {/* Sélection de date */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">Date sélectionnée</h3>
          </div>
          <p className="text-2xl font-light text-foreground">Aujourd'hui, 10 Juillet 2025</p>
        </CardContent>
      </Card>

      {/* Créneaux horaires */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Créneaux disponibles
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {creneaux.map((creneau, index) => (
            <Button
              key={index}
              variant={creneau.available ? "outline" : "ghost"}
              disabled={!creneau.available}
              className={`h-16 text-lg ${
                creneau.available 
                  ? "hover:bg-primary hover:text-primary-foreground border-2 border-primary/20" 
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {creneau.time}
            </Button>
          ))}
        </div>
      </div>

      {/* Bouton de confirmation */}
      <div className="mt-8 text-center">
        <Link to="/booking">
          <Button size="lg" className="w-full md:w-auto px-8 py-4 text-lg rounded-full">
            Confirmer le rendez-vous
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Calendrier;