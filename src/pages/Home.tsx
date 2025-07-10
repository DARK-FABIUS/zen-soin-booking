
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6">
          ZenSoin – Institut Bien-être
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 font-light">
          Prenez rendez-vous en ligne en quelques clics
        </p>
        
        <Link to="/prestation">
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
          >
            Réserver un soin
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
