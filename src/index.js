import React from 'react';
import ReactDOM from 'react-dom';
import '../src/sass/main.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { store } from './redux/store/store';
import { Provider } from 'react-redux';
import { persistStore} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react';
//polyfill
import 'react-app-polyfill/ie11';
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'core-js/features/number/is-nan';
import 'core-js/es/object';
import 'core-js/features/url-search-params';

let persistor = persistStore(store);

const app = (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
);
ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
