
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/ui/PageHeader';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue ! Vous êtes maintenant connecté(e).",
      });
      navigate('/');
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-zen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <PageHeader 
          title="Connexion"
          subtitle="Accédez à votre espace personnel"
        />
        
        <Card className="border-0 gradient-card shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Compte admin :</strong> admin@institut.com / admin123</p>
              <p><strong>Compte client :</strong> client@example.com / client123</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-full border-0 bg-white/80"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 rounded-full border-0 bg-white/80"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full rounded-full py-6 text-lg bg-primary hover:bg-primary/90 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <span className="text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  S'inscrire
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
