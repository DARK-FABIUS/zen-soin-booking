import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, User, Hand } from 'lucide-react';

const Prestation: React.FC = () => {
  const prestations = [
    {
      name: "Massage relaxant",
      icon: Sparkles,
      description: "Détendez-vous avec un massage complet"
    },
    {
      name: "Soin visage",
      icon: User,
      description: "Prenez soin de votre peau en douceur"
    },
    {
      name: "Pose d'ongles",
      icon: Hand,
      description: "Sublimez vos mains avec style"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4">
          Choisissez votre soin
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {prestations.map((prestation, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <prestation.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-medium text-foreground mb-3">
                {prestation.name}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-6">
                {prestation.description}
              </p>
              
              <Link to="/calendrier" className="block">
                <Button className="w-full py-3 text-lg rounded-full bg-primary hover:bg-primary/90 transition-all duration-300">
                  Réserver
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Prestation;