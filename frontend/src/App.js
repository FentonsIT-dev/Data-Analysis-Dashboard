import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DataAnalysis from './pages/DataAnalysis';
import UploadExcel from './pages/UploadExcel';
import Footer from './components/Footer'; // Correct capitalization

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DataAnalysis />} />
        <Route path="/upload-excel" element={<UploadExcel />} />
      </Routes>
      <Footer /> {/* Add Footer */}
    </>
  );
}

export default App;
