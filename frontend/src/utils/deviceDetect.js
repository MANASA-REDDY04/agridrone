/**
 * Utility functions for device detection and responsive behavior
 */

// Check if the device is mobile based on screen width
export const isMobile = () => {
  return window.innerWidth < 768;
};

// Check if the device is a tablet based on screen width
export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

// Check if the device is desktop based on screen width
export const isDesktop = () => {
  return window.innerWidth >= 1024;
};

// Check if the device has touch capability
export const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
};

// Get the device type
export const getDeviceType = () => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

// Add a listener for screen size changes
export const addResizeListener = (callback) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

// Get orientation (portrait or landscape)
export const getOrientation = () => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

// Check if the app is running as a PWA (Progressive Web App)
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
};

// Check if the device is iOS
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// Check if the device is Android
export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

// Get browser information
export const getBrowser = () => {
  const ua = navigator.userAgent;
  let browser = "unknown";
  
  if (ua.indexOf("Chrome") > -1) browser = "chrome";
  else if (ua.indexOf("Safari") > -1) browser = "safari";
  else if (ua.indexOf("Firefox") > -1) browser = "firefox";
  else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) browser = "ie";
  else if (ua.indexOf("Edge") > -1) browser = "edge";
  
  return browser;
};

// Apply different styles based on device type
export const getResponsiveClass = (mobileClass, tabletClass, desktopClass) => {
  if (isMobile()) return mobileClass;
  if (isTablet()) return tabletClass;
  return desktopClass;
};

// Get viewport dimensions
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};
