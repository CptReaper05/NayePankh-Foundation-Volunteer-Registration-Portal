import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useModal } from '../context/ModalContext';

const Navbar = () => {
  const { openLogin, user, logout } = useModal();
  const router = useRouter();

  const handleNavbarLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 hover:opacity-90 transition-opacity">
        <img 
          src="/logo.png" 
          alt="NayePankh Logo" 
          className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full bg-white p-0.5 border border-slate-700" 
        />
        <strong className="text-emerald-500 text-sm sm:text-lg md:text-xl font-bold tracking-wide">
          NayePankh Foundation
        </strong>
      </Link>
      
      <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
        <Link href="/" className="hover:text-emerald-400 transition-colors duration-200">
          Home
        </Link>
        <Link href="/drives" className="hover:text-emerald-400 transition-colors duration-200">
          Volunteer Drives
        </Link>
        {user && (
          <Link 
            href={user.role === 'admin' ? '/admin/dashboard' : '/volunteer/dashboard'} 
            className="hover:text-emerald-400 transition-colors duration-200"
          >
            Dashboard
          </Link>
        )}
        {user ? (
          <button 
            onClick={handleNavbarLogout}
            className="bg-rose-600 hover:bg-rose-500 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-md font-semibold transition-all duration-200 shadow-sm hover:shadow-rose-500/20 whitespace-nowrap text-left border-0 cursor-pointer text-white"
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={openLogin}
            className="bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-md font-semibold transition-all duration-200 shadow-sm hover:shadow-emerald-500/20 whitespace-nowrap text-left border-0 cursor-pointer text-white"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;