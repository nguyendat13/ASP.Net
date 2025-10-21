import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ 
          type: "spring",
          stiffness: 50,
          damping: 20,
          duration: 0.5,
          opacity: {
            duration: 0.8,
            ease: "easeInOut"
          }
        }}
        style={{
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.3,
            duration: 1.2,
            opacity: {
              duration: 1.5,
              ease: [0.25, 0.1, 0.25, 1]
            },
            y: {
              duration: 1.2,
              ease: [0.165, 0.84, 0.44, 1]
            }
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;