import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import { defineConfig, passthroughImageService } from 'astro/config';

import react from '@astrojs/react';
const is_win = process.platform === 'win32';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  compressHTML: true,
  image: is_win
    ? {
        service: passthroughImageService(),
      }
    : undefined,
  integrations: [tailwind(), compress(), react()],
  site: 'https://odyspatial.pro',
});
