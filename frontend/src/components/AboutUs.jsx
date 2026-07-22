import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AboutUs = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]);
  const statsY = useTransform(scrollYProgress, [0, 1], ["150%", "-150%"]);

  return (
    <section ref={containerRef} style={styles.section}>
      <div style={styles.container}>
        <motion.div 
          style={{ ...styles.content, y: headerY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={styles.title}>About Yamundra Academy</h2>
          <div style={styles.divider}></div>
        </motion.div>
        
        <motion.div style={{ ...styles.textContainer, y: textY }}>
          <p style={styles.text}>
            Founded with a passion for excellence, Yamundra Badminton Academy is the premier destination for players of all skill levels. Our mission is to nurture talent, promote sportsmanship, and build a vibrant community around the sport of badminton.
          </p>
          <p style={styles.text}>
            Whether you are a beginner looking to learn the basics or an advanced player aiming for professional tournaments, our world-class coaches and state-of-the-art facilities provide the perfect environment for your growth. We believe in holistic development, focusing on physical fitness, tactical acumen, and mental resilience.
          </p>
        </motion.div>

        <motion.div style={{ ...styles.stats, y: statsY }}>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>15+</h3>
            <p style={styles.statLabel}>Expert Coaches</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>10</h3>
            <p style={styles.statLabel}>Premium Courts</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>500+</h3>
            <p style={styles.statLabel}>Active Members</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '8rem 5%',
    backgroundColor: 'transparent', // Let global background show through
    overflow: 'hidden',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    backgroundColor: 'var(--primary)',
    marginBottom: '3rem',
    borderRadius: '2px',
  },
  textContainer: {
    width: '100%',
  },
  text: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    lineHeight: 1.8,
    marginBottom: '1.5rem',
  },
  stats: {
    display: 'flex',
    gap: '4rem',
    marginTop: '4rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: 800,
    color: 'var(--secondary)',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
  }
};

export default AboutUs;
