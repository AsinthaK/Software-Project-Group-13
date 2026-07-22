import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AccountPage = ({ user, onLogout, setUser }) => {
  const [activeTab, setActiveTab] = useState('manage');
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Update local form state if global user state changes
  useEffect(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (field) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setUser({ ...user, ...formData });
        setEditingField(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while saving.');
    }
  };

  const renderField = (label, name, type = "text") => {
    const isEditing = editingField === name;
    return (
      <div style={name === 'email' || name === 'phone' ? { ...styles.formGroup, gridColumn: '1 / -1' } : styles.formGroup}>
        <label style={styles.label}>{label}</label>
        <div style={{...styles.inputWrapper, border: isEditing ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)'}}>
          <input 
            type={type} 
            name={name}
            value={formData[name]} 
            onChange={handleChange}
            readOnly={!isEditing} 
            style={styles.input} 
          />
        </div>
        {isEditing ? (
          <div style={styles.actionButtons}>
            <button style={styles.saveBtn} onClick={() => handleSave(name)}>Save</button>
            <button style={styles.cancelBtn} onClick={() => {
              setEditingField(null);
              // Revert changes
              setFormData({ ...formData, [name]: user?.[name] || '' });
            }}>Cancel</button>
          </div>
        ) : (
          <button style={styles.editBtn} onClick={() => setEditingField(name)}>
            Edit {label}
          </button>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'manage':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={styles.mainContent}
          >
            <h2 style={styles.sectionTitle}>Manage Account</h2>
            <div style={styles.divider}></div>
            
            <div style={styles.formGrid}>
              {renderField('First name', 'firstName')}
              {renderField('Last name', 'lastName')}
              {renderField('Email address', 'email', 'email')}
              {renderField('Phone number', 'phone')}
            </div>

            <div style={styles.actionContainer}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={styles.changePasswordBtn}
              >
                Change Password
              </motion.button>
            </div>
          </motion.div>
        );
      case 'bookings':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.mainContent}
          >
            <h2 style={styles.sectionTitle}>View Bookings</h2>
            <div style={styles.divider}></div>
            <p style={styles.placeholderText}>You have no upcoming bookings.</p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.dashboardContainer}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div style={styles.avatarLarge}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 style={styles.sidebarUsername}>{user?.username || 'User'}</h3>
          </div>
          
          <div style={styles.sidebarMenu}>
            <button 
              className={`sidebar-btn ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              Manage account
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              View bookings
            </button>
            <button 
              className="sidebar-btn sidebar-btn-danger"
              onClick={() => { /* Delete account logic */ }}
            >
              Delete Account
            </button>
            <button 
              className="sidebar-btn sidebar-btn-danger"
              style={{ marginTop: 'auto' }}
              onClick={onLogout}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainArea}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    paddingTop: '100px', // to account for navbar
    paddingBottom: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1,
    position: 'relative',
  },
  dashboardContainer: {
    display: 'flex',
    width: '90%',
    maxWidth: '1200px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    minHeight: '600px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
  sidebar: {
    width: '280px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 0',
  },
  sidebarHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '0 2rem',
  },
  avatarLarge: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '1rem',
    border: '3px solid rgba(255, 255, 255, 0.1)',
  },
  sidebarUsername: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  sidebarMenu: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  mainArea: {
    flex: 1,
    padding: '3rem',
    overflowY: 'auto',
  },
  mainContent: {
    maxWidth: '800px',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '0.5rem',
  },
  divider: {
    width: '40px',
    height: '4px',
    backgroundColor: 'var(--secondary)',
    borderRadius: '2px',
    marginBottom: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '3rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-muted)',
    marginBottom: '0.5rem',
  },
  inputWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-main)',
    fontSize: '1rem',
    outline: 'none',
  },
  editBtn: {
    alignSelf: 'flex-start',
    background: 'transparent',
    border: 'none',
    color: 'var(--primary)',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  saveBtn: {
    background: 'var(--primary)',
    border: 'none',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '0.4rem 1rem',
    borderRadius: '4px',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '0.4rem 1rem',
    borderRadius: '4px',
  },
  actionContainer: {
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  changePasswordBtn: {
    padding: '0.8rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--primary)',
    color: 'var(--primary)',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  placeholderText: {
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
  }
};

export default AccountPage;
