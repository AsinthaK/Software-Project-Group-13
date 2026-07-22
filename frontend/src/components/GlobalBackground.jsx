import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GlobalBackground = () => {
  const { scrollYProgress } = useScroll();

  // Wave lines parallax
  const wave1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const wave2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <div style={styles.fixedBackground}>
      {/* Background Waves */}
      <motion.svg 
        style={{ ...styles.wave, y: wave1Y, opacity: 0.15 }} 
        viewBox="0 0 1440 320" 
        preserveAspectRatio="none"
        animate={{ x: [0, -1440] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <path fill="none" stroke="var(--primary)" strokeWidth="4" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        <path fill="none" stroke="var(--primary)" strokeWidth="4" d="M1440,192L1488,197.3C1536,203,1632,213,1728,229.3C1824,245,1920,267,2016,250.7C2112,235,2208,181,2304,181.3C2400,181,2496,235,2592,234.7C2688,235,2784,181,2832,154.7L2880,128"></path>
      </motion.svg>
      
      <motion.svg 
        style={{ ...styles.wave, y: wave2Y, top: '40%', opacity: 0.1 }} 
        viewBox="0 0 1440 320" 
        preserveAspectRatio="none"
        animate={{ x: [0, -1440] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <path fill="none" stroke="var(--secondary)" strokeWidth="6" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,165.3C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        <path fill="none" stroke="var(--secondary)" strokeWidth="6" d="M1440,96L1488,112C1536,128,1632,160,1728,160C1824,160,1920,128,2016,122.7C2112,117,2208,139,2304,165.3C2400,192,2496,224,2592,213.3C2688,203,2784,149,2832,122.7L2880,96"></path>
      </motion.svg>
    </div>
  );
};

const styles = {
  fixedBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    overflow: 'hidden',
    backgroundColor: 'var(--bg-dark)',
  },
  wave: {
    position: 'absolute',
    top: '20%',
    left: 0,
    width: '200vw',
    height: '50vh',
  }
};

export default GlobalBackground;
