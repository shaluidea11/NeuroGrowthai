import { motion } from 'framer-motion';

const variants = {
    hidden: { opacity: 0, x: 0, y: 20 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 20 },
};

export default function AnimatedLayout({ children, className = "" }) {
    return (
        <motion.div
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'linear', duration: 0.4 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
