import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CategoryMenu({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetch('http://127.0.0.1:8000/api/categories/')
        .then(res => res.json())
        .then(data => setCategories(data.results || data))
        .catch(err => console.error(err));
    }
  }, [isOpen, categories.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
          />
          <motion.div
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-panel"
            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '350px', maxWidth: '100vw', zIndex: 101, display: 'flex', flexDirection: 'column', borderRadius: '0 16px 16px 0', borderLeft: 'none' }}
          >
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)' }}>
              <h2>Categories</h2>
              <button onClick={onClose} style={{ color: 'var(--text-primary)' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
              <button 
                onClick={() => { navigate('/'); onClose(); }}
                style={{ width: '100%', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '1.1rem' }}>All Products</span>
                <ChevronRight size={16} color="var(--text-secondary)" />
              </button>
              
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => { navigate(`/?category=${cat.slug}`); onClose(); }}
                  style={{ width: '100%', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '1.1rem' }}>{cat.name}</span>
                  <ChevronRight size={16} color="var(--text-secondary)" />
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CategoryMenu;
