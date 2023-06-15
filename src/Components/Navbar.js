import React, { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../ContextAPI/AuthContext';
import {AiOutlineLogout} from 'react-icons/ai'
import { ChatContext } from '../ContextAPI/ChatContext';
function Navbar() {
  const {currentUser}=useContext(AuthContext);
  const{dispatch}=useContext(ChatContext);
  return (
    <div className='navbar'>
      <span className='logo'>Chat dude</span>
      <div className='nav-container1'>
        <p>{currentUser.displayName}</p>
        <img src={currentUser.photoURL} alt='profile'/>
        <button onClick={()=>{signOut(auth);dispatch({type:"CHANGE_USER",payload:null});
}}><AiOutlineLogout/></button>
      </div>
    </div>
  )
}

export default Navbar