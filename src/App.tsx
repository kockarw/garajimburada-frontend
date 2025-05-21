import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GarageDetailPage from './pages/GarageDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import CreateGaragePage from './pages/CreateGaragePage';
import NotFoundPage from './pages/NotFoundPage';
import Toast from './components/Toast';
import MyGarageAdsPage from './pages/MyGarageAdsPage';
import EditGaragePage from './pages/EditGaragePage';
import AccountPage from './pages/AccountPage';
import AppointmentList from './pages/appointments/AppointmentList';
import AppointmentForm from './pages/appointments/AppointmentForm';

function App() {
  const { user } = useAuth();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="garage/:id" element={<GarageDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          {user && (
            <>
              <Route path="add-garage" element={<CreateGaragePage />} />
              <Route path="my-garage-ads" element={<MyGarageAdsPage />} />
              <Route path="edit-garage/:id" element={<EditGaragePage />} />
              <Route path="account" element={<AccountPage />} />
              
              {/* Randevu Route'ları */}
              <Route path="appointments" element={<AppointmentList />} />
              <Route path="appointment/new" element={<AppointmentForm />} />
              <Route path="appointment/new/:garageId" element={<AppointmentForm />} />
            </>
          )}
          {user?.is_admin && (
            <Route path="admin" element={<AdminPage />} />
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toast />
    </>
  );
}

export default App;