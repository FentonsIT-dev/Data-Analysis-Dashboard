import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2'; // Import SweetAlert2

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]); // State for upload history
  const fileInputRef = useRef(null);

  // Styles
  const styles = {
    appContainer: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      backgroundColor: '#f9fafb',
      color: '#1f2937',
      margin: 0,
    },
    sidebar: {
      width: '16rem',
      flexShrink: 0, // Prevent the sidebar from shrinking
      backgroundColor: '#1f2937',
      color: 'white',
      height: '100vh', // Ensure the sidebar spans the full height
      position: 'fixed', // Fix the sidebar to the left
      top: 0,
      left: 0,
    },
    contentContainer: {
      flex: 1,
      marginLeft: '16rem', // Add margin to account for the fixed sidebar width
      padding: '2rem',
      boxSizing: 'border-box', // Include padding in width calculation
    },
    uploadSection: {
      maxWidth: '48rem',
      margin: '0 auto',
    },
    pageHeader: {
      marginBottom: '2rem',
    },
    pageTitle: {
      fontSize: '1.875rem',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '0.5rem',
    },
    pageSubtitle: {
      color: '#6b7280',
      marginTop: '0.5rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      marginBottom: '2rem',
    },
    cardHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1f2937',
      margin: 0,
    },
    cardSubtitle: {
      color: '#6b7280',
      fontSize: '0.875rem',
      marginTop: '0.25rem',
    },
    cardBody: {
      padding: '1.5rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHead: {
      backgroundColor: '#f9f9f9',
      fontWeight: 'bold',
    },
    tableCell: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
      textAlign: 'left',
    },
    navItemHover: {
      backgroundColor: '#374151'
    },
    navItemActive: {
      backgroundColor: '#3b82f6'
    },
    uploadZone: {
      border: '2px dashed #d1d5db',
      borderRadius: '0.5rem',
      padding: '2rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    uploadZoneHover: {
      borderColor: '#93c5fd',
      backgroundColor: '#f9fafb'
    },
    uploadZoneDragging: {
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff'
    },
    uploadZoneHasFile: {
      backgroundColor: '#eff6ff',
      borderColor: '#93c5fd'
    },
    uploadIcon: {
      display: 'block',
      width: '3rem',
      height: '3rem',
      margin: '0 auto 1rem',
      color: '#9ca3af'
    },
    uploadFileIcon: {
      display: 'block',
      width: '3rem',
      height: '3rem',
      margin: '0 auto 1rem',
      color: '#3b82f6'
    },
    uploadText: {
      color: '#4b5563',
      fontWeight: 500,
      marginBottom: '0.25rem'
    },
    uploadSubtext: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    fileName: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      color: '#1f2937'
    },
    fileSize: {
      color: '#6b7280',
      fontSize: '0.875rem',
      marginTop: '0.25rem'
    },
    fileRemove: {
      marginLeft: '0.5rem',
      color: '#6b7280',
      background: 'none',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      padding: '0.25rem'
    },
    fileRemoveHover: {
      color: '#ef4444'
    },
    fileInput: {
      display: 'none'
    },
    statusMessage: {
      padding: '1rem',
      borderRadius: '0.375rem',
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'flex-start'
    },
    statusIcon: {
      width: '1.25rem',
      height: '1.25rem',
      marginRight: '0.75rem',
      flexShrink: 0,
      marginTop: '0.125rem'
    },
    statusContent: {
      flex: 1
    },
    statusTitle: {
      fontWeight: 500,
      margin: 0
    },
    statusText: {
      fontSize: '0.875rem',
      marginTop: '0.25rem'
    },
    statusSuccess: {
      backgroundColor: '#ecfdf5',
      color: '#065f46'
    },
    statusError: {
      backgroundColor: '#fef2f2',
      color: '#b91c1c'
    },
    btnContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '1.5rem'
    },
    btn: {
      padding: '0.5rem 1.5rem',
      borderRadius: '0.375rem',
      fontWeight: 500,
      fontSize: '0.875rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    btnPrimary: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    btnPrimaryHover: {
      backgroundColor: '#2563eb'
    },
    btnDisabled: {
      backgroundColor: '#e5e7eb',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    btnUploading: {
      backgroundColor: '#d1d5db',
      color: '#4b5563',
      cursor: 'not-allowed'
    },
    historyEmpty: {
      textAlign: 'center',
      padding: '2rem 0',
      color: '#6b7280'
    },
    historyBox: {
      maxHeight: '300px', // Set a fixed height for the history box
      overflowY: 'auto', // Enable vertical scrolling
      border: '1px solid #ddd',
      borderRadius: '0.5rem',
      padding: '1rem',
      backgroundColor: '#fff',
    }
  };

  useEffect(() => {
    // Fetch upload history
    const fetchUploadHistory = async () => {
      try {
        //http://localhost:8081/excel/
        const response = await fetch('https://cooperative-surprise-production.up.railway.app/excel/');
        if (!response.ok) {
          throw new Error('Failed to fetch upload history');
        }
        const data = await response.json();
        setUploadHistory(data);
      } catch (error) {
        console.error('Error fetching upload history:', error.message);
      }
    };

    fetchUploadHistory();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
      setUploadStatus(null);
    } else {
      showAlert('error', 'Invalid File', 'Please select an Excel file (.xlsx or .xls)');
    }
  };

  const showAlert = (type, title, message) => {
    setUploadStatus({ type, title, message });
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select an Excel file to upload.',
      });
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('excelFile', file);

    //http://localhost:8081/excel/upload
    try {
      const response = await fetch('https://cooperative-surprise-production.up.railway.app/excel/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload the file.');
      }
      
      const result = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Upload Successful',
        text: result.message || 'Your Excel file has been uploaded and processed successfully!',
      });
      setFile(null);

      // Refresh upload history
      //http://localhost:8081/excel/
      const updatedHistory = await fetch('https://cooperative-surprise-production.up.railway.app/excel/').then((res) => res.json());
      setUploadHistory(updatedHistory);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setUploadStatus(null);
  };

  // Get upload zone styles based on state
  const getUploadZoneStyle = () => {
    let uploadZoneStyle = { ...styles.uploadZone };
    
    if (isDragging) {
      uploadZoneStyle = { ...uploadZoneStyle, ...styles.uploadZoneDragging };
    } else if (file) {
      uploadZoneStyle = { ...uploadZoneStyle, ...styles.uploadZoneHasFile };
    }
    
    return uploadZoneStyle;
  };

  // Get button styles based on state
  const getButtonStyle = () => {
    if (isUploading) {
      return { ...styles.btn, ...styles.btnUploading };
    } else if (!file) {
      return { ...styles.btn, ...styles.btnDisabled };
    } else {
      return { ...styles.btn, ...styles.btnPrimary };
    }
  };

  // Get status message styles based on type
  const getStatusMessageStyle = (type) => {
    if (type === 'success') {
      return { ...styles.statusMessage, ...styles.statusSuccess };
    } else {
      return { ...styles.statusMessage, ...styles.statusError };
    }
  };

  return (
    <div style={styles.appContainer}>
      <Sidebar />
      {/* Main content */}
      <div style={styles.contentContainer}>
        <div style={styles.uploadSection}>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Excel Data Upload</h1>
            <p style={styles.pageSubtitle}>Upload your Excel sheets for quick data processing and analysis</p>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Upload File</h2>
              <p style={styles.cardSubtitle}>Supported formats: .xlsx, .xls</p>
            </div>

            <div style={styles.cardBody}>
              <div 
                style={getUploadZoneStyle()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                onMouseOver={() => !file && !isDragging ? styles.uploadZoneHover : null}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  style={styles.fileInput}
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
                
                {!file ? (
                  <>
                    <svg style={styles.uploadIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p style={styles.uploadText}>Drag and drop your Excel file here</p>
                    <p style={styles.uploadSubtext}>Or click to browse files</p>
                  </>
                ) : (
                  <>
                    <svg style={styles.uploadFileIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <div style={styles.fileName}>
                        {file.name}
                        <button 
                          style={styles.fileRemove}
                          onClick={clearFile}
                          onMouseOver={(e) => e.target.style.color = '#ef4444'}
                          onMouseOut={(e) => e.target.style.color = '#6b7280'}
                        >
                          ×
                        </button>
                      </div>
                      <p style={styles.fileSize}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </>
                )}
              </div>

              {uploadStatus && (
                <div style={getStatusMessageStyle(uploadStatus.type)}>
                  {uploadStatus.type === 'success' ? (
                    <svg style={styles.statusIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg style={styles.statusIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <div style={styles.statusContent}>
                    <p style={styles.statusTitle}>{uploadStatus.title}</p>
                    <p style={styles.statusText}>{uploadStatus.message}</p>
                  </div>
                </div>
              )}

              <div style={styles.btnContainer}>
                <button 
                  style={getButtonStyle()}
                  onClick={handleUpload}
                  disabled={isUploading || !file}
                  onMouseOver={(e) => {
                    if (file && !isUploading) {
                      e.target.style.backgroundColor = '#2563eb';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (file && !isUploading) {
                      e.target.style.backgroundColor = '#3b82f6';
                    }
                  }}
                >
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Upload History</h2>
            </div>
            <div style={styles.cardBody}>
              {uploadHistory.length > 0 ? (
                <div style={styles.historyBox}>
                  <table style={styles.table}>
                    <thead style={styles.tableHead}>
                      <tr>
                        <th style={styles.tableCell}>File Name</th>
                        <th style={styles.tableCell}>Upload Date</th>
                        <th style={styles.tableCell}>Sheet Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadHistory.map((file, index) => (
                        <tr key={index}>
                          <td style={styles.tableCell}>{file.fileName}</td>
                          <td style={styles.tableCell}>{new Date(file.uploadDate).toLocaleString()}</td>
                          <td style={styles.tableCell}>{file.sheetName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No upload history available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadExcel;