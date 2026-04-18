import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const OptimizedImage = ({ src, alt, className, ...props }: OptimizedImageProps) => {
  // In a real production app, we would use a service like Cloudinary or Vercel Image Optimization.
  // For this implementation, we enforce lazy loading and ensure alt tags.
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
