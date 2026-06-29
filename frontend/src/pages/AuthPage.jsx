import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', password_confirm: '', email: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let res;
    if (isLogin) {
      res = await login(formData.username, formData.password);
    } else {
      res = await register(formData);
    }

    if (res.success) {
      navigate('/profile');
    } else {
      let errorMsg = res.error;
      if (typeof res.error === 'object') {
        errorMsg = Object.values(res.error).map(arr => Array.isArray(arr) ? arr[0] : arr).join(' ');
      }
      setError(errorMsg || "An error occurred");
    }
  };

  const inputStyle = { width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', outline: 'none', transition: 'var(--transition-smooth)' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', width: '100vw', margin: '0 calc(-50vw + 50%)' }}>
      {/* Left side: Image/Branding */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '4rem', background: 'var(--bg-card)' }}>
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Fashion" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', zIndex: 1 }} />
        
        <div style={{ position: 'relative', zIndex: 2, color: 'white', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>Elevate Your Lifestyle.</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Join our exclusive community and discover a world of premium products curated just for you.</p>
        </div>
      </div>

      {/* Right side: Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ width: '100%', maxWidth: '450px' }}
        >
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? 'Enter your details to access your account.' : 'Fill in the form to join our platform.'}
            </p>
          </div>
          
          {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Username</label>
              <input 
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
            
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label style={labelStyle}>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={inputStyle}
                  required
                />
              </motion.div>
            )}

            <div>
              <label style={labelStyle}>Password</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                style={inputStyle}
                required
              />
            </div>

            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label style={labelStyle}>Confirm Password</label>
                <input 
                  type="password" 
                  value={formData.password_confirm}
                  onChange={e => setFormData({...formData, password_confirm: e.target.value})}
                  style={inputStyle}
                  required={!isLogin}
                />
              </motion.div>
            )}

            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{ width: '100%', padding: '1rem', background: 'var(--accent-main)', color: 'white', borderRadius: '8px', fontWeight: 600, marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
              <ArrowRight size={20} />
            </motion.button>
          </form>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                style={{ color: 'var(--accent-main)', fontWeight: 600, borderBottom: '1px solid var(--accent-main)', paddingBottom: '2px' }}
              >
                {isLogin ? 'Register now' : 'Log in here'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthPage;
