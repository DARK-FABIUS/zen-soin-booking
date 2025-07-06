
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, Euro, Home, User } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';

const Confirmation: React.FC = () => {
  const location = useLocation();
  const { service, slot } = location.state || {};

  if (!service || !slot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Aucune réservation trouvée.</p>
            <Link to="/booking">
              <Button className="mt-4">Faire une réservation</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <PageHeader 
          title="Réservation confirmée !"
          subtitle="Votre rendez-vous a été enregistré avec succès"
        />

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        <Card className="border-0 gradient-card shadow-xl mb-6">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-light">Détails de votre rendez-vous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/50 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Prestation</span>
                </div>
                <span className="font-medium">{service.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Date</span>
                </div>
                <span className="font-medium">{formatDate(slot.date)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Heure</span>
                </div>
                <span className="font-medium">{slot.time}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Durée</span>
                </div>
                <span className="font-medium">{service.duration} minutes</span>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <Euro className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Total</span>
                </div>
                <span className="font-bold text-primary text-lg">{service.price} €</span>
              </div>
            </div>

            <div className="bg-accent/20 rounded-2xl p-4">
              <h3 className="font-medium mb-2">Informations importantes :</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Merci d'arriver 10 minutes avant votre rendez-vous</li>
                <li>• En cas d'empêchement, prévenez-nous au moins 24h à l'avance</li>
                <li>• Vous gagnerez {service.price} points fidélité après ce soin</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="flex-1">
            <Button variant="outline" className="w-full rounded-full py-6">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <Link to="/dashboard" className="flex-1">
            <Button className="w-full rounded-full py-6 bg-primary hover:bg-primary/90">
              <User className="w-4 h-4 mr-2" />
              Mon espace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
