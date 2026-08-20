
import { Routes, Route } from 'react-router-dom';
import Login from './componen/LoginPage';
import Register from './componen/Register';
import MainPage from './componen/MainPage';
import ProtectedRoute from './componen/ProtectedRoute';
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
    </Routes>
  );
}

export default App;