import '@clayui/css/lib/css/atlas.css';

// eslint-disable-next-line sort-imports-es6-autofix/sort-imports-es6
import '../css/main.scss';

import './external-scripts';

import App from './App';

import {createRoot} from 'react-dom/client';

const container = document.getElementById('faroApp');
const root = createRoot(container);

root.render(<App />);
