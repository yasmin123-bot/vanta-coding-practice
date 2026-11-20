import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'supabase-vendor',
              test: /node_modules[\\/]@supabase[\\/]/,
              priority: 25,
            },
            {
              name: 'lezer-vendor',
              test: /node_modules[\\/]@lezer[\\/]/,
              priority: 30,
            },
            {
              name: 'codemirror-vendor',
              test: /node_modules[\\/]@codemirror[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
});
