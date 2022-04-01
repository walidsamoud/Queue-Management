import { authHeader, ApiConfigs } from '../_helpers';

export const privacyService = {
    getAll,
    updatePrivacy,
    deleteAccount,
    deleteHistory,
    businessUpdate
};


function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.privacy.getAll}`, requestOptions).then(handleResponse);
}


function updatePrivacy(settings) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.privacy.update}`, requestOptions).then(handleResponse);
}

function deleteAccount(settings) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.privacy.deleteAccount}`, requestOptions).then(handleResponse);
}

function deleteHistory() {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.privacy.deleteHistory}`, requestOptions).then(handleResponse);
}

function businessUpdate(settings) {

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.privacy.updateBusiness}`, requestOptions).then(handleResponse);
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