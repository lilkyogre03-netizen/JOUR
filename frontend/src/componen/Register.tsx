import { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./style.css"
function Register() {
  const [nama,setnama]=useState('')
  const[email,setemail]=useState('')
  const [password,setpassword]=useState('')
  const [tanggal_lahir,settanggal_lahir]=useState('')
  const [error,seterror]=useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      const Postdata = await fetch ('http://127.0.0.1:5000/register',{
        method : 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({nama,email,password,tanggal_lahir})
    })
    const data= await Postdata.json()
    if(data.id){
            navigate("/login")
    } else {
        seterror(data.error)
    }
  };
  return (
    <div className='pageRegis'>
      <div className='bg'>
        <img className='bgGlobe' src="/GLOBE_DAY1.png" alt="siang" />
      </div>
      
      <div className='wrapRegis'>
         <h1>Register</h1>
        <form  onSubmit={handleSubmit}>        
          <input 
            className='regisbox'
            type="name"
            value={nama}
            onChange={(e) => setnama(e.target.value)}
            placeholder="text"/>
          <input 
            className='regisbox' 
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Email"/>
          <input 
            className='regisbox' 
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Password"/>
          <input 
            className='regisbox' 
            type="date"
            value={tanggal_lahir}
            onChange={(e) => settanggal_lahir(e.target.value)}
            placeholder="tanggal_lahir"/>
            <button className='daftarButton' type="submit">Daftar</button>
        </form>
      </div>
      <p>{error}</p>
    </div>
  );
}

export default Register;