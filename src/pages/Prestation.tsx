import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/ui/PageHeader';
import { useServices } from '@/hooks/useServices';
import { Clock, Euro } from 'lucide-react';

const Prestation: React.FC = () => {
  const { data: services = [], isLoading } = useServices();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader title="Nos Prestations" subtitle="Chargement..." />
      </div>
    );
  }

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Nos Prestations" 
        subtitle="Découvrez nos soins relaxants et bien-être"
      />

      <div className="space-y-8">
        {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
          <div key={category}>
            <h2 className="text-2xl font-light text-foreground mb-4 border-b border-border pb-2">
              {category}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-foreground">
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {service.description && (
                      <p className="text-muted-foreground text-sm">
                        {service.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration} min
                      </div>
                      
                      <div className="flex items-center font-medium text-primary">
                        <Euro className="w-4 h-4 mr-1" />
                        {service.price}
                      </div>
                    </div>
                    
                    <Link to="/booking" className="block">
                      <Button className="w-full">
                        Réserver ce soin
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune prestation disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default Prestation;