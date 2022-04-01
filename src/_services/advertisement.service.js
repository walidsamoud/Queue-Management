import { authHeader, ApiConfigs } from '../_helpers';

export const advertisementService = {
    get
};

function get(payload) {
    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    };

    return fetch(`${ApiConfigs.base_ads+ApiConfigs.advertisement.get}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                /*location.reload(true);*/window.location.href = '/login';
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
