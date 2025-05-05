import React from 'react';

function Footer() {
  const styles = {
    footer: {
      backgroundColor: '#004d00',
      color: 'white',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      width: 'calc(100% - 16rem)', // Adjust width to account for the sidebar
      marginLeft: '16rem', // Align the footer with the content
      boxSizing: 'border-box', // Include padding in width calculation
    },
    column: {
      flex: '1',
      margin: '0 1rem',
      minWidth: '200px',
      maxWidth: '300px',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      textAlign: 'left',
    },
    text: {
      marginBottom: '0.5rem',
      textAlign: 'left',
    },
    socialIcons: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    icon: {
      color: 'white',
      fontSize: '1.5rem',
      textDecoration: 'none',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.column}>
        <h3 style={styles.title}>About Us</h3>
        <p style={styles.text}>Hayleys Fentons Limited</p>
        <p style={styles.text}>180, Deans Road, Colombo 10, Sri Lanka</p>
        <p style={styles.text}><strong>Hotline:</strong> 0112102102</p>
        <p style={styles.text}><strong>Email:</strong> info@hayleysfentons.com</p>
      </div>
      <div style={styles.column}>
        <h3 style={styles.title}>Services</h3>
        <p style={styles.text}>Solar Power</p>
        <p style={styles.text}>Security & Communication</p>
        <p style={styles.text}>Fire Safety Solutions</p>
        <p style={styles.text}>Facilities Management</p>
      </div>
      <div style={styles.column}>
        <h3 style={styles.title}>Follow Us</h3>
        <div style={styles.socialIcons}>
          <a href="#" style={styles.icon}>FB</a>
          <a href="#" style={styles.icon}>TW</a>
          <a href="#" style={styles.icon}>IG</a>
          <a href="#" style={styles.icon}>LN</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
