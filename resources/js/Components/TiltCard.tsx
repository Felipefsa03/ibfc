import type { MouseEvent, PropsWithChildren } from 'react';
import { useState } from 'react';

/**
 * Wraps a big player card with the subtle mouse-follow perspective tilt used
 * wherever a single card is the focal point (staff and public profile
 * pages). Resets on mouse leave.
 */
export default function TiltCard({ children }: PropsWithChildren) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleTilt = (event: MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        setTilt({ x: -py * 16, y: px * 22 });
    };

    return (
        <div
            onMouseMove={handleTilt}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform .12s ease-out',
            }}
        >
            {children}
        </div>
    );
}
