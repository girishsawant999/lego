// export const live = true;
export const live = process.env.NODE_ENV === 'production';

export let active_server = 'dev';

if (window.location.href.includes('qa')) {
    active_server = 'qa';
} else if (window.location.href.includes('uat')) {
    active_server = 'uat';
} else if (window.location.href.includes('-prod')) {
    active_server = 'live';
}

// URL : https://legoreact-prod.iksulalive.com/
// Docroot : /data/docroot/legoreact-prod.iksulalive.com

// Magento CMS Backend:

// IP : 157.175.122.55
// URL : https://cms-preprod.saudiblocks.com/

export const ROOT_URL = {
    dev: 'https://legodev.iksulalive.com/index.php/',
    qa: 'https://lego-qa.iksulalive.com/',
    uat: 'https://lego-uat.iksulalive.com/',
    live: 'https://cms-preprod.saudiblocks.com/'
};

export const PAY_FORT_URL_ALL = {
    dev:  `https://sbcheckout.payfort.com/FortAPI/paymentPage`,
    qa: `https://sbcheckout.payfort.com/FortAPI/paymentPage`,
    uat: `https://sbcheckout.payfort.com/FortAPI/paymentPage`,
    // uatLocal:  `https://sbcheckout.payfort.com/FortAPI/paymentPage`,
    // production:`https://checkout.payfort.com/FortAPI/paymentPage`,
    live: `https://checkout.payfort.com/FortAPI/paymentPage`
}

export const GTM_ID = {
    live: `GTM-TC9PLMR`,
    uat: `GTM-TC9PLMR`,
    dev: `GTM-TC9PLMR`,
    qa : `GTM-TC9PLMR`
}

// export const GA_ID = {
//     live: `UA-119596994-2`,
//     uat: `UA-119596994-1`,
//     dev: `UA-119596994-1`,
// }

export const BASE_URL = `${ROOT_URL[active_server]}rest/V1/app/`;
export const CLONE_BASE_URL=`${ROOT_URL[active_server]}rest/V1/app/`;
//export const API_TOKEN = "jfpm571jhl3ge861d8wxl9vnhmvk8pf1";
export const GUEST_CART_URL = `${ROOT_URL[active_server]}rest/`;
export const COUNTRY_URL = `${ROOT_URL[active_server]}rest/V1/directory/`;
export const CART_URL = `${ROOT_URL[active_server]}rest/`;
export const API_TOKEN = "j07iuwq92wsg5htbpef3ihtu23qaibld";
export const IP_INFO_TOKEN = "69e46a82457d45";
export const STATIC_PAGES_URL = `${ROOT_URL[active_server]}rest/V1/cmsPageIdentifier/`;
export const BASE_URL_1 = `${ROOT_URL[active_server]}rest/V1/`;
export const PAY_FORT_URL = PAY_FORT_URL_ALL[active_server];
