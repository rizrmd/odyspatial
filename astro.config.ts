import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  compressHTML: true,
  integrations: [tailwind(), compress(), react()],
});
