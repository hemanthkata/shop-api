import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [formData, setFormData] = useState({
    firstName: '', lastName: '',
    address: '', city: '', state: '', zip: '',
    cardNumber: '', expiry: '', cvc: ''
  });
  
  const shipping = total > 100 ? 0 : 15.00;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;
  
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to place an order.");
      navigate('/auth');
      return;
    }
    
    setStatus('processing');
    
    const orderData = {
      items: cart.map(item => ({
        product: item.id,
        quantity: item.quantity
      }))
    };
    
    try {
      const res = await fetch(`${API_URL}/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        setStatus('success');
        clearCart();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', outline: 'none', transition: 'var(--transition-smooth)' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 };

  if (cart.length === 0 && status !== 'success') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <h2>Your cart is empty</h2>
        <Link to="/" style={{ color: 'var(--accent-main)', marginTop: '1rem' }}>Return to Shop</Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}
      >
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '2rem' }}>
          ✓
        </div>
        <h1 style={{ marginBottom: '1rem' }}>Payment Successful!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your order has been placed securely and stock has been updated.</p>
        <Link to="/profile" style={{ padding: '1rem 2rem', background: 'var(--accent-main)', color: 'white', borderRadius: '8px', fontWeight: 600 }}>View Order History</Link>
      </motion.div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem' }}>
      <div>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Checkout</h2>
        <form onSubmit={handleCheckout} id="checkout-form">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} color="var(--accent-main)" /> Shipping Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input type="text" style={inputStyle} required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input type="text" style={inputStyle} required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Street Address</label>
              <input type="text" style={inputStyle} required placeholder="123 Luxury Ave" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" style={inputStyle} required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input type="text" style={inputStyle} required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>ZIP Code</label>
                <input type="text" style={inputStyle} required value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} color="var(--accent-main)" /> Payment Method
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Card Number (Mock)</label>
              <input type="text" style={inputStyle} required placeholder="0000 0000 0000 0000" maxLength="19" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Expiry Date</label>
                <input type="text" style={inputStyle} required placeholder="MM/YY" maxLength="5" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>CVC</label>
                <input type="text" style={inputStyle} required placeholder="123" maxLength="4" value={formData.cvc} onChange={e => setFormData({...formData, cvc: e.target.value})} />
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div>
        <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem' }}>{item.name}</h5>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Qty: {item.quantity}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Estimated Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Estimated Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-glass)', fontSize: '1.25rem', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent-main)' }}>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            disabled={status === 'processing'}
            style={{ width: '100%', padding: '1rem', background: 'var(--accent-main)', color: 'white', borderRadius: '8px', fontWeight: 600, marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: status === 'processing' ? 0.7 : 1, transition: 'var(--transition-smooth)' }}
          >
            {status === 'processing' ? 'Processing...' : <><ShieldCheck size={20} /> Secure Checkout</>}
          </button>
          
          {status === 'error' && <p style={{ color: '#EF4444', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>Something went wrong. Please try again.</p>}
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
