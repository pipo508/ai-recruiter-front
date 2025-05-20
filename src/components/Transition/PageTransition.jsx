import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [showChildren, setShowChildren] = useState(false);

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const handleAnimationComplete = (definition) => {
    if (definition === 'animate') {
      setShowChildren(true);
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: 'rgba(10, 18, 31, 0.87)' }} // fondo azul sólido
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full flex justify-center items-center"
          onAnimationComplete={handleAnimationComplete}
        >
          {showChildren ? children : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;
