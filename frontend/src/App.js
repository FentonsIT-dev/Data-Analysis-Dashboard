import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DataAnalysis from './pages/DataAnalysis';
import UploadExcel from './pages/UploadExcel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DataAnalysis />} />
      <Route path="/upload-excel" element={<UploadExcel />} />
    </Routes>
  );
}

export default App;
