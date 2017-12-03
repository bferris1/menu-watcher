import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import AppRoutes from "./AppRoutes";
import {BrowserRouter as Router} from 'react-router-dom';

ReactDOM.render(<Router><AppRoutes /></Router>, document.getElementById('root'));
registerServiceWorker();
