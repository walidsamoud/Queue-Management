import { authHeader, ApiConfigs } from '../_helpers';

export const bookingRequestService = {
    getByUid,
    approve,
    decline
};


function getByUid(uid) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.booking_requests.getRequestByUid.replace(':uid', uid)}`, requestOptions).then(handleResponse);
}

function approve(data, uid) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.booking_requests.approveFromMlbrx.replace(':uid', uid)}`, requestOptions).then(handleResponse);
}

function decline(uid) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.booking_requests.declineFromMlbrx.replace(':uid', uid)}`, requestOptions).then(handleResponse);
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