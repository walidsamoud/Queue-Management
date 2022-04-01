import { authHeader, ApiConfigs } from '../_helpers';

export const privateServiceService = {
    getAll,
    getPage,
    filter,
    getById,
    update,
    create,
    multipleCreate,
    delete: _delete,
    getDurationByDepartment
};


function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.private_services.getAll}`, requestOptions).then(handleResponse);
}


function getDurationByDepartment(service_id,department_id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.private_services.getByDepartment.replace(':id',department_id)+service_id}`, requestOptions).then(handleResponse);
}


function getPage(page) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.private_services.pagination+page}`, requestOptions).then(handleResponse);
}


function filter(keyword) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.private_services.filter.replace(':keyword', keyword)}`, requestOptions).then(handleResponse);
}


function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.private_services.get.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function update(service) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.private_services.update.replace(':id', service.id)}`, requestOptions).then(handleResponse);
}

function create(service) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.private_services.create}`, requestOptions).then(handleResponse);
}

function multipleCreate(services) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(services)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.private_services.multipleCreate}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.private_services._delete.replace(':id', id)}`, requestOptions).then(handleResponse);
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