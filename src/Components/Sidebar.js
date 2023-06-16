import React, { useContext, useState } from 'react'
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';
import {BiEditAlt} from 'react-icons/bi'
import { AuthContext } from '../ContextAPI/AuthContext';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
function Sidebar() {
  const[showProfile,setShowProfile]=useState(false);
  const {currentUser}=useContext(AuthContext);
  const handleProfile=()=>{
    console.log("handleProfile");
    setShowProfile(!showProfile);
  }
  return (
    <div className='sidebar'>
      <Navbar profileFun={handleProfile}/>
      {!showProfile && <div className="nav-profile">
        <Search/>
        <div className="chatBar">
          <Chats/>
        </div>
      </div>}
      {showProfile && <div className='profile'>
        <img src={currentUser.photoURL} alt='User'/>
        <input style={{display:"none"}} type='file' id="file"/>
        <label htmlFor='file' className='uploadpic'>
          <MdOutlineAddPhotoAlternate size={30}/>
        </label>
        <p>{currentUser.displayName} &nbsp; <BiEditAlt/></p>
        
      </div>}
    </div>
  )
}

export default Sidebar