import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'spoti.hifi.mmasser95',
  appName: 'Spoti HiFi',
  webDir: 'dist',
  server:{
    cleartext:true,
    androidScheme:"http"
  },
  android:{
    allowMixedContent:true,
  }
};

export default config;
