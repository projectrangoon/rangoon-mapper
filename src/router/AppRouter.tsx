import { Navigate, Route, Routes } from 'react-router-dom';

import MainPage from '@/pages/MainPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/directions/:startStop/:endStop" element={<MainPage />} />
      <Route path="/bus" element={<MainPage />} />
      <Route path="/bus/:serviceName" element={<MainPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
