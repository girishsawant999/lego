import ReactGA from 'react-ga';
import { GA_ID } from '../../api/globalApi';

export const initialize = () => {
    ReactGA.initialize(GA_ID);
}

export const pageview = () => {
    ReactGA.pageview(window.location.pathname + window.location.search);
}