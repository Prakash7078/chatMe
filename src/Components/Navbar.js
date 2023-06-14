import React, { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../ContextAPI/AuthContext';
import {AiOutlineLogout} from 'react-icons/ai'
function Navbar() {
  const {currentUser}=useContext(AuthContext);
  return (
    <div className='navbar'>
      <span className='logo'>Free Chat</span>
      <div className='nav-container1'>
        <p>{currentUser.displayName}</p>
        <img src={currentUser.photoURL} alt='profile'/>
        <button onClick={()=>{signOut(auth)}}><AiOutlineLogout/></button>
      </div>
    </div>
  )
}

export default Navbar