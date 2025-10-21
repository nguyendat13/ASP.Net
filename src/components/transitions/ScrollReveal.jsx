import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ScrollReveal = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    margin: "0px 0px -200px 0px" // This will trigger animation before element comes into view
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 75 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 75 }}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;