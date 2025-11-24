import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Mobile Sidebar (keep for mobile compatibility if needed) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content wrapper */}
      <div className="flex flex-col flex-1">
        {/* Header with Top Nav */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page content */}
        <main className="flex-1 py-6">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        {/* <Footer /> - Footer might distract from the dashboard view in the image, hiding for now or can keep if minimal */}
      </div>
    </div>
  );
}