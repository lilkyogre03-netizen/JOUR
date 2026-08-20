
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

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
  
const [Ismalam,setIsmalam]=useState(true)
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

  return (
    
  <div>
    <div className='bg'>
        <img className='bgGlobe' src={Ismalam?'/GLOBE_NIGHT1.png':'/GLOBE_DAY1.png'} alt="siang" onClick={handleClickGlobe}/>
      </div>

    {tujuhHari.map((tanggal) => {
  const tanggalString = tanggal.toISOString().split('T')[0];
  const entryPagi = entries.find(
    (e) => e.tanggal === tanggalString && e.waktu_entry === 'pagi'
  );
  const entryMalam = entries.find(
    (e) => e.tanggal === tanggalString && e.waktu_entry === 'malam'
  );
  return (
    <div key={tanggalString}>
      <p>{tanggal.getDate()}</p>
      <p>Pagi: {entryPagi ? 'Ada' : 'Kosong'}</p>
      <p>Malam: {entryMalam ? 'Ada' : 'Kosong'}</p>
    </div>
  );
})}
  </div>
);
}

export default MainPage;
