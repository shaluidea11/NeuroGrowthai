import { motion } from 'framer-motion';

export default function FloatingShape({ color, size, top, left, delay = 0, duration = 6, type = 'circle' }) {
    const isCircle = type === 'circle';

    return (
        <motion.div
            className={`absolute z-0 blur-xl opacity-60 pointer-events-none`}
            style={{
                top,
                left,
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: isCircle ? '50%' : '20%',
            }}
            animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
                rotate: isCircle ? 0 : [0, 90, 0],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
            }}
        />
    );
}
