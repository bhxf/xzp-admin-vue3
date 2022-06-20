import { createPinia } from 'pinia';

export default function setupPinia(app:any) {
    app.use(createPinia());
}
