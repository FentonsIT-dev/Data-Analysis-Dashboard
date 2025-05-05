import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ChevronDown, ChevronUp, BarChart2, PieChart as PieChartIcon, Table2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import this after jsPDF
import './DataAnalysis.css';
import img from '../images/img.png';

const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    backgroundColor: '#f4f4f4',
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
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    padding: '20px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeadCell: {
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  tableBodyCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

function DataAnalysis() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('table');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [numericColumns, setNumericColumns] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(''); // State to store the selected ID
  const [lastId, setLastId] = useState(''); // State to store the last ID
  const [jobStatusData, setJobStatusData] = useState([]); // State to store job status data
  const [latestJobStatusData, setLatestJobStatusData] = useState([]); // State for latest job status
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  // Jobs summary data
  const jobsSummary = {
    total: 22,
    completed: 13,
    inProgress: 6,
    pending: 3,
    date: '23/04/2025'
  };

  // Function to fetch the last ID
  const fetchLastId = async () => {
    try {
      const response = await fetch('http://localhost:8081/excel');
      if (!response.ok) {
        throw new Error('Failed to fetch Excel files');
      }
      const files = await response.json();
      if (files.length > 0) {
        const lastFile = files[files.length - 1];
        setLastId(lastFile._id);
        fetchDataById(lastFile._id);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No Files Found',
          text: 'No Excel files are available in the database.',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error Fetching Files',
        text: err.message,
      });
      console.error('Error fetching last ID:', err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    console.log("Fetching data from backend...");
    fetch('http://localhost:8081/excel/all-rows')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((fetchedData) => {
        console.log("Fetched data:", fetchedData);
        setData(fetchedData);
        setFilteredData(fetchedData);
        setLoading(false);
        
        if (fetchedData.length > 0) {
          const numericCols = Object.keys(fetchedData[0]).filter(key => {
            return !isNaN(parseFloat(fetchedData[0][key]));
          });
          setNumericColumns(numericCols);
          if (numericCols.length > 0) {
            setSelectedColumn(numericCols[0]);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:8081/excel/job-status')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch job status data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Job Status Data:', data); // Debugging: Log fetched data
        setJobStatusData(data);
      })
      .catch((err) => {
        console.error('Error fetching job status data:', err.message);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:8081/excel/latest-job-status')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch latest job status data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Latest Job Status Data:', data); // Debugging: Log fetched data
        setLatestJobStatusData(data);
      })
      .catch((err) => {
        console.error('Error fetching latest job status data:', err.message);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  // Fetch data by ID
  const fetchDataById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/excel/${id}`); // Fetch data by ID
      if (!response.ok) {
        throw new Error('Failed to fetch data by ID');
      }
      const fetchedData = await response.json();
      console.log('Fetched data by ID:', fetchedData);
      setData(fetchedData.data); // Set the data
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data by ID:', err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleIdChange = (e) => {
    setSelectedId(e.target.value); // Update the selected ID
  };

  const handleFetchById = () => {
    if (selectedId.trim()) {
      fetchDataById(selectedId); // Fetch data for the entered ID
    } else {
      alert('Please enter a valid ID');
    }
  };

  const calculateJobCounts = () => {
    const jobCounts = {
      total: filteredData.length,
      completed: 0,
      inProgress: 0,
      pending: 0,
    };

    filteredData.forEach((row) => {
      const status = row["Job Status"]; // Use "Job Status" column
      if (status === "Completed") jobCounts.completed += 1;
      else if (status === "In Progress") jobCounts.inProgress += 1; // Increment for "In Progress"
      else if (status === "Pending") jobCounts.pending += 1;
    });

    return jobCounts;
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const prepareChartData = () => {
    if (!selectedColumn || numericColumns.length === 0) return [];

    const aggregatedData = {};
    
    filteredData.forEach(row => {
      const value = row[selectedColumn];
      if (value !== undefined && value !== null) {
        if (aggregatedData[value]) {
          aggregatedData[value] += 1;
        } else {
          aggregatedData[value] = 1;
        }
      }
    });
    
    return Object.keys(aggregatedData).map(key => ({
      name: key,
      value: aggregatedData[key]
    }));
  };

  const prepareFaultTypeChartData = () => {
    const faultTypeCounts = {};

    // Count occurrences of each fault type
    filteredData.forEach((row) => {
      const faultType = row["Fault Type"]; // Replace with the exact column name for fault type
      if (faultType) {
        faultTypeCounts[faultType] = (faultTypeCounts[faultType] || 0) + 1;
      }
    });

    // Convert counts to chart data format
    return Object.keys(faultTypeCounts).map((key) => ({
      name: key,
      value: faultTypeCounts[key],
    }));
  };

  const getCellStyle = (key, value) => {
    // Status colors
    if (key === 'status') {
      if (value === 'Completed') return 'cell-green';
      if (value === 'In Progress') return 'cell-yellow';
      if (value === 'Pending') return 'cell-red';
    }
    
    // Priority colors
    if (key === 'priority') {
      if (value === 'High') return 'cell-red';
      if (value === 'Medium') return 'cell-yellow';
      if (value === 'Low') return 'cell-green';
    }
    
    // Fault type colors
    if (key === 'faultType') {
      if (value === 'Critical') return 'cell-red';
      if (value === 'Warning') return 'cell-yellow';
      if (value === 'Info') return 'cell-blue';
    }
    
    // Numeric value colors
    if (numericColumns.includes(key)) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (numValue > 0) return 'cell-green';
        if (numValue < 0) return 'cell-red';
      }
    }
    
    return 'cell-default';
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-text">Loading data...</div>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h2 className="error-title">Error</h2>
      <p>{error}</p>
    </div>
  );

  const chartData = prepareChartData();
  const faultTypeChartData = prepareFaultTypeChartData();
  const sortedData = getSortedData();
  const jobCounts = calculateJobCounts();

  return (
    <div style={styles.appContainer}>
      <Sidebar />
      <div style={styles.contentContainer}>
        <div className="dashboard-container">
          <div className="content-wrapper">
            <div className="cover-photo-container">
              <img src={img} alt="Cover" className="cover-photo" />
            </div>

            <h1 className="dashboard-header">Data Analysis Dashboard</h1>
            
            <div style={styles.card}>
              <div className="controls-container">
                <input
                  type="text"
                  placeholder="Search in data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select 
                  value={selectedColumn} 
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="column-select"
                >
                  <option value="">Select column for charts</option>
                  {numericColumns.map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input to fetch data by ID */}
            <div style={styles.card}>
              <div className="id-fetch-container">
           
                
              <button 
  onClick={fetchLastId} 
  style={{ 
    backgroundColor: '#4CAF50', 
    color: 'white', 
    padding: '10px 20px', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer' 
  }}
>
 Refesh Table 
</button>

              </div>
            </div>

            {/* Pie Chart for Fault Type */}
            <div style={styles.card}>
              <h2 style={styles.chartTitle}>Fault Type Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={faultTypeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {faultTypeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>


            {/* Latest Job Status Section */}
            <div style={styles.card}>
              <h2 style={styles.chartTitle}>Latest Job Status Distribution</h2>
              {latestJobStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={latestJobStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                    >
                      {latestJobStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p>No latest job status data available</p>
              )}
            </div>

            <div style={styles.card}>
              <div className="tabs-container">
                <button 
                  className={`tab-button ${activeTab === 'table' ? 'active' : ''}`}
                  onClick={() => setActiveTab('table')}
                >
                  <Table2 size={16} /> Table View
                </button>
                <button 
                  className={`tab-button ${activeTab === 'bar' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bar')}
                >
                  <BarChart2 size={16} /> Bar Chart
                </button>
                <button 
                  className={`tab-button ${activeTab === 'pie' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pie')}
                >
                  <PieChartIcon size={16} /> Pie Chart
                </button>
              </div>
              <div>
                {activeTab === 'table' && (
                  <div style={styles.tableContainer}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          {Object.keys(sortedData[0] || {}).map((key, index) => (
                            <th key={index} onClick={() => requestSort(key)} style={styles.tableHeadCell}>
                              <div className="head-cell-content">
                                {key} {getSortIcon(key)} {/* Add sorting indicator */}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedData.slice(0, 20).map((row, index) => ( // Display 20 rows per page
                          <tr key={index} className={`table-body-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                            {Object.entries(row).map(([key, value], idx) => (
                              <td key={idx} style={styles.tableBodyCell} className={getCellStyle(key, value)}>
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {sortedData.length > 20 && ( // Add pagination controls
                      <div className="pagination-info">
                        Showing 20 rows out of {sortedData.length}
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'bar' && (
                  <div className="chart-container">
                    <h2 style={styles.chartTitle}>Distribution of {selectedColumn || 'Faults'}</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={selectedColumn ? chartData : prepareFaultTypeChartData()} // Use fault data if no column is selected
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name={selectedColumn ? 'Count' : 'Fault Count'} 
                          fill="#8884d8" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                {activeTab === 'pie' && selectedColumn && (
                  <div className="chart-container">
                    <h2 style={styles.chartTitle}>
                      Distribution of {selectedColumn}
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
            
            <div style={styles.card}>
              <h2 className="stats-title">Job Status Summary</h2>
              <div className="summary-grid">
                <div className="summary-card summary-card-blue">
                  <p className="summary-label summary-label-blue">Total Jobs</p>
                  <p className="summary-value">{jobCounts.total}</p>
                </div>
                <div className="summary-card summary-card-green">
                  <p className="summary-label summary-label-green">Completed</p>
                  <p className="summary-value">{jobCounts.completed}</p>
                </div>
                <div className="summary-card summary-card-yellow">
                  <p className="summary-label summary-label-yellow">In Progress</p>
                  <p className="summary-value">{jobCounts.inProgress}</p>
                </div>
                <div className="summary-card summary-card-red">
                  <p className="summary-label summary-label-red">Pending</p>
                  <p className="summary-value">{jobCounts.pending}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataAnalysis;