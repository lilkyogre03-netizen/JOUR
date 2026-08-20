import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth=useAuth()
  if (!auth.token) {
    return <Navigate to="/login"/>
  } else {
    return children
  }

}

export default ProtectedRoute;