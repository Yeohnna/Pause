import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import ToasterProvider from '@/components/providers/ToasterProvider';
import Index from '@/pages/Index';
import Learn from '@/pages/Learn';
import Write from '@/pages/Write';
import WordBank from '@/pages/WordBank';
import Garden from '@/pages/Garden';
import Settings from '@/pages/Settings';
import Extract from '@/pages/Extract';
import Review from '@/pages/Review';
import NotFound from '@/pages/NotFound';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/review" element={<Review />} />
          <Route path="/write" element={<Write />} />
          <Route path="/extract" element={<Extract />} />
          <Route path="/wordbank" element={<WordBank />} />
          <Route path="/garden" element={<Garden />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
      <ToasterProvider />
    </BrowserRouter>
  );
};

export default App;
