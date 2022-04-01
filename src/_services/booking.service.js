import { authHeader, ApiConfigs } from '../_helpers';

export const bookingService = {
    getAll,
    get,
    getConfirmed,
    getPending,
    getArchive,
    getAvailability,
    createBooking,
    cancelRequest,
    cancelBooking
};


function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_user_url + ApiConfigs.bookingsuser.getAll}`, requestOptions).then(handleResponse);
}


function get(id) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_user_url + ApiConfigs.bookingsuser.get.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function getConfirmed() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_user_url + ApiConfigs.bookingsuser.getConfirmed}`, requestOptions).then(handleResponse);
}

function getPending() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_user_url + ApiConfigs.bookingsuser.getPending}`, requestOptions).then(handleResponse);
}

function getArchive() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_user_url + ApiConfigs.bookingsuser.getArchive}`, requestOptions).then(handleResponse);
}

function getAvailability(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    return fetch(`${ApiConfigs.base_user_url + ApiConfigs.bookingsuser.availability}`, requestOptions).then(handleResponse);
}

function createBooking(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader()},
        body: data
    };
    return fetch(`${ApiConfigs.base_user_url + ApiConfigs.bookingsuser.create}`, requestOptions).then(handleResponse);
}


function cancelRequest(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: {}
    };
    return fetch(`${ApiConfigs.base_user_url + ApiConfigs.bookingsuser.cancelRequest.replace(':id', id)}`, requestOptions).then(handleResponse);
}


function cancelBooking(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({id: id})
    };
    return fetch(`${ApiConfigs.base_user_url + ApiConfigs.bookingsuser.cancelBooking}`, requestOptions).then(handleResponse);
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
