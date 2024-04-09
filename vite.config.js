import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Insieme 2024',
        short_name: 'Insieme',
        theme_color: '#008080',
        icons: [
            {
                src: 'https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/favicon-16x16.png?t=2024-04-09T14%3A18%3A03.854Z',
                sizes: '64x64',
                type: 'image/png'
            },
            {
                src: 'https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: 'https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ],
      }, 
    })
  
  ],
})
