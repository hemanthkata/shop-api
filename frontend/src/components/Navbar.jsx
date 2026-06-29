import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar({ onOpenSearch, onOpenMenu }) {
  const { itemCount, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-nav"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
        <ShoppingBag color="var(--accent-main)" />
        <span>Lumina<span style={{ color: 'var(--accent-main)' }}>Store</span></span>
      </Link>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <button onClick={onOpenSearch} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
          <Search size={20} />
        </button>
        <button onClick={() => navigate(user ? '/profile' : '/auth')} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
          <User size={20} color={user ? 'var(--accent-main)' : 'currentColor'} />
        </button>
        
        <button onClick={() => setIsCartOpen(true)} style={{ color: 'var(--text-secondary)', position: 'relative' }}>
          <ShoppingBag size={20} />
          {itemCount > 0 && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-8px', background: 'var(--accent-main)',
              color: 'white', fontSize: '0.7rem', fontWeight: 700, width: '18px', height: '18px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {itemCount}
            </span>
          )}
        </button>
        <button onClick={onOpenMenu} style={{ color: 'var(--text-primary)', transition: 'color 0.2s' }}>
          <Menu size={20} />
        </button>
      </div>
    </motion.nav>
  );
}

export default Navbar;
