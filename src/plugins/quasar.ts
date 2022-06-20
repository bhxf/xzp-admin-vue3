import {
    Dialog, Loading, LoadingBar, Notify, Quasar,
} from 'quasar';
import quasarLang from 'quasar/lang/zh-CN';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/material-icons-round/material-icons-round.css';
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css';
import 'quasar/src/css/index.sass';

export default function setupQuasar(app: any) {
    app.use(Quasar, {
        animations: 'all',
        extras: ['material-icons-outlined', 'material-icons-round', 'material-icons-sharp'],
        lang: quasarLang,
        plugins: [
            Notify,
            Loading,
            LoadingBar,
            Dialog,
        ],
        config: {
            notify: {},
            loading: {},
            dialog: {},
        },
    });
}
