import React, { useRef } from 'react';

function RoundDiler(props) {
    const { degree, setDegree } = props;

    const circleRef = useRef(null);

    // Circular degree controller logic
    const handleCircleDrag = (e) => {
        const rect = circleRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - cx;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - cy;
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        angle = (angle + 450) % 360; // 0 at top, clockwise
        setDegree(Math.round(angle));
    };

    const handleCircleMouseDown = (e) => {
        e.preventDefault();
        const moveHandler = (ev) => handleCircleDrag(ev);
        const upHandler = () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', upHandler);
        handleCircleDrag(e);
    };

    const handleCircleTouchStart = (e) => {
        const moveHandler = (ev) => handleCircleDrag(ev);
        const upHandler = () => {
            window.removeEventListener('touchmove', moveHandler);
            window.removeEventListener('touchend', upHandler);
        };
        window.addEventListener('touchmove', moveHandler);
        window.addEventListener('touchend', upHandler);
        handleCircleDrag(e);
    };
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="font-medium">Degree</span>
            <div className="relative w-28 h-28 flex items-center justify-center select-none">
                <svg ref={circleRef} width="112" height="112" viewBox="0 0 112 112" className="absolute left-0 top-0" style={{ touchAction: 'none' }}>
                    <circle cx="56" cy="56" r="50" fill="#f8fafc" stroke="#eab308" strokeWidth="4" />
                    <circle cx="56" cy="56" r="44" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="4 6" />
                    {/* Degree marker */}
                    <g
                        style={{ cursor: 'pointer' }}
                        onMouseDown={handleCircleMouseDown}
                        onTouchStart={handleCircleTouchStart}
                    >
                        {(() => {
                            const rad = (degree - 90) * (Math.PI / 180);
                            const x = 56 + 44 * Math.cos(rad);
                            const y = 56 + 44 * Math.sin(rad);
                            return (
                                <circle cx={x} cy={y} r="8" fill="#eab308" stroke="#fff" strokeWidth="2" />
                            );
                        })()}
                    </g>
                </svg>
                <span className="absolute text-lg font-bold text-amber-600">{degree}&deg;</span>
            </div>
        </div>
    )
}

export default RoundDiler;