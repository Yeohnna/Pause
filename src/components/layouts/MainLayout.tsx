import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, PenTool, LayoutGrid, Settings, Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navItems = [
    { to: '/', icon: Home, label: '首页' },
    { to: '/learn', icon: BookOpen, label: '学习' },
    { to: '/write', icon: PenTool, label: '写作' },
    { to: '/wordbank', icon: LayoutGrid, label: '词库' },
    { to: '/garden', icon: Flower2, label: '花园' },
  ];

  return (
    <div className="flex min-h-screen w-full justify-center bg-background">
      <div className="flex w-full max-w-[480px] flex-col bg-background shadow-xl md:my-4 md:rounded-[2rem] md:border md:max-h-[calc(100vh-2rem)] overflow-hidden relative">
        <main className="flex-1 overflow-y-auto pb-20 scroll-smooth">
          {children}
        </main>

        <nav className="absolute bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t bg-background/80 px-4 backdrop-blur-md">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center space-y-1 transition-colors duration-300",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                )
              }
            >
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MainLayout;
