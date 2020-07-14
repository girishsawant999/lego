import { API_TOKEN, IP_INFO_TOKEN } from './globalApi';

export const buildHeader = (headerParams = {}) => {
    var header = {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Access-control-allow-origin': '*',
    }
    Object.assign(header, headerParams);
    return header;
}

export const ipInfoHeader = (headerParams = {}) => {
    var header = {
        'Authorization': `Bearer ${IP_INFO_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Access-control-allow-origin': '*',
    }
    Object.assign(header, headerParams);
    return header;
}
