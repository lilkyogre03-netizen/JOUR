import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './style.css';

interface MoodPoint {
  tanggal: string;
  mood: number;
}

function Statistik() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<MoodPoint[]>([]);

  const hariIni = new Date();
  const bulan = hariIni.getMonth() + 1;
  const tahun = hariIni.getFullYear();
  const hariIniString = hariIni.toISOString().split('T')[0];

  const namaBulan = hariIni.toLocaleDateString('id-ID', { month: 'long' });
  const tanggalFormatted = hariIni.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`http://127.0.0.1:5000/stats/mood?bulan=${bulan}&tahun=${tahun}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setData(result.entries);
    };
    fetchStats();
  }, []);

  const rataRata = data.length > 0
    ? data.reduce((total, item) => total + item.mood, 0) / data.length
    : 0;

  const hariBaik = data.filter((item) => item.mood >= 4).length;
  const hariNetral = data.filter((item) => item.mood === 3).length;
  const hariSedih = data.filter((item) => item.mood <= 2).length;

  const persenLingkaran = (rataRata / 5) * 100;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="statistik-layout">
      <div className="Videobg"><video src="/stary.mp4"></video></div>

      <nav className="statistik-navbar">
        <h1 className="judul">JOUR</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      <aside className="statistik-sidebar">
        <button onClick={() => navigate('/')}>Beranda</button>
        <button className="sidebar-active">Mood</button>
        <button onClick={() => navigate(`/journal/${hariIniString}`)}>Jurnal</button>
      </aside>

      <main className="statistik-content">
        <div className="labeltanggal">
          <span className="tanggal-line"></span>
          {tanggalFormatted}
        </div>

        <h1 className="statistik-title">Statistik Mood</h1>
        <p className="statistik-subtitle">Lihat bagaimana perasaanmu berubah dari waktu ke waktu.</p>

        <div className="statistik-card">
          <div className="statistik-card-header">
            <h2>Mood Bulanan</h2>
            <span>{namaBulan} {tahun}</span>
          </div>

          <div className="statistik-chart-area">
            <div className="statistik-legend">
              <span> Sangat Baik</span>
              <span> Baik</span>
              <span> Netral</span>
              <span> Sedih</span>
              <span> Sangat Sedih</span>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <XAxis
                  dataKey="tanggal"
                  tickFormatter={(val) => val.split('-')[2]}
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={12}
                />
                <YAxis domain={[1, 5]} stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#ffffff" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="statistik-summary">
          <div className="statistik-average">
            <div
              className="statistik-circle"
              style={{ background: `conic-gradient(white ${persenLingkaran}%, rgba(255,255,255,0.15) 0)` }}
            >
              <span>{rataRata.toFixed(1)}</span>
            </div>
            <div>
              <p className="summary-label">Rata-rata Mood</p>
              <p className="summary-sub">dari {data.length} entry bulan ini</p>
            </div>
          </div>

          <div className="statistik-pill"> {hariBaik} <span>Hari Baik</span></div>
          <div className="statistik-pill"> {hariNetral} <span>Hari Netral</span></div>
          <div className="statistik-pill"> {hariSedih} <span>Hari Sedih</span></div>
        </div>

        <button className="kembali" onClick={() => navigate('/')}>← Kembali</button>
      </main>

      <div className="Bumistatistik">
        <img src="/GLOBE_DAY1.png" alt="" className="BUMI" />
      </div>
    </div>
  );
}

export default Statistik;