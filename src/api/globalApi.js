// export const live = true;
export const live = process.env.NODE_ENV === "production";

export let active_server = "dev";

if (window.location.host.includes("qa")) {
  active_server = "qa";
} else if (window.location.host.includes("uat")) {
  active_server = "uat";
} else if (window.location.host.includes("-prod")) {
  active_server = "prod";
} else if (window.location.host.includes("saudiblocks")) {
  active_server = "live";
}

export const ROOT_URL = {
  dev: "https://legodev.iksulalive.com/",
  qa: "https://lego-qa.iksulalive.com/",
  uat: "https://lego-uat.iksulalive.com/",
  prod: "https://cms-preprod.saudiblocks.com/",
  live: "https://cmslego.saudiblocks.com/",
};

export const PAY_FORT_URL_ALL = {
  dev: `https://sbcheckout.payfort.com/FortAPI/paymentPage`,
  qa: `https://sbcheckout.payfort.com/FortAPI/paymentPage`,
  uat: `https://sbcheckout.payfort.com/FortAPI/paymentPage`,
  prod: `https://checkout.payfort.com/FortAPI/paymentPage`,
  live: `https://checkout.payfort.com/FortAPI/paymentPage`,
};

export const GTM_ID = {
  live: `GTM-PVJJ2XF`,
  prod: `GTM-TC9PLMR`,
  uat: `GTM-TC9PLMR`,
  dev: `GTM-TC9PLMR`,
  qa: `GTM-TC9PLMR`,
};

// export const GA_ID = {
//     prod: `UA-119596994-2`,
//     uat: `UA-119596994-1`,
//     dev: `UA-119596994-1`,
//     qa: `UA-119596994-1`,
//     live: `UA-160287971-1`,
// }

export const BASE_URL = `${ROOT_URL[active_server]}index.php/rest/V1/app/`;
export const UPDATED_BASE_URL = `${ROOT_URL[active_server]}index.php/rest/V1/app/`;
export const CLONE_BASE_URL = `${ROOT_URL[active_server]}rest/V1/app/`;
//export const API_TOKEN = "jfpm571jhl3ge861d8wxl9vnhmvk8pf1";
export const GUEST_CART_URL = `${ROOT_URL[active_server]}rest/`;
export const COUNTRY_URL = `${ROOT_URL[active_server]}rest/V1/directory/`;
export const CART_URL = `${ROOT_URL[active_server]}rest/`;
export const API_TOKEN = "j07iuwq92wsg5htbpef3ihtu23qaibld";
export const IP_INFO_TOKEN = "69e46a82457d45";
export const STATIC_PAGES_URL = `${ROOT_URL[active_server]}rest/V1/cmsPageIdentifier/`;
export const BASE_URL_1 = `${ROOT_URL[active_server]}rest/V1/`;
export const PAY_FORT_URL = PAY_FORT_URL_ALL[active_server];
