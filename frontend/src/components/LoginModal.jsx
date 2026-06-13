import React, { useState } from 'react';
import API from '../api';
import { useRouter } from 'next/router';
import { useModal } from '../context/ModalContext';

export default function LoginModal() {
  const { isLoginOpen, closeLogin, login } = useModal();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoginOpen) return null;

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await API.post('/auth/login', credentials);
      const { token, name, role } = response.data;
      if (token) {
        login({ token, name, role });
        localStorage.setItem('userToken', token);
        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role);

        if (role === 'admin') {
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminName', name);
          closeLogin();
          router.push('/admin/dashboard');
        } else if (role === 'volunteer') {
          closeLogin();
          router.push('/volunteer/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => {
        // Close if clicking outside the card
        if (e.target === e.currentTarget) closeLogin();
      }}
    >
      {/* Login Card */}
      <div className="relative max-w-[350px] w-full bg-slate-900 border border-slate-800 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] rounded-3xl p-6 sm:p-8 text-slate-300 animate-scale-up">
        {/* Close Button */}
        <button 
          onClick={closeLogin}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-350 transition-colors text-lg font-bold cursor-pointer"
          title="Close Modal"
        >
          ✕
        </button>

        <div className="text-center font-extrabold text-3xl text-emerald-400 tracking-wide">
          Log In
        </div>

        {/* Mock Credentials Guide */}
        <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[10px] space-y-1.5 text-slate-400 text-left">
          <span className="font-bold text-emerald-450 block uppercase tracking-wider text-[9px] mb-0.5">Test Credentials:</span>
          <div className="flex justify-between items-center">
            <span>🔑 Admin: <strong className="text-slate-200">admin@np.com</strong></span>
            <span className="text-slate-500 font-mono select-all">admin123</span>
          </div>
          <div className="flex justify-between items-center">
            <span>🤝 Volunteer: <strong className="text-slate-200">volunteer@g.com</strong></span>
            <span className="text-slate-500 font-mono select-all">volunteer123</span>
          </div>
        </div>

        {error && (
          <div className="p-3 mt-4 rounded-xl text-xs font-semibold bg-rose-950/30 text-rose-300 border-l-4 border-rose-500">
            ⚠️ {error}
          </div>
        )}

        <form className="mt-5 space-y-4" onSubmit={handleLogin}>
          <input 
            placeholder="E-mail" 
            id="email" 
            name="email" 
            type="email" 
            value={credentials.email}
            onChange={handleChange}
            required
            className="w-full bg-slate-950 border border-slate-800 px-5 py-3.5 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs" 
          />
          <input 
            placeholder="Password" 
            id="password" 
            name="password" 
            type="password" 
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full bg-slate-950 border border-slate-800 px-5 py-3.5 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs" 
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="block w-full font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3.5 mt-5 rounded-2xl shadow-lg hover:shadow-emerald-500/20 border-0 transition-transform active:scale-95 duration-200 cursor-pointer text-xs disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <span className="block text-center mt-5">
          <a href="#" className="no-underline text-slate-500 text-[10px] hover:text-slate-300 transition-colors">Learn user licence agreement</a>
        </span>
      </div>
    </div>
  );
}
