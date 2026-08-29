
import { Routes, Route } from 'react-router-dom';
import Login from './componen/LoginPage';
import Register from './componen/Register';
import MainPage from './componen/MainPage';
import ProtectedRoute from './componen/ProtectedRoute';
import JournalPage from './componen/JournalPage';
function App() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/' element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />
        <Route  path="/journal/:tanggal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>}/>
    </Routes>
  );
}

export default App;