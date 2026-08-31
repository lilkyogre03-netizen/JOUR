import { useState, useEffect } from 'react';
import { Await, data, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './style.css';

interface JournalEntryDetail {
  id: number;
  judul: string;
  pesan: string;
  mood: number;
  gambar: string | null;
  waktu_entry: string;
}

function JournalPage() {
  const { tanggal } = useParams();
  const { token } = useAuth();

  const [waktuAktif, setWaktuAktif] = useState<'pagi' | 'malam'>('pagi');
  const [dataPagi, setDataPagi] = useState<JournalEntryDetail | null>(null);
  const [dataMalam, setDataMalam] = useState<JournalEntryDetail | null>(null);
  const [judul, setJudul] = useState('');
  const [pesan, setPesan] = useState('');
  const [mood, setMood] = useState(5);

  useEffect(() => {
    const fetchPagi = async () => {
      const response = await fetch(`http://127.0.0.1:5000/entries/${tanggal}/pagi`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDataPagi(data);
      } else {
        setDataPagi(null);
      }
    };
    const fetchMalam = async () => {
      const response = await fetch(`http://127.0.0.1:5000/entries/${tanggal}/malam`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDataMalam(data);
      } else {
        setDataMalam(null);
      }
    };

    fetchPagi();
    fetchMalam();
  }, [tanggal, token]);

    useEffect(() => {
  const dataAktif = waktuAktif === 'pagi' ? dataPagi : dataMalam;
  
  if (dataAktif) {
    setMood(dataAktif.mood),
    setPesan(dataAktif.pesan),
    setJudul(dataAktif.judul)

  } else {
    setMood(5),
    setPesan(''),
    setJudul('')
  }
}, [waktuAktif, dataPagi, dataMalam]);
const getMoodColor = (nilai: number): string => {
  if (nilai <= 2) {
    return '#FF6B6B'; 
  } else if (nilai === 3) {
    return '#FFD93D'; 
  } else {
    return '#6BCB77'; 
  }
};
    const handleclicksubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
        const dataAktif = waktuAktif === 'pagi'? dataPagi : dataMalam;
        if (dataAktif) {
          const response = await fetch(`http://127.0.0.1:5000/entries/${tanggal}/${waktuAktif}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              judul: judul,
              pesan: pesan,
              mood: mood,
              tanggal:tanggal
            }),
          });
        } else {
            const response = await fetch(`http://127.0.0.1:5000/entries/${tanggal}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              judul: judul,
              pesan: pesan,
              mood: mood,
              tanggal:tanggal,
              waktu_entry:waktuAktif
            }),
          });
        }
    };
  return (
    <div className='journal-layout'>
      <div className='Videobg'><video src="/stary.mp4"></video></div>
      <form action="" className='journal-form-area'>
        <input className='inputJudul' type="text" value={judul} onChange={(e)=> setJudul(e.target.value)} placeholder='isi judul hari ini' />
        <textarea className='inputPesan' rows={20} value={pesan} onChange={(e)=> setPesan(e.target.value)}></textarea>
        <h1 className='judulMood'>SKALA MOOD ANDA :</h1>
        <div className="mood-container">
        <div className="mood-number" style={{ color: getMoodColor(mood) }}>
          {mood}
        </div>
        
        <input
          type="range"
          min={1}
          max={5}
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="mood-slider"
          style={{ accentColor: getMoodColor(mood) }}
            />
          </div>
          <button type='submit' className='submitJournal'>Simpan</button>
      </form>
      <div className='Bumicomponen'>
          <img src={waktuAktif === 'pagi' ? '/GLOBE_DAY1.png' : '/GLOBE_NIGHT1.png'} alt="" className='BUMI'/>
           
           <button className='togglewaktu' onClick={() => setWaktuAktif(waktuAktif === 'pagi' ? 'malam' : 'pagi')} >toggle waktu</button>
      </div>
    </div>
  );
}

export default JournalPage;