import TagManager from 'react-gtm-module';
import { GTM_ID } from '../../api/globalApi';

export const initializeGTM = () => {
    TagManager.initialize({
        gtmId: GTM_ID
    });
};

export const dataLayerGTM = (payload) => {
    TagManager.dataLayer({
        page_url: window.location.pathname + window.location.search 
    })
};

export const initializeGTMWithEvent = (event) => {
  window.dataLayer = window.dataLayer || [] ;
  window.dataLayer.push(event);
};

export const ProductSearchEvent = (data) => {
    let impressionsData = [];
    let currencyCode = '';
    Object.keys(data.product_data).map((key, index) => {
        let item  = data.product_data[key];
        currencyCode = item.currency; 
        impressionsData.push({
            name: item && item.json && item.json.name,
            id: item && item.json && item.json.sku,
            price: item && item.json && item.json.offers ? (item.json.offers.data && item.json.offers.data['1'] ? item.json.offers.data && item.json.offers.data['1'] :  item.price) :  item.price,
            category: item &&item.json && item.json.category_names,
            brand: 'Google',
            variant: item && item.json && item.json.simpleproducts && item.json.simpleproducts[0] && item.json.simpleproducts[0].color && item.json.simpleproducts[0].color.text,
            list: 'Search Results',
            position: index + 1
        })
    });
    window.dataLayer = window.dataLayer || [] ;
    window.dataLayer.push({
        event: 'product impressions',
        'ecommerce': {
            currencyCode: currencyCode,
            impressions: impressionsData
        }
    });
}

export const ProductListEvent = (data) => {
    let impressionsData = [];
    let currencyCode = '';
    Object.keys(data.product_data).map((key, index) => {
        let item  = data.product_data[key];
        currencyCode = item.currency; 
        impressionsData.push({
            name: item && item.json && item.json.name,
            id: item && item.json && item.json.sku,
            price: item && item.json && item.json.offers ? (item.json.offers.data && item.json.offers.data['1'] ? item.json.offers.data && item.json.offers.data['1'] :  item.price) :  item.price,
            category: item &&item.json && item.json.category_names,
            brand: 'Google',
            variant: item && item.json && item.json.simpleproducts && item.json.simpleproducts[0] && item.json.simpleproducts[0].color && item.json.simpleproducts[0].color.text,
            list: 'List Results',
            position: index + 1
        })
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'product impressions',
        'ecommerce': {
            currencyCode: currencyCode,
            impressions: impressionsData
        }
    });
}

export const productClickEvent = (data) => {
    window.dataLayer = window.dataLayer || [] ;
    window.dataLayer.push({
        event: 'productClick',
        ecommerce: {
            click: {
                actionField: {
                    list: data.actionField
                },
                products: [{
                    name: data.name,
                    id: data.id,
                    price: data.price,
                    brand: 'Google',
                    category: data.category,
                    variant: data.color,
                    position: data.index
                }]
            }
        },
        // eventCallback: function () {
        //     document.location = (window.location.pathname + window.location.search)
        // }
    });
}

export const productDetailsEvent = (data) => {
    window.dataLayer = window.dataLayer || [] ;
    window.dataLayer.push({
        event: 'product view',	
        ecommerce: {
            detail: {
                products: [{
                    name: data.name,
                    id: data.id,
                    price: data.price,
                    brand: 'Google',
                    category: data.category,
                    variant: data.color,
                    currency : data.currency
                }]
            }
        }
    })
}

export const AddToCartEvent = (data) => {
    window.dataLayer = window.dataLayer || [] ;
    window.dataLayer.push({
        event: 'addToCart',
        ecommerce: {
            currencyCode: data.currency,
            add: {
                products: data.product
            }
        }
    })
}

export const RemoveProductCart = (data) => {
    window.dataLayer = window.dataLayer || [] ;
    window.dataLayer.push({
        event: 'removeFromCart',
        ecommerce: {
            remove: {
                products: data.product
            }
        }
    });
}

export const checkoutEvent = (data) => {
    window.dataLayer = window.dataLayer || [] ;
    window.dataLayer.push({
        event: 'checkout',
        ecommerce: {
            checkout: {
                actionField: {
                    step: data.step
                },
                products: data.product
            }
        }
    });
}

export const purchaseEvent = (data) => {
    window.dataLayer = window.dataLayer || [] ;
    window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
            purchase: {
                actionField: data.actionField,
                products: data.product
            }
        }
    })
} 

export const cartPageEvent = (data) => {
    window.dataLayer = window.dataLayer || [] ;
    window.dataLayer.push({
        event: 'cartPage-productInfo',
        eventCategory : 'Cart Page',
        eventAction : 'Cart Product Details',
        eventLabel: data
    });
}