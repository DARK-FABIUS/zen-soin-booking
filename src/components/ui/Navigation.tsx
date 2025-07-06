
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Calendar, Settings } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full"></div>
            <span className="text-xl font-light text-foreground">Zen Institut</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Bonjour, {user.firstName}
                </span>
                {!user.isAdmin && (
                  <Link to="/dashboard">
                    <Button 
                      variant={isActive('/dashboard') ? 'default' : 'ghost'} 
                      size="sm"
                      className="rounded-full"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Mon espace
                    </Button>
                  </Link>
                )}
                {user.isAdmin && (
                  <Link to="/admin">
                    <Button 
                      variant={isActive('/admin') ? 'default' : 'ghost'} 
                      size="sm"
                      className="rounded-full"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/booking">
                  <Button 
                    variant={isActive('/booking') ? 'default' : 'ghost'} 
                    size="sm"
                    className="rounded-full"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Réserver
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="rounded-full"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
