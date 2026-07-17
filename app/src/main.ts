import { mount } from 'svelte';

// Fonts are bundled (self-hosted, offline-capable): the looped Thai learning
// font and the display face. Latin body text uses the system stack.
import '@fontsource/noto-sans-thai-looped/400.css';
import '@fontsource/noto-sans-thai-looped/600.css';
import '@fontsource/kanit/400.css';
import '@fontsource/kanit/500.css';

import './styles/tokens.css';
import './styles/app.css';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });

// Service worker: manual registration (injectRegister is off) so the
// registration path stays visible and debuggable.
if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  const { registerSW } = await import('virtual:pwa-register');
  registerSW({ immediate: true });
}
