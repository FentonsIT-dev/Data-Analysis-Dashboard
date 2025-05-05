import React from 'react';

function Header() {
  const styles = {
    header: {
      backgroundColor: '#004d00',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    nav: {
      display: 'flex',
      gap: '1rem',
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: 500,
      transition: 'color 0.2s',
    },
    navLinkHover: {
      color: '#00ff00',
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>Fentons Dashboard</div>
      <nav style={styles.nav}>
        <a
          href="/"
          style={styles.navLink}
          onMouseOver={(e) => (e.target.style.color = styles.navLinkHover.color)}
          onMouseOut={(e) => (e.target.style.color = 'white')}
        >
          Home
        </a>
        <a
          href="/upload-excel"
          style={styles.navLink}
          onMouseOver={(e) => (e.target.style.color = styles.navLinkHover.color)}
          onMouseOut={(e) => (e.target.style.color = 'white')}
        >
          Upload Excel
        </a>
      
      </nav>
    </header>
  );
}

export default Header;
