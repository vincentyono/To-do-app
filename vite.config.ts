import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePluginFonts } from 'vite-plugin-fonts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    VitePluginFonts({
      google: {
        families: [
          {
            name: 'Poppins',
            styles: 'wght@400,600,900',
          },
        ],
      },
    }),
  ],
});
