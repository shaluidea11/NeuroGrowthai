import { Tilt } from 'react-tilt';

const defaultOptions = {
    reverse: false,  // reverse the tilt direction
    max: 15,     // max tilt rotation (degrees)
    perspective: 1000,   // Transform perspective, the lower the more extreme the tilt gets.
    scale: 1.02,    // 2 = 200%, 1.5 = 150%, etc..
    speed: 1000,   // Speed of the enter/exit transition
    transition: true,   // Set a transition on enter/exit.
    axis: null,   // What axis should be disabled. Can be X or Y.
    reset: true,    // If the tilt effect has to be reset on exit.
    easing: "cubic-bezier(.17,.67,.83,.67)",    // Easing on enter/exit.
};

export default function ThreeDCard({ children, className = "", options = {} }) {
    return (
        <Tilt className={`element-3d ${className}`} options={{ ...defaultOptions, ...options }}>
            <div className="transform-style-3d h-full w-full">
                {children}
            </div>
        </Tilt>
    );
}
