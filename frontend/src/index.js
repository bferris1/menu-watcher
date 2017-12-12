import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import AppRoutes from "./AppRoutes";
import {BrowserRouter as Router} from 'react-router-dom';
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducer'
import thunk from 'redux-thunk';
import {getUser} from './reducer/user/actions';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));


store.dispatch(getUser());

ReactDOM.render(<Provider store={store}><Router><AppRoutes /></Router></Provider>, document.getElementById('root'));
registerServiceWorker();
