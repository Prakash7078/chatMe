import React, { useState } from 'react'
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword,updateProfile} from "firebase/auth";
import {auth,storage,db} from '../firebase';
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
function Register() {
  const[err,setErr]=useState(false);
  const navigate =useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
  
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          (error) => {
            setErr(true);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then(async (downloadURL) => {
                await updateProfile(res.user, {
                  displayName,
                  photoURL: downloadURL,
                });
  
                await setDoc(doc(db, "users", res.user.uid), {
                  uid: res.user.uid,
                  displayName,
                  email,
                  photoURL: downloadURL,
                });
                await setDoc(doc(db, "userChats", res.user.uid), {});
                navigate("/");
              })
          }
        );
    } catch (err) {
      setErr(true);
    }
  };
  
  return (
    <div className='formContainer'>
        <div className="formWrapper">
            <span className='logo'>Free Chat</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='display name'/>
                <input type='email' placeholder='email'/>
                <input type='password' placeholder='password'/>
                <input  type='file' id="file"/>
                <button>Sign Up</button>
                {err && NotificationManager.info("loading...")}
                <p>already have an account? <Link to="/login">Login</Link></p>
            </form>
            
        </div>
        <NotificationContainer/>
    </div>
  )
}

export default Register