import React, { useContext, useState } from 'react'
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';
import {updateProfile as updateAuthProfile } from 'firebase/auth';

import { AuthContext } from '../ContextAPI/AuthContext';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { auth, storage } from '../firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { NotificationManager,NotificationContainer } from 'react-notifications';

function Sidebar() {
  const[showProfile,setShowProfile]=useState(false);
  const {currentUser}=useContext(AuthContext);
  const[edit,setEdit]=useState(false);
  const[displayname,setDisplayname]=useState(currentUser.displayName);
  const[filename,setFilename]=useState(null);
  const[fullscreen,setFullscreen]=useState(false);

  const handleProfile=()=>{
    console.log("handleProfile");
    setShowProfile(!showProfile);
  }
  const editProfile=()=>{
    setEdit(true);
  }
  const updateProfile = () => {

    if (filename && displayname !== currentUser.displayName) {
      // Update display name
      updateAuthProfile(auth.currentUser, {
        displayName: displayname,
      })
        .then(() => {
          console.log("update displayname succesfully");
          // Display name updated successfully
        })
        .catch((error) => {
          console.log("display name is not updated");
          // An error occurred while updating display name
        });

      // Upload new image file
      const fileRef = ref(storage,displayname);
      uploadBytes(fileRef, filename)
        .then(() => {
          console.log("Image file upload succesfully");
          // Image file uploaded successfully
        })
        .catch((error) => {
          console.log("Image file not uploaded succesfully");
          // An error occurred while uploading image file
        });
    } else if (filename) {
      // Upload new image file
      const fileRef = ref(storage, displayname);
      uploadBytes(fileRef, filename)
        .then(() => {
          console.log("Image file upload succesfully");
          // Image file uploaded successfully
        })
        .catch((error) => {
          console.log("Image file not uploaded succesfully");
          // An error occurred while uploading image file
        });
    } else {
      // Only update display name
      updateAuthProfile(auth.currentUser, {
        displayName: displayname,
      })
        .then(() => {
          console.log("update displayname succesfully");
          // Display name updated successfully
        })
        .catch((error) => {
          console.log("display name is not updated");
          // An error occurred while updating display name
        });
    }
    NotificationManager.info("Reload The Page");
  };

  
  return (
    <div className='sidebar'>
      <Navbar profileFun={handleProfile}/>
      {!showProfile && !fullscreen && <div className="nav-profile">
        <Search/>
        <div className="chatBar">
          <Chats/>
        </div>
      </div>}
      {showProfile && !fullscreen && <div className='profile'>
        <img id="dp"src={currentUser.photoURL} alt='User'onClick={()=>setFullscreen(true)}/>
        {edit && <div><input style={{display:"none"}} type='file' id="file" onChange={(e)=>setFilename(e.target.files[0])}/>
        <label htmlFor='file' className='uploadpic'>
          <MdOutlineAddPhotoAlternate size={30}/>
        </label></div>}
        {!edit ? <p>{currentUser.displayName }</p>:<input type="text" value={displayname} onChange={(e)=>setDisplayname(e.target.value)}/>}
        {!edit && <button className="pro-but" onClick={editProfile}>EDIT</button>}
        {edit && <div className="pro-buttons"><button onClick={()=>setEdit(false)}>Cancel</button><button onClick={updateProfile} >Save</button></div>}
        
      </div>}
      {fullscreen && <img className="full-img" src={currentUser.photoURL} alt='user' onClick={()=>setFullscreen(false)}/>}
      <NotificationContainer/>
    </div>
  )
}

export default Sidebar