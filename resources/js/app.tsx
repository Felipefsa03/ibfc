import '../css/app.css';

import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob<{ default: ResolvedComponent }>('./Pages/**/*.tsx', {
    eager: true,
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => pages[`./Pages/${name}.tsx`],
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
