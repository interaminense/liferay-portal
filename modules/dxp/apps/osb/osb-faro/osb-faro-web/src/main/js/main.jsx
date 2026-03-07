import '@clayui/css/lib/css/atlas.css';
import '../css/main.scss';
import './external-scripts';

import App from './App';

import React from 'react';
import {createRoot} from 'react-dom/client';

const container = document.getElementById('faroApp');
const root = createRoot(container);

root.render(<App />);
