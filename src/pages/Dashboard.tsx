
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/hooks/useAppointments';
import { useServices } from '@/hooks/useServices';
import { Star, Calendar, Gift, Clock, Euro } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { data: services = [] } = useServices();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Veuillez vous connecter pour accéder à votre espace.</p>
            <Link to="/login">
              <Button className="mt-4">Se connecter</Button>
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
      month: 'long'
    });
  };

  const getServiceById = (serviceId: string) => {
    return services.find(s => s.id === serviceId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmé</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const pointsLevel = Math.floor(user.loyaltyPoints / 100);
  const nextLevelPoints = (pointsLevel + 1) * 100 - user.loyaltyPoints;

  if (appointmentsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <PageHeader 
            title={`Bonjour ${user.firstName} !`}
            subtitle="Chargement de vos données..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <PageHeader 
          title={`Bonjour ${user.firstName} !`}
          subtitle="Gérez vos rendez-vous et consultez vos avantages fidélité"
        />

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Carte fidélité */}
          <Card className="border-0 gradient-card shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-light">Programme fidélité</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{user.loyaltyPoints}</div>
                <div className="text-sm text-muted-foreground">points fidélité</div>
              </div>
              
              <div className="bg-white/50 rounded-full p-4">
                <div className="text-sm font-medium mb-2">Niveau {pointsLevel}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((user.loyaltyPoints % 100) / 100) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Plus que {nextLevelPoints} points pour le niveau suivant
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card className="border-0 gradient-card shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-light">Mes statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rendez-vous total</span>
                <span className="font-bold text-2xl text-primary">{appointments.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Soins terminés</span>
                <span className="font-bold text-xl">
                  {appointments.filter(apt => apt.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total dépensé</span>
                <span className="font-bold text-xl text-accent">
                  {appointments.reduce((sum, apt) => sum + apt.totalPrice, 0)} €
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action rapide */}
          <Card className="border-0 gradient-card shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-light">Votre prochain soin</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground text-sm">
                Offrez-vous un moment de détente
              </p>
              <Link to="/booking">
                <Button className="w-full rounded-full bg-primary hover:bg-primary/90">
                  Réserver maintenant
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Historique des rendez-vous */}
        <Card className="border-0 gradient-card shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-light flex items-center">
              <Calendar className="w-6 h-6 mr-3" />
              Historique de mes rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map(appointment => {
                  const service = getServiceById(appointment.serviceId);
                  return (
                    <div key={appointment.id} className="bg-white/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-lg">{service?.name || 'Service inconnu'}</h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm gap-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(appointment.date)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.time}
                          </span>
                          <span className="flex items-center">
                            <Euro className="w-4 h-4 mr-1" />
                            {appointment.totalPrice} €
                          </span>
                        </div>
                      </div>
                      
                      {appointment.status === 'completed' && (
                        <div className="text-sm text-green-600 font-medium">
                          +{appointment.totalPrice} points fidélité
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun rendez-vous pour le moment</p>
                <Link to="/booking">
                  <Button className="mt-4 rounded-full">
                    Réserver votre premier soin
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
