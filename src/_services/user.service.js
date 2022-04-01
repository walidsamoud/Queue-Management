import { authHeader, ApiConfigs } from '../_helpers';

export const userService = {
    login,
    logout,
    register,
    verify,
    getAll,
    checkEmail,
    getById,
    update,
    updatePassword,
    requestPasswordReset,
    passwordReset,
    delete: _delete
};

var Config = require("@config");
var gateway_id = Config.sms_config.gateway_id;
var sender_name = Config.sms_config.sender_name;

function login(phone, phone_prefix) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, phone_prefix, sender_name, gateway_id})

    };
    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.accounts.login}`, requestOptions).then(handleResponse);
}

function verify(user) {
    let data= {
        phone: user.phone,
        phone_prefix: user.phone_prefix,
        code: user.code,
        sender_name: sender_name,
        gateway_id: gateway_id
    }

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.accounts.verify}`, requestOptions)
        .then(handleResponse)
        .then(user => {
            if (user.user.token) { localStorage.setItem('user', JSON.stringify(user.user)); }
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.accounts.logout}`, requestOptions)
        .then(handleResponse)
        .then(function () {
            localStorage.removeItem('user');
        });
}

function register(user) {
    let data= {
        phone: user.phone,
        phone_prefix: user.phone_prefix,
        fullname: user.fullname,
        email: user.email,
        country: user.country,
        social_reason: user.social_reason,
        sender_name: sender_name,
        gateway_id: gateway_id
    }
    

    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.accounts.register}`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        });
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_user_url}/users`, requestOptions).then(handleResponse);
}


function checkEmail(email) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.accounts.check_email.replace(':email', email)}`, requestOptions).then(handleResponse);
}


function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_user_url}/users/${id}`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader()},
        body: user
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.accounts.update}`, requestOptions).then(handleResponse);
}


function updatePassword(password) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(),  'Content-Type': 'application/json' },
        body: JSON.stringify(password)
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.accounts.update_password}`, requestOptions).then(handleResponse);
}

function requestPasswordReset(password) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(),  'Content-Type': 'application/json' },
        body: JSON.stringify(password)
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.accounts.reset_password}`, requestOptions).then(handleResponse);
}

function passwordReset(password) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(),  'Content-Type': 'application/json' },
        body: JSON.stringify(password)
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.accounts.reset_update_password}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_user_url}/users/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                //logout();
                //location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
