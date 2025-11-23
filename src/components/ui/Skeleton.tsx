import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  animate = true
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  };

  const shimmerAnimation = animate ? {
    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
    backgroundSize: '200% 100%',
    backgroundPosition: ['200% 0', '-200% 0'],
  } : {};

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      animate={animate ? shimmerAnimation : {}}
      transition={animate ? {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      } : {}}
    />
  );
}

// Preset skeleton layouts
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <Skeleton height={24} width="60%" />
      <Skeleton height={16} width="100%" />
      <Skeleton height={16} width="80%" />
      <div className="flex space-x-2 mt-4">
        <Skeleton height={36} width={100} />
        <Skeleton height={36} width={100} />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton height={40} width="20%" />
          <Skeleton height={40} width="30%" />
          <Skeleton height={40} width="25%" />
          <Skeleton height={40} width="25%" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton variant="circular" width={80} height={80} />
        <div className="flex-1 space-y-2">
          <Skeleton height={24} width="40%" />
          <Skeleton height={16} width="60%" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="90%" />
        <Skeleton height={16} width="95%" />
      </div>
    </div>
  );
}
