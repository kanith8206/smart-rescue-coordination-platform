import { useEffect, useRef, useState, useCallback } from 'react';

interface UseShakeDetectionOptions {
  onShake: () => void;
  threshold?: number;
  timeout?: number;
}

export function useShakeDetection({ onShake, threshold = 15, timeout = 1000 }: UseShakeDetectionOptions) {
  const [isSupported, setIsSupported] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const lastTime = useRef(0);
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const lastZ = useRef<number | null>(null);
  
  // Keep the latest callback in a ref so we don't re-bind devicemotion every render
  const onShakeRef = useRef(onShake);
  useEffect(() => {
    onShakeRef.current = onShake;
  }, [onShake]);

  const handleMotionEvent = useCallback((event: DeviceMotionEvent) => {
    const current = event.accelerationIncludingGravity;
    if (!current || current.x === null || current.y === null || current.z === null) return;

    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastTime.current;

    if (timeDifference > 100) {
      if (lastX.current !== null && lastY.current !== null && lastZ.current !== null) {
        const deltaX = Math.abs(lastX.current - current.x);
        const deltaY = Math.abs(lastY.current - current.y);
        const deltaZ = Math.abs(lastZ.current - current.z);

        // Calculate simplified speed
        const speed = (deltaX + deltaY + deltaZ) / timeDifference * 10000;

        if (speed > threshold * 100) {
          if (currentTime - lastTime.current > timeout) {
            onShakeRef.current();
            // Reset timers
            lastTime.current = currentTime;
          }
        }
      }

      lastX.current = current.x;
      lastY.current = current.y;
      lastZ.current = current.z;
      lastTime.current = currentTime;
    }
  }, [threshold, timeout]);

  const requestPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const state = await (DeviceMotionEvent as any).requestPermission();
        if (state === 'granted') {
          window.addEventListener('devicemotion', handleMotionEvent);
          setPermissionGranted(true);
          return true;
        }
      } catch (e) {
        console.error('Error requesting device motion permission:', e);
      }
      return false;
    } else {
      // Android / non-strict browsers
      window.addEventListener('devicemotion', handleMotionEvent);
      setPermissionGranted(true);
      return true;
    }
  };

  useEffect(() => {
    if (!window.DeviceMotionEvent) {
      setIsSupported(false);
      return;
    }

    // If permission doesn't need explicit interaction, attach immediately
    if (typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      window.addEventListener('devicemotion', handleMotionEvent);
      setPermissionGranted(true);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent);
    };
  }, [handleMotionEvent]);

  return { isSupported, permissionGranted, requestPermission };
}
