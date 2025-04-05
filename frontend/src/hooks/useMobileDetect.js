import { useState, useEffect } from 'react';
import { 
  isMobile, 
  isTablet, 
  isDesktop, 
  isTouchDevice,
  getOrientation,
  isPWA,
  isIOS,
  isAndroid
} from '../utils/deviceDetect';

/**
 * Hook for detecting mobile devices and responsive behavior
 * @returns {Object} Object containing device information and responsive state
 */
const useMobileDetect = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    isTouchDevice: isTouchDevice(),
    orientation: getOrientation(),
    isPWA: isPWA(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo({
        isMobile: isMobile(),
        isTablet: isTablet(),
        isDesktop: isDesktop(),
        isTouchDevice: isTouchDevice(),
        orientation: getOrientation(),
        isPWA: isPWA(),
        isIOS: isIOS(),
        isAndroid: isAndroid(),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Get appropriate class based on device type
  const getResponsiveClass = (mobileClass, tabletClass, desktopClass) => {
    if (deviceInfo.isMobile) return mobileClass;
    if (deviceInfo.isTablet) return tabletClass;
    return desktopClass;
  };

  // Get appropriate style based on device type
  const getResponsiveStyle = (mobileStyle, tabletStyle, desktopStyle) => {
    if (deviceInfo.isMobile) return mobileStyle;
    if (deviceInfo.isTablet) return tabletStyle;
    return desktopStyle;
  };

  // Check if the device is in portrait orientation
  const isPortrait = deviceInfo.orientation === 'portrait';

  // Check if the device is in landscape orientation
  const isLandscape = deviceInfo.orientation === 'landscape';

  return {
    ...deviceInfo,
    getResponsiveClass,
    getResponsiveStyle,
    isPortrait,
    isLandscape
  };
};

export default useMobileDetect;
