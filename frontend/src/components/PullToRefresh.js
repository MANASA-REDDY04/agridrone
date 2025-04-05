import React, { useState, useEffect, useRef } from 'react';

/**
 * PullToRefresh component that adds mobile-friendly pull-to-refresh functionality
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Content to be rendered inside the component
 * @param {Function} props.onRefresh Function to call when refresh is triggered
 * @param {number} props.pullThreshold Threshold in pixels to trigger refresh (default: 80)
 * @param {number} props.maxPullDistance Maximum pull distance in pixels (default: 120)
 */
const PullToRefresh = ({ 
  children, 
  onRefresh, 
  pullThreshold = 80, 
  maxPullDistance = 120 
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      // Only enable pull-to-refresh when scrolled to top
      if (container.scrollTop <= 0) {
        startYRef.current = e.touches[0].clientY;
        currentYRef.current = startYRef.current;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;
      
      currentYRef.current = e.touches[0].clientY;
      const distance = Math.max(0, currentYRef.current - startYRef.current);
      
      // Apply resistance to the pull (the further you pull, the harder it gets)
      const pullWithResistance = Math.min(maxPullDistance, distance * 0.5);
      
      setPullDistance(pullWithResistance);
      
      // Prevent default scrolling behavior when pulling
      if (distance > 0 && container.scrollTop <= 0) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling) return;
      
      setIsPulling(false);
      
      if (pullDistance >= pullThreshold) {
        // Trigger refresh
        setIsRefreshing(true);
        onRefresh().then(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }).catch(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        });
      } else {
        // Reset without refresh
        setPullDistance(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, pullThreshold, maxPullDistance, onRefresh]);

  // Calculate progress percentage for the indicator
  const refreshProgress = Math.min(100, (pullDistance / pullThreshold) * 100);

  return (
    <div className="pull-to-refresh-container" ref={containerRef}>
      {/* Pull indicator */}
      <div 
        className="pull-indicator" 
        style={{ 
          height: `${pullDistance}px`,
          opacity: pullDistance > 0 ? 1 : 0,
          transition: isPulling ? 'none' : 'all 0.3s ease'
        }}
      >
        {isRefreshing ? (
          <>
            <i className="fas fa-spinner"></i>
            <span>Refreshing...</span>
          </>
        ) : (
          <>
            <i 
              className="fas fa-arrow-down" 
              style={{ 
                transform: `rotate(${180 * (refreshProgress / 100)}deg)`,
              }}
            ></i>
            <span>
              {refreshProgress >= 100 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </>
        )}
      </div>
      
      {/* Actual content */}
      <div className="pull-to-refresh-content">
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
