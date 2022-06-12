import { VueClipboard } from '@soerenmartius/vue3-clipboard';

export function setupClipboard(app:any) {
  app.use(VueClipboard);
}
