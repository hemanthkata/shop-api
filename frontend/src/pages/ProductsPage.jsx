import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const location = useLocation();
  const isSearchActive = location.search !== '';

  useEffect(() => {
    setLoading(true);
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const categoryQuery = searchParams.get('category');
    
    let url = `${API_URL}/api/products/`;
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('search', searchQuery);
    if (categoryQuery) params.append('category__slug', categoryQuery);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.results || data);
        setTimeout(() => setLoading(false), 500); // Artificial delay to show skeleton
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, [location.search]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div>
      {!isSearchActive && (
        <div style={{ position: 'relative', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '4rem' }}>
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(250,250,250,0.1), var(--bg-main))', zIndex: -1 }} />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', padding: '0 2rem', zIndex: 1, maxWidth: '800px' }}
          >
            <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', color: '#1A1A24', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              Curated for the <br /> <span style={{ background: 'linear-gradient(135deg, #111111 0%, #6B7280 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Extraordinary.</span>
            </h1>
            <p style={{ color: '#4B5563', fontSize: '1.25rem', marginBottom: '2.5rem' }}>
              Explore our exclusive collection of premium products, meticulously crafted to elevate your everyday experience.
            </p>
            <button 
              onClick={() => document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '1rem 2.5rem', background: '#1A1A24', color: 'white', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.75rem', transition: 'var(--transition-smooth)' }}
            >
              Shop Collection <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      )}

      <div id="products-grid" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingTop: isSearchActive ? '4rem' : '0' }}>
        
        {isSearchActive && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem' }}>Search Results</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Showing results based on your filters.</p>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-panel" style={{ overflow: 'hidden', height: '450px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '240px', background: 'rgba(0,0,0,0.05)', animation: 'pulse 1.5s infinite' }} />
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ width: '30%', height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ width: '80%', height: '24px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ width: '100%', height: '40px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '40%', height: '24px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ width: '100px', height: '40px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="glass-panel" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '2rem' }}>No products found</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>We couldn't find anything matching your current filters.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}
          >
            {products.map((product) => (
              <motion.div 
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
                className="glass-panel"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
              >
                <div style={{ height: '280px', backgroundColor: 'rgba(0,0,0,0.03)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'var(--text-secondary)' }}>No Image</span>
                  )}
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--accent-main)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                    {product.category?.name || 'Uncategorized'}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{product.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {product.description}
                  </p>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)' }}>${product.price}</span>
                    <motion.button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(17, 17, 17, 0.2)' }}
                      whileTap={{ scale: 0.95 }}
                      style={{ 
                        background: 'var(--accent-main)', color: 'white', padding: '0.6rem 1.2rem', 
                        borderRadius: '8px', fontWeight: 600, boxShadow: '0 4px 14px 0 rgba(17, 17, 17, 0.15)', transition: 'var(--transition-smooth)'
                      }}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default ProductsPage;
