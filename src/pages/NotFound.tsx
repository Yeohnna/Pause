import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h1 className="text-6xl font-serif font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">迷路了？没关系，深呼吸，我们回家。</p>
      <Button 
        className="rounded-full px-8 h-12"
        onClick={() => navigate('/')}
      >
        <Home className="mr-2 h-4 w-4" /> 返回首页
      </Button>
    </div>
  );
};

export default NotFound;
