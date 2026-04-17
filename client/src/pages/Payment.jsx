import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPaymentOrder, verifyPayment, getRazorpayKey } from '../services/paymentService';
import toast from 'react-hot-toast';

const Payment = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: 'Pro', price: 2499 });

  // Load Razorpay Script Dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on our Node API
      const { data: orderData } = await createPaymentOrder({ amount: selectedPlan.price });

      // Fetch the Key safely from our own backend
      const { data: keyData } = await getRazorpayKey();
      const RAZORPAY_KEY_ID = keyData.key;

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount, // fetched from backend
        currency: orderData.currency,
        name: 'FitWithRam',
        description: `Upgrade to ${selectedPlan.name} Plan`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // 3. Verify Payment Signature on Backend
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment Successful! Welcome to Pro.');
            updateUser({ is_paid: true }); // Update local context
            navigate('/dashboard');
          } catch (err) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#e85d00',
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
      });
      razorpayInstance.open();
    } catch (err) {
      toast.error('Could not initiate payment. Server might be down.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-up">
      <div className="auth-container" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-6">
          <h1 className="dash-h1">Upgrade your training</h1>
          <p className="dash-sub mt-2">Unlock custom plans, live sessions, and analytics.</p>
        </div>

        {/* Plan Selection UI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div 
            onClick={() => setSelectedPlan({ name: 'Pro', price: 2499 })}
            style={{ padding: '24px', transition: 'all 0.3s' }}
            className={`cursor-pointer border-2 rounded-xl ${
              selectedPlan.name === 'Pro' ? 'border-brand-500 bg-brand-50 shadow-md' : 'border-gray-200 hover:border-brand-300'
            }`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '1.1rem', color: '#111', marginBottom: '4px' }}>Pro Plan</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>Live coaching & Custom app access</p>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ea580c' }}>₹2,499<span style={{ fontSize: '0.8rem', fontWeight: '400', color: '#888' }}>/mo</span></div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedPlan({ name: 'Elite', price: 4999 })}
            style={{ padding: '24px', transition: 'all 0.3s' }}
            className={`cursor-pointer border-2 rounded-xl ${
              selectedPlan.name === 'Elite' ? 'border-brand-500 bg-brand-50 shadow-md' : 'border-gray-200 hover:border-brand-300'
            }`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '1.1rem', color: '#111', marginBottom: '4px' }}>Elite Plan</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>Full offline prep & Priority support</p>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ea580c' }}>₹4,999<span style={{ fontSize: '0.8rem', fontWeight: '400', color: '#888' }}>/mo</span></div>
            </div>
          </div>
        </div>

        {/* Order Summary & Button */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555', marginBottom: '12px' }}>
            <span>Subtotal</span>
            <span>₹{selectedPlan.price.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555', marginBottom: '20px' }}>
            <span>Taxes & Fees</span>
            <span style={{ color: '#16a34a', fontWeight: '500' }}>Included</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '700', color: '#111', marginBottom: '32px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <span>Total to pay</span>
            <span style={{ color: '#ea580c' }}>₹{selectedPlan.price.toLocaleString()}</span>
          </div>

          <button 
            onClick={handlePayment} 
            disabled={loading}
            style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
            className="btn-primary shadow-lg rounded-xl"
          >
            {loading ? 'Processing secure connection...' : `Pay securely via Razorpay`}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-xs text-gray-400">Secured by 256-bit AES encryption.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
