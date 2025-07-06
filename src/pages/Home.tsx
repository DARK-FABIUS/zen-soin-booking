
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Heart, Star, Calendar } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Soins personnalisés',
      description: 'Des prestations adaptées à vos besoins pour votre bien-être'
    },
    {
      icon: Heart,
      title: 'Ambiance zen',
      description: 'Un environnement paisible pour vous détendre pleinement'
    },
    {
      icon: Star,
      title: 'Programme fidélité',
      description: 'Gagnez des points à chaque visite et profitez d\'avantages exclusifs'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center gradient-zen">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            Votre moment de 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
              bien-être absolu
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light mb-8 max-w-2xl mx-auto">
            Découvrez nos soins relaxants dans un cadre apaisant. 
            Réservez votre parenthèse de détente en quelques clics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button size="lg" className="rounded-full text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 transition-all duration-300 transform hover:scale-105">
                <Calendar className="w-5 h-5 mr-2" />
                Réserver un soin
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary transition-all duration-300"
              >
                Créer mon compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
              Pourquoi choisir Zen Institut ?
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              Une expérience unique alliant expertise, détente et service personnalisé
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 gradient-card shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground font-light">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
            Prêt pour votre moment de détente ?
          </h2>
          <p className="text-lg text-muted-foreground font-light mb-8">
            Réservez dès maintenant votre soin et laissez-vous chouchouter par nos expertes
          </p>
          <Link to="/booking">
            <Button size="lg" className="rounded-full text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
              <Calendar className="w-5 h-5 mr-2" />
              Réserver maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
