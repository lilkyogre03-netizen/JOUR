
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Calendar } from 'lucide-react';
interface JournalEntry {
  id: number;
  tanggal: string;
  judul: string;
  mood: number;
  waktu_entry: string;
}

function MainPage() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const navigate=useNavigate();
const [Ismalam,setIsmalam]=useState(false)
const hariIni = new Date();
const angkaHari = hariIni.getDay();
const jarakKeSenin = (angkaHari - 1 + 7) % 7;
const senin = new Date(hariIni);
senin.setDate(senin.getDate() - jarakKeSenin);
const tujuhHari: Date[] = [];
for (let i = 0; i < 7; i++) {
  const tanggal = new Date(senin);
  tanggal.setDate(tanggal.getDate() + i);
  tujuhHari.push(tanggal);
}
const hariIniString = hariIni.toISOString().split('T')[0];
const handleClickGlobe =()=>{
  setIsmalam(!Ismalam)
}

useEffect(() => {
  const bulanIni = hariIni.getMonth() + 1;
  const tahunIni = hariIni.getFullYear();
  const fetchEntries = async () => {
    const response = await fetch(`http://127.0.0.1:5000/entries?bulan=${bulanIni}&tahun=${tahunIni}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }); 
    const data = await response.json(); 
    setEntries(data.entries);
  }; 
  fetchEntries();
}, []); 

const [namaUser, setNamaUser] = useState('');

useEffect(() => {
  const fetchProfile = async () => {
    const response = await fetch(`http://127.0.0.1:5000/profile`,{
    method:'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data=await response.json();
    setNamaUser(data.nama)
  };
  fetchProfile();
}, []);
  return (
    
<div className='page-wrapper'>

  <div className='navbar'>
    <h1 className='judul'>JOUR</h1>
    <div className='iconNavbar'>
      <div className='icon_nav' onClick={() => navigate('/stastistik')}>
        <h1><BarChart3 size={18} /></h1>
      </div >
      <div className='icon_nav' onClick={() => navigate('/kalender')}>
        <h1><Calendar size={18} /></h1>
      </div>
      <div className='icon_nav' onClick={() => navigate('/login')}>
        <h1>Log-Out</h1>
      </div>
    </div> 
  </div>

  <div >
    <h1 className='Namauser'>
      HAI {namaUser}....
    </h1>
    <p className='kata1' >
      Jangan lupa minum hari ini dan hari selanjutnya
    </p>
    < p className='kata2'>
      Ayok tulis kesan pesan mu untuk hari ini
    </p>
  </div>
  
  <button className='write-btn' onClick={() => navigate(`/journal/${hariIniString}`)}>
  Write
  </button>
  <div className='Videobg'>
    <video src="/stary.mp4"></video>
  </div>

    <div className='bg_main'>
      <img
        className='bgGlobe_main'
        src={Ismalam ? '/GLOBE_NIGHT1.png' : '/GLOBE_DAY1.png'}
        alt="siang"
        onClick={handleClickGlobe}
      />

      <div className='semuabola'>
        {tujuhHari.map((tanggal) => {
          const tanggalString = tanggal.toISOString().split('T')[0];
          const entryPagi = entries.find(
            (e) => e.tanggal === tanggalString && e.waktu_entry === 'pagi'
          );
          const entryMalam = entries.find(
            (e) => e.tanggal === tanggalString && e.waktu_entry === 'malam'
          );
          const handleClickBola = () => {
            navigate(`/journal/${tanggalString}`);
          };

          return (
            <div className='Bolabola' key={tanggalString} onClick={handleClickBola}>
              <p>{tanggal.getDate()}</p>
              {/* <p>Pagi: {entryPagi ? 'Ada' : 'Kosong'}</p>
              <p>Malam: {entryMalam ? 'Ada' : 'Kosong'}</p> */}
            </div>
          );
        })}
      </div>
    

    </div>
  </div>
);
}

export default MainPage;
