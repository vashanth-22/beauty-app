import React from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Layout
import Navbar      from './components/Navbar/Navbar';
import CartSidebar from './components/CartSidebar/CartSidebar';
import Footer      from './components/Footer/Footer';
import Toast       from './components/Toast/Toast';

// Pages
import Home          from './pages/Home/Home';
import Products      from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Checkout      from './pages/Checkout/Checkout';
import Orders        from './pages/Orders/Orders';
import Auth          from './pages/Auth/Auth';

// Promo strip (uses config: FREE_SHIPPING_THRESHOLD = 1000, SHIPPING_CHARGE = 50)
function PromoStrip() {
  return (
    <div className="promo-strip">
      Free shipping on orders above <strong>₹1,000</strong>
      &nbsp;·&nbsp; New arrivals every week ✦
    </div>
  );
}

// Router — simple page-key based
function Router() {
  const { page } = useApp();

  const pages = {
    home:    <Home />,
    products:<Products />,
    product: <ProductDetail />,
    checkout:<Checkout />,
    orders:  <Orders />,
    auth:    <Auth />,
  };

  return (
    <main style={{ minHeight: '70vh' }}>
      {pages[page] || <Home />}
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <PromoStrip />
      <Navbar />
      <CartSidebar />
      <Router />
      <Footer />
      <Toast />
    </AppProvider>
  );
}
