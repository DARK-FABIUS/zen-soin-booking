import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageHeader from '@/components/ui/PageHeader';
import { Link } from 'react-router-dom';

interface RendezVous {
  id: number;
  prestation: string;
  date: string;
  heure: string;
  created_at: string;
}

const RendezVous: React.FC = () => {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchRendezVous();
    }
  }, [user]);

  const fetchRendezVous = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('rendezvous')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      setRendezVous(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos rendez-vous.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const handleCancelAppointment = (id: number) => {
    toast({
      title: "Fonction à venir",
      description: "La fonctionnalité d'annulation sera bientôt disponible.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Veuillez vous connecter pour accéder à vos rendez-vous.</p>
            <Link to="/login">
              <Button className="mt-4">Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <PageHeader 
            title="Mes rendez-vous"
            subtitle="Chargement de vos rendez-vous..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <PageHeader 
          title="Mes rendez-vous"
          subtitle="Gérez et consultez vos rendez-vous à venir"
        />

        {rendezVous.length > 0 ? (
          <div className="space-y-4">
            {rendezVous.map((rdv) => (
              <Card key={rdv.id} className="border-0 gradient-card shadow-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-medium text-lg">{rdv.prestation || 'Prestation'}</h3>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(rdv.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{rdv.heure || 'Heure non définie'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleCancelAppointment(rdv.id)}
                        className="w-full sm:w-auto"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 gradient-card shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-2">Aucun rendez-vous</h3>
              <p className="text-muted-foreground mb-6">Vous n'avez pas encore de rendez-vous programmés.</p>
              <Link to="/booking">
                <Button className="rounded-full">
                  Réserver un soin
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RendezVous;