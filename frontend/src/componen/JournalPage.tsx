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

    const handleclicksubmit = async () => {
        const dataAktif = waktuAktif === 'pagi';
        if (dataAktif) {
          const response = await fetch(`http://127.0.0.1:5000/entries/${tanggal}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              judul: judul,
              pesan: pesan,
              mood: mood,
            }),
          });
          const data = await response.json();
          setJudul(data.judul),
          setPesan(data.pesan),
          setMood(data.mood)
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
            }),
          });
        const data = await response.json();
          setJudul(data.judul),
          setPesan(data.pesan),
          setMood(data.mood)
        }
    };
  return (
    <div>
      <h1>Journal untuk tanggal: {tanggal}</h1>
      <div className='Videobg'><video src="./stary.mp4"></video></div>
      <div className='Bumicomponen'><img src={waktuAktif ? '/GLOBE_DAY1.png' : '/GLOBE_NIGHT1.png'} alt="" /></div>
      {/* <div><button onClick={ada}>TOGGLE WAKTU</button></div> */}
    </div>
  );
}

export default JournalPage;