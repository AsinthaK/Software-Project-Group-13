import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ContactUs = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);
  const infoY = useTransform(scrollYProgress, [0, 1], ["80%", "-80%"]);
  const formY = useTransform(scrollYProgress, [0, 1], ["120%", "-120%"]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    alert('Thank you for your message! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section ref={containerRef} style={styles.section}>
      <div style={styles.container}>
        <motion.div 
          style={{ ...styles.header, y: headerY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={styles.title}>Get In Touch</h2>
          <div style={styles.divider}></div>
          <p style={styles.subtitle}>Have questions? We're here to help.</p>
        </motion.div>
        
        <div style={styles.content}>
          <motion.div 
            style={{ ...styles.contactInfo, y: infoY }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div style={styles.infoBlock}>
              <div style={styles.iconWrapper}>📍</div>
              <div>
                <h4 style={styles.infoTitle}>Our Location</h4>
                <p style={styles.infoText}>123 Smash Avenue, Sports District<br />Metropolis, NY 10001</p>
              </div>
            </div>
            
            <div style={styles.infoBlock}>
              <div style={styles.iconWrapper}>📞</div>
              <div>
                <h4 style={styles.infoTitle}>Phone Number</h4>
                <p style={styles.infoText}>+1 (555) 123-4567<br />Mon-Fri, 9am - 8pm</p>
              </div>
            </div>
            
            <div style={styles.infoBlock}>
              <div style={styles.iconWrapper}>✉️</div>
              <div>
                <h4 style={styles.infoTitle}>Email Address</h4>
                <p style={styles.infoText}>info@yamundra.academy<br />support@yamundra.academy</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            style={{ ...styles.formContainer, y: formY }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} style={styles.form}>
              <div className="input-group">
                <label htmlFor="contact-name">Full Name</label>
                <input 
                  type="text" 
                  id="contact-name"
                  name="name"
                  className="input-field" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="contact-email">Email Address</label>
                <input 
                  type="email" 
                  id="contact-email"
                  name="email"
                  className="input-field" 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="contact-message">Message</label>
                <textarea 
                  id="contact-message"
                  name="message"
                  className="input-field" 
                  placeholder="How can we help you?"
                  rows="4"
                  style={{ resize: 'vertical' }}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '8rem 5%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: 'var(--text-main)',
  },
  divider: {
    width: '60px',
    height: '4px',
    backgroundColor: 'var(--accent)',
    margin: '0 auto 1.5rem auto',
    borderRadius: '2px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
  },
  content: {
    display: 'flex',
    gap: '4rem',
    flexWrap: 'wrap',
  },
  contactInfo: {
    flex: '1 1 400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  infoBlock: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.5rem',
  },
  iconWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    backgroundColor: 'rgba(204, 219, 113, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  infoTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: 'var(--text-main)',
  },
  infoText: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  },
  formContainer: {
    flex: '1 1 500px',
    backgroundColor: 'rgba(18, 18, 18, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    padding: '2.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  }
};

export default ContactUs;
