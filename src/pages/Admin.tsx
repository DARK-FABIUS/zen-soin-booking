
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockServices, mockAppointments } from '@/data/mockData';
import { Service } from '@/types';
import { Settings, Plus, Edit2, Trash2, Calendar, Users, Euro, Clock } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>(mockServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    description: '',
    category: ''
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.</p>
            <Link to="/">
              <Button className="mt-4">Retour à l'accueil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData: Service = {
      id: editingService?.id || Date.now().toString(),
      name: formData.name,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category
    };

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? serviceData : s));
      toast({
        title: "Service modifié",
        description: "La prestation a été mise à jour avec succès.",
      });
    } else {
      setServices([...services, serviceData]);
      toast({
        title: "Service ajouté",
        description: "La nouvelle prestation a été créée avec succès.",
      });
    }

    resetForm();
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      duration: service.duration.toString(),
      price: service.price.toString(),
      description: service.description,
      category: service.category
    });
    setShowAddForm(true);
  };

  const handleDelete = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
    toast({
      title: "Service supprimé",
      description: "La prestation a été supprimée avec succès.",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      duration: '',
      price: '',
      description: '',
      category: ''
    });
    setEditingService(null);
    setShowAddForm(false);
  };

  const todayAppointments = mockAppointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });

  const totalRevenue = mockAppointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + apt.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <PageHeader 
          title="Administration"
          subtitle="Gérez vos prestations et consultez les statistiques"
        />

        {/* Statistiques */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 gradient-card shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{todayAppointments.length}</div>
              <div className="text-sm text-muted-foreground">RDV aujourd'hui</div>
            </CardContent>
          </Card>

          <Card className="border-0 gradient-card shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent mb-1">{mockAppointments.length}</div>
              <div className="text-sm text-muted-foreground">Total RDV</div>
            </CardContent>
          </Card>

          <Card className="border-0 gradient-card shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{totalRevenue} €</div>
              <div className="text-sm text-muted-foreground">Chiffre d'affaires</div>
            </CardContent>
          </Card>

          <Card className="border-0 gradient-card shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{services.length}</div>
              <div className="text-sm text-muted-foreground">Prestations</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gestion des services */}
          <div className="lg:col-span-2">
            <Card className="border-0 gradient-card shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-light flex items-center">
                  <Settings className="w-6 h-6 mr-3" />
                  Gestion des prestations
                </CardTitle>
                <Button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                {showAddForm && (
                  <Card className="mb-6 bg-white/50">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {editingService ? 'Modifier la prestation' : 'Nouvelle prestation'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nom de la prestation</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="rounded-full"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Catégorie</Label>
                            <Input
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              className="rounded-full"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="duration">Durée (minutes)</Label>
                            <Input
                              id="duration"
                              name="duration"
                              type="number"
                              value={formData.duration}
                              onChange={handleInputChange}
                              className="rounded-full"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="price">Prix (€)</Label>
                            <Input
                              id="price"
                              name="price"
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={handleInputChange}
                              className="rounded-full"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="rounded-xl"
                            rows={3}
                            required
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button type="submit" className="rounded-full">
                            {editingService ? 'Modifier' : 'Ajouter'}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={resetForm}
                            className="rounded-full"
                          >
                            Annuler
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {services.map(service => (
                    <div key={service.id} className="bg-white/50 rounded-2xl p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{service.name}</h3>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration} min
                          </span>
                          <span className="flex items-center">
                            <Euro className="w-4 h-4 mr-1" />
                            {service.price} €
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(service)}
                          className="rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(service.id)}
                          className="rounded-full text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Planning du jour */}
          <div>
            <Card className="border-0 gradient-card shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-light flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Planning d'aujourd'hui
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {todayAppointments.map(appointment => {
                      const service = services.find(s => s.id === appointment.serviceId);
                      return (
                        <div key={appointment.id} className="bg-white/50 rounded-xl p-3">
                          <div className="font-medium text-sm">{appointment.time}</div>
                          <div className="text-xs text-muted-foreground">{service?.name}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Aucun rendez-vous aujourd'hui</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
