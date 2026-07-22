import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';

const Navbar = ({ onLoginClick, user, onLogout, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: offsetTop - 80, // Adjust for navbar height
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        ...styles.navbar,
        backgroundColor: scrolled ? 'rgba(18, 18, 18, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      <div style={styles.logoContainer} onClick={() => { 
        if (onNavigate) onNavigate('home');
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
      }}>
        <span style={styles.logo}>Yamundra</span>
      </div>

      {!isMobile && (
        <div style={styles.linksContainer}>
          <button style={styles.link} onClick={() => scrollTo('about')}>About</button>
          <button style={styles.link} onClick={() => scrollTo('services')}>Services</button>
          <button style={styles.link} onClick={() => scrollTo('testimonials')}>Testimonials</button>
          <button style={styles.link} onClick={() => scrollTo('contact')}>Contact</button>
        </div>
      )}

      <div style={styles.rightSection}>
        {isMobile && (
          <div style={styles.mobileMenuContainer}>
            <button style={styles.hamburgerBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <FaBars />
            </button>
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={styles.mobileDropdown}
                >
                  <button style={styles.dropdownItem} onClick={() => { scrollTo('about'); setMobileMenuOpen(false); }}>About</button>
                  <button style={styles.dropdownItem} onClick={() => { scrollTo('services'); setMobileMenuOpen(false); }}>Services</button>
                  <button style={styles.dropdownItem} onClick={() => { scrollTo('testimonials'); setMobileMenuOpen(false); }}>Testimonials</button>
                  <button style={styles.dropdownItem} onClick={() => { scrollTo('contact'); setMobileMenuOpen(false); }}>Contact</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div style={styles.authContainer}>
        {user ? (
          <div style={styles.userMenu}>
            <motion.div
              style={styles.avatar}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user.username.charAt(0).toUpperCase()}
            </motion.div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={styles.dropdown}
                >
                  <div style={styles.dropdownHeader}>
                    <span style={styles.userName}>{user.username}</span>
                  </div>
                  <div style={styles.dropdownDivider}></div>
                  <motion.button
                    style={styles.dropdownItem}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={() => {
                      if (onNavigate) onNavigate('account');
                      setDropdownOpen(false);
                    }}
                  >
                    Manage account
                  </motion.button>
                  <div style={styles.dropdownDivider}></div>
                  <motion.button
                    style={{...styles.dropdownItem, color: '#ff6b6b'}}
                    whileHover={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false);
                    }}
                  >
                    Log out
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            onClick={onLoginClick}
            style={styles.loginBtn}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Log In
          </motion.button>
        )}
        </div>
      </div>
    </motion.nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '80px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 5%',
    zIndex: 100,
    transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease, border-bottom 0.3s ease, box-shadow 0.3s ease',
  },
  logoContainer: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--primary)',
    letterSpacing: '-0.5px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  linksContainer: {
    display: 'flex',
    gap: '2.5rem',
    alignItems: 'center',
  },
  link: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  authContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  loginBtn: {
    padding: '0.5rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--text-main)',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
  },
  userMenu: {
    position: 'relative',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: '2px solid rgba(255, 255, 255, 0.1)',
  },
  dropdown: {
    position: 'absolute',
    top: '55px',
    right: 0,
    backgroundColor: 'rgba(25, 25, 25, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.5rem',
    minWidth: '200px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownHeader: {
    padding: '0.75rem 1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    color: 'var(--text-main)',
    fontSize: '1.05rem',
    fontWeight: '600',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '0.25rem 0',
  },
  dropdownItem: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-main)',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'background-color 0.2s',
  },
  mobileMenuContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  hamburgerBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-main)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileDropdown: {
    position: 'absolute',
    top: '55px',
    right: 0,
    backgroundColor: 'rgba(25, 25, 25, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.5rem',
    minWidth: '150px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
  }
};

export default Navbar;
