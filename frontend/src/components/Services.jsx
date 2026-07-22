import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PiStudent, PiCalendarPlus, PiTrophy, PiStorefront, PiBarbell, PiUsers } from 'react-icons/pi';

const services = [
  {
    title: 'Professional Coaching',
    description: 'Personalized training programs designed by world-class athletes to elevate your technique and tactical awareness.',
    icon: <PiStudent />,
  },
  {
    title: 'Court Booking',
    description: 'Access to premium, BWF-approved synthetic courts with optimal lighting and ventilation for the best playing experience.',
    icon: <PiCalendarPlus />,
  },
  {
    title: 'Tournament Hosting',
    description: 'Regular competitive leagues and tournaments to test your skills against players of similar caliber.',
    icon: <PiTrophy />,
  },
  {
    title: 'Pro Shop',
    description: 'On-site store offering the latest rackets, shoes, apparel, and stringing services from top international brands.',
    icon: <PiStorefront />,
  },
  {
    title: 'Fitness & Conditioning',
    description: 'Dedicated fitness area and specialized conditioning programs tailored specifically for badminton players.',
    icon: <PiBarbell />,
  },
  {
    title: 'Junior Academy',
    description: 'Structured programs for children and teenagers focusing on fundamentals, motor skills, and sportsmanship.',
    icon: <PiUsers />,
  }
];

const Services = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);

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
          <h2 style={styles.title}>Our Services</h2>
          <div style={styles.divider}></div>
          <p style={styles.subtitle}>Comprehensive offerings designed for the complete athlete.</p>
        </motion.div>
        
        <div style={styles.grid}>
          {services.map((service, index) => {
            // Create a custom staggered parallax for each card based on index
            const cardY = useTransform(scrollYProgress, [0, 1], [`${50 + (index * 20)}%`, `-${50 + (index * 20)}%`]);
            
            return (
              <motion.div 
                key={index} 
                style={{ ...styles.card, y: cardY }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div style={styles.iconWrapper}>
                  <span style={styles.icon}>{service.icon}</span>
                </div>
                <h3 style={styles.cardTitle}>{service.title}</h3>
                <p style={styles.cardDescription}>{service.description}</p>
              </motion.div>
            );
          })}
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
    backgroundColor: 'var(--secondary)',
    margin: '0 auto 1.5rem auto',
    borderRadius: '2px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '2.5rem 2rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
    cursor: 'pointer',
  },
  iconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    backgroundColor: 'rgba(96, 131, 205, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  icon: {
    fontSize: '1.8rem',
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--text-main)',
  },
  cardDescription: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  }
};

export default Services;
