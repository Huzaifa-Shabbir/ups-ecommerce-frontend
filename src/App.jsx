import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { SnackbarProvider } from './context/SnackbarContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Cart from './pages/Cart/Cart';
import About from './pages/About/About';
import Orders from './pages/Orders/Orders';
import Favourites from './pages/Favourites/Favourites';
import Resources from './pages/Resources/Resources';
import Profile from './pages/Profile/Profile';
import FAQ from './pages/FAQ/FAQ';
import Warranty from './pages/Warranty/Warranty';

function App() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <CartProvider>
          <FavouritesProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/warranty" element={<Warranty />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </FavouritesProvider>
        </CartProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
