import { authHeader, ApiConfigs } from '../_helpers';

export const feedbackService = {
    getAll,
    getPage,
    get
};


function getAll(vendor) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.feedback.get.replace(':id', vendor)}`, requestOptions).then(handleResponse);
}

function getPage(vendor,page) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.feedback.getPage.replace(':id', vendor)+page}`, requestOptions).then(handleResponse);
}


function get(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.vendors.get.replace(':id', id)}`, requestOptions).then(handleResponse);
}



function handleResponse(response) {
    return response.text().then(text => {
        const data = JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
