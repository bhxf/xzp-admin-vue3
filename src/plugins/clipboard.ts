import { VueClipboard } from '@soerenmartius/vue3-clipboard';

export default function setupClipboard(app:any) {
    app.use(VueClipboard);
}
