import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AIChatWidget from '../components/ai/AIChatWidget';
import OfflineIndicator from '../components/common/OfflineIndicator';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <OfflineIndicator />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}
