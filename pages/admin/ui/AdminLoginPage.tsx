import React, { useState } from 'react';
import DashboardCard from '../../../shared/ui/card';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const formInputStyles = "block w-full rounded-full bg-zinc-900/50 border border-white/10 text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 sm:text-sm px-4 py-3 transition-colors";
  const buttonStyles = "w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg shadow-emerald-600/20 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-emerald-500 transition-colors";


  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name.trim() && email.trim() && phone.trim()) {
      // Basic email and phone validation
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
       if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) {
        setError('Please enter a valid phone number.');
        return;
      }
      // In a real app, you would call an API to send the OTP here
      console.log('Sending OTP to', phone);
      setOtpSent(true);
    } else {
      setError('Please fill in all your details to receive an OTP.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Using a mock OTP for demonstration purposes
    if (otp === '123456') {
      console.log('Login successful');
      onLoginSuccess();
    } else {
      setError('Invalid OTP. Please check and try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">Admin Secure Login</h1>
            <p className="text-zinc-400 mt-2">Enter your credentials to access the console.</p>
        </div>
        <DashboardCard title={!otpSent ? "Enter Your Details" : "Verify Your Identity"}>
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6 mt-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1 ml-4">Full Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={formInputStyles} placeholder="Enter your full name" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1 ml-4">Email Address</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={formInputStyles} placeholder="you@example.com" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1 ml-4">Phone Number</label>
                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={formInputStyles} placeholder="+1 (555) 123-4567" required />
              </div>
              {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-2xl">{error}</p>}
              <button type="submit" className={buttonStyles}>
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6 mt-4">
              <p className="text-sm text-center text-zinc-300">An OTP has been sent to your registered phone number. Please enter it below. (Hint: 123456)</p>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-zinc-300 mb-1 ml-4">One-Time Password (OTP)</label>
                <input type="text" id="otp" value={otp} onChange={e => setOtp(e.target.value)} className={formInputStyles} placeholder="Enter 6-digit OTP" required maxLength={6} />
              </div>
              {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-2xl">{error}</p>}
              <div className="flex space-x-2">
                  <button type="button" onClick={() => { setOtpSent(false); setError(''); }} className="w-1/3 flex justify-center py-3 px-4 border border-white/20 rounded-full shadow-sm text-sm font-medium text-white bg-zinc-700/50 hover:bg-zinc-700 transition-colors">
                    Back
                  </button>
                  <button type="submit" disabled={otp.length !== 6} className={`${buttonStyles} w-2/3`}>
                    Verify & Login
                  </button>
              </div>
            </form>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default React.memo(AdminLoginPage);