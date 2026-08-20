import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React from 'react'
import './style.css'
function Login() {
const [email,setemail]=useState('');
const [password,setpassword]=useState('');
const [error,seterror]=useState('');
const navigate = useNavigate();
const{login}=useAuth();
const  handleSubmit =async (e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    const postauth = await fetch ('http://127.0.0.1:5000/login',{
        method : 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({email,password})
    })
    const data = await postauth.json()
    if (data.token) {
        login(data.token)
        navigate('/')
    } else {
        seterror(data.error)
    }
  };
  return (
    <div className='pageLogin'>
      <div className='bg'>
        <img className='bgGlobe' src="/GLOBE_DAY1.png" alt="siang" />
      </div>
      <div className='wrapperLogin'>
        <h1 >Login</h1>
        <form onSubmit={handleSubmit}>
          <input 
            className='inputBox'          
            type="email" 
            value={email} 
            onChange={(e) => setemail(e.target.value)} 
            placeholder="Email"
          />
          <input
          className='inputBox' 
            type="password" 
            value={password} 
            onChange={(e) => setpassword(e.target.value)} 
            placeholder="Password"
          />
          <button className='submitbutton' type='submit'>SUBMIT</button>
          <div className='RegisterLink'>
            <p>
              Belum punya akun? <Link className='Linkregis' to="/register">Daftar di sini</Link>
            </p>
          </div>
        </form>
        <h1>{error}</h1>
      </div>
      
    </div>
  );
}

export default Login;  

