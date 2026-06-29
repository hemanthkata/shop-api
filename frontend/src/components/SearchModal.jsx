import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
      onClose();
      setQuery('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(15px)', zIndex: 100, display: 'flex', justifyContent: 'center', paddingTop: '15vh' }}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '700px' }}
          >
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for amazing products..."
                style={{ width: '100%', height: '70px', borderRadius: '35px', padding: '0 4rem 0 2rem', fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.3)', color: 'var(--text-primary)', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)' }}
              />
              <button type="submit" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <Search size={28} />
              </button>
            </form>
            <button onClick={onClose} style={{ display: 'block', margin: '2rem auto', color: 'var(--text-secondary)' }}>
              <X size={32} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;
