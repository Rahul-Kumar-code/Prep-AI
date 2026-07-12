import React, {useContext} from 'react';
import  {useNavigate} from 'react-router-dom';
import { UserContext } from "../../context/userContext";


const ProfileInfoCard = () => {
  const {user, clearUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.clear();
    clearUser();
    navigate('/');
  }
  return user && (
    <div className='flex items-center'>
      <img
      src={user.profileImageUrl}
      alt=""
      className='w-10 h-10 rounded-full mr-3 bg-black'
      />
      <div>
        <div className='text-[15px] text-white font-bold leading-3'>
          {user.name || ""}
        </div>
        <button
        className='text-rose-400 text-sm font-semibold cursor-pointer hover:underline'
        onClick={handleLogout}
        >
        Logout
        </button>
      </div>
    </div>
    
  );
};

export default ProfileInfoCard;
