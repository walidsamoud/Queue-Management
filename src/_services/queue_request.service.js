import { authHeader, ApiConfigs } from '../_helpers';

export const queueRequestService = {
    getAll,
    getPage,
    getById,
    update,
    approve,
    decline,
    delete: _delete
};


function getAll(queue) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queue_requests.getAll.replace(':queue_id', queue)}`, requestOptions).then(handleResponse);
}



function getPage(page) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queue_requests.pagination+page}`, requestOptions).then(handleResponse);
}


function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queue_requests.get.replace(':id', id)}`, requestOptions).then(handleResponse);
}


function update(request) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queue_requests.update.replace(':id', request.id)}`, requestOptions).then(handleResponse);
}


function approve(request) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queue_requests.approve.replace(':id', request.id)
        .replace(':queue_id', request.queue_id)
    }`, requestOptions).then(handleResponse);
}


function decline(request) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queue_requests.decline.replace(':id', request.id)
        .replace(':queue_id', request.queue_id)
    }`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queue_requests._delete.replace(':id', id)}`, requestOptions).then(handleResponse);
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