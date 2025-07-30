import React, { useContext } from 'react';
import {UserContext} from '../../context/userContext';
import Navbar from './Navbar';


function DashboardLayout({children}) {
  
  const {user} = useContext(UserContext);
  return (
    <div className='w-full h-full bg-gradient-to-br from-[#111827] via-[#1E293B] to-[#0F172A]'>
      <Navbar/>
      {user && <div>{children}</div>}
    </div>
  );
}

export default DashboardLayout;