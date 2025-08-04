import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function DashboardLayout({ children }) {
  const { user } = useContext(UserContext);

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-[#111827] via-[#1E293B] to-[#0F172A] text-white'>
      <Navbar />

      {!user ? (
        <div className='flex flex-col items-center justify-center h-[80vh] text-center px-4'>
          <h2 className='text-2xl md:text-3xl font-semibold mb-4'>Login Required</h2>
          <p className='text-base md:text-lg mb-6'>
            You must be logged in to access the dashboard. Please log in to continue.
          </p>
          <button
            className='px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-medium shadow-md'
          >
            Login
          </button>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}

export default DashboardLayout;
