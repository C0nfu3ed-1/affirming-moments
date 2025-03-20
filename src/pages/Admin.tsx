
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const Admin = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ProtectedRoute adminRequired={true}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-20">
          <AdminDashboard />
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
