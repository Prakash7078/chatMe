import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';


function Login() {
  const[err,setErr]=useState(false);
  const navigate=useNavigate();
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const email=e.target[0].value;
    const password=e.target[1].value;
    try{
      signInWithEmailAndPassword(auth, email, password);
      alert("click again");
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
                {err && <span>Something went wrong</span>}
                <p>Create an account? <Link to="/signup">Sign Up</Link></p>
            </form>
        </div>
    </div>
  )
}

export default Login