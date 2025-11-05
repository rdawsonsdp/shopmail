'use client';
import Image from 'next/image';

export default function BrownSugarLogo({ size = 80 }: { size?: number }) {
  // Try to use the actual logo image file first
  // Place your logo file at: public/logo.png, public/logo.jpg, or public/logo.svg
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <Image
        src="/logo.png"
        alt="Brown Sugar Bakery Logo"
        width={size}
        height={size}
        className="object-contain drop-shadow-lg"
        priority
        style={{ width: 'auto', height: 'auto' }}
      />
    </div>
  );
}

