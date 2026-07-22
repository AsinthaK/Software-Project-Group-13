import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = ({ onLoginClick }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Deep Parallax effects
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} style={styles.heroContainer}>
      <div style={styles.contentWrapper}>
        <motion.div 
          style={{ ...styles.heroContent, y: textY, opacity }}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 style={styles.title}>Elevate Your Game</h1>
          <p style={styles.subtitle}>
            Join Yamundra Badminton Academy. Master the court with world-class coaching, state-of-the-art facilities, and a community of champions.
          </p>
          <div style={styles.actionGroup}>
            <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }} onClick={onLoginClick}>
              Join Now
            </button>
            <button className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', marginLeft: '1rem' }}>
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  heroContainer: {
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent', // Let global background show through
  },
  contentWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 5%',
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
    zIndex: 10,
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 10,
    paddingTop: '80px', // Offset for navbar
  },
  title: {
    fontSize: '5rem',
    lineHeight: 1.1,
    marginBottom: '1.5rem',
    fontWeight: 800,
    background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.3rem',
    color: 'var(--text-muted)',
    marginBottom: '2.5rem',
    lineHeight: 1.6,
    maxWidth: '800px',
  },
  actionGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  }
};

export default Hero;
