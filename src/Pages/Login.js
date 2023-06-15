import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

function Login() {
  const[err,setErr]=useState(false);
  const navigate=useNavigate();
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const email=e.target[0].value;
    const password=e.target[1].value;
    try{
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    }catch(err){
      setErr(true);
    }
  }
  return (
    <div className='formContainer'>
        <div className="formWrapper">
            <span className='logo'>Free Chat</span>
            <span className="title">Login</span>
            <form onSubmit={handleSubmit}>
                <input type='email' placeholder='email'/>
                <input type='password' placeholder='password'/>
                <button >Sign In</button>
                {err && NotificationManager.error("Invalid credentials")}
                <p>Create an account? <Link to="/signup">Sign Up</Link></p>
            </form>
        </div>
        <NotificationContainer/>
    </div>
  )
}

export default Login