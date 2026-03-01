import { CompassIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Compass() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const x = ((event.clientY / window.innerHeight) - 0.5) * 12;
      const y = ((event.clientX / window.innerWidth) - 0.5) * -12;
      setRotation({ x, y });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      className="compass"
      style={{ transform: `perspective(420px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      aria-hidden="true"
    >
      <div className="compass-inner">
        <CompassIcon size={20} />
      </div>
    </div>
  );
}
