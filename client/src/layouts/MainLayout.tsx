import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <main className="flex-grow-1" style={{ paddingTop: '72px' }}>
      {children}
    </main>
    <Footer />
  </div>
);

export default MainLayout;
