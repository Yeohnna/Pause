import React from 'react';
import { Toaster } from "@/components/ui/sonner"

const ToasterProvider: React.FC = () => {
  return <Toaster position="top-center" richColors closeButton />;
};

export default ToasterProvider;
