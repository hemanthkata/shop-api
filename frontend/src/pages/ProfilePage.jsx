import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function ProfilePage() {
  const { user, token, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Fetch order history
    fetch(`${API_URL}/api/orders/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data.results || data))
      .catch(err => console.error("Failed to fetch orders", err));
  }, [user, navigate, token]);

  if (!user) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Welcome, {user.username}</h1>
        <button 
          onClick={() => { logout(); navigate('/'); }}
          style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-secondary)' }}
        >
          Logout
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Order History</h2>
        
        {orders.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order.id} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 600 }}>Order #{order.id}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  {order.items?.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <span>{item.quantity}x {item.product_name}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Amount</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-main)' }}>${order.total_amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
