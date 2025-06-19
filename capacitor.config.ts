
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6b40cb2d23884bd9b350bcd2db04e817',
  appName: 'tire-vision-inventory',
  webDir: 'dist',
  server: {
    url: 'https://6b40cb2d-2388-4bd9-b350-bcd2db04e817.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: {
        camera: "Camera access is required to take photos of tires for inventory management"
      }
    }
  },
  // Security configurations for mobile deployment
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  }
};

export default config;
