import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Professional Player',
    text: 'Yamundra Academy has completely transformed my game. The coaching staff is incredibly knowledgeable and the facilities are second to none. I achieved my career-best ranking within a year of joining.',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Amateur Enthusiast',
    text: 'I joined as a complete beginner and was welcomed with open arms. The community here is fantastic, and the structured learning programs make improvement visible and fun.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Parent of Junior Member',
    text: 'My daughter loves coming to her sessions. Not only has her badminton improved significantly, but her discipline and focus in academics have also seen a positive shift. Highly recommended!',
    rating: 4,
  }
];

const Testimonials = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span key={index} style={{ color: index < rating ? 'var(--accent)' : '#444', fontSize: '1.2rem' }}>
        ★
      </span>
    ));
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
          <h2 style={styles.title}>Member Success Stories</h2>
          <div style={styles.divider}></div>
        </motion.div>
        
        <div style={styles.grid}>
          {testimonials.map((testimonial, index) => {
            const cardY = useTransform(scrollYProgress, [0, 1], [`${60 + (index * 30)}%`, `-${60 + (index * 30)}%`]);
            
            return (
              <motion.div 
                key={index} 
                style={{ ...styles.card, y: cardY }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div style={styles.quoteMark}>"</div>
                <p style={styles.text}>{testimonial.text}</p>
                <div style={styles.rating}>{renderStars(testimonial.rating)}</div>
                <div style={styles.author}>
                  <div style={styles.avatar}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={styles.name}>{testimonial.name}</h4>
                    <p style={styles.role}>{testimonial.role}</p>
                  </div>
                </div>
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
    backgroundColor: 'var(--primary)',
    margin: '0 auto',
    borderRadius: '2px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2.5rem',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '2.5rem',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  quoteMark: {
    position: 'absolute',
    top: '1.5rem',
    right: '2rem',
    fontSize: '5rem',
    fontFamily: 'serif',
    color: 'rgba(255,255,255,0.05)',
    lineHeight: 1,
  },
  text: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    lineHeight: 1.7,
    fontStyle: 'italic',
    marginBottom: '1.5rem',
    position: 'relative',
    zIndex: 2,
  },
  rating: {
    marginBottom: '1.5rem',
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  name: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--text-main)',
    marginBottom: '0.2rem',
  },
  role: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  }
};

export default Testimonials;
