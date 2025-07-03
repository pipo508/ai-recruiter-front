import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  const variants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95
    }
  };

  // Transiciones más lentas para que se vea completa
  const transition = {
    duration: 0.5, // Aumentado de 0.2 a 0.4
    ease: [0.4, 0, 0.2, 1] // Curva de animación más suave
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900/87">
      <AnimatePresence 
        mode="wait" 
        initial={false}
        // Tiempo adicional para asegurar que termine la animación
        exitBeforeEnter
      >
        <motion.div
          key={location.pathname}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="w-full h-full"
          // Asegurar que la animación termine antes de desmontar
          onAnimationStart={() => {
            // Opcional: agregar clase para prevenir scroll durante transición
            document.body.style.overflow = 'hidden';
          }}
          onAnimationComplete={() => {
            document.body.style.overflow = 'auto';
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;