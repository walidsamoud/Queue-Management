import { authHeader, ApiConfigs } from '../_helpers';

export const settingsService = {
    getSettings,
    setSettings,
    setSettingsByUid
};

function getSettings() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.settingsUser.getAll}`, requestOptions).then(handleResponse);
}

function setSettings(language) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(language)
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.settingsUser.update}`, requestOptions)
        .then(handleResponse)
        .then({
            // if (user.user.token) { localStorage.setItem('user', JSON.stringify(user.user)); }
            // return user;
        });
}

function setSettingsByUid(language) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(language)
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.settingsUser.updateByUid}`, requestOptions)
        .then(handleResponse)
        .then({
            // if (user.user.token) { localStorage.setItem('user', JSON.stringify(user.user)); }
            // return user;
        });
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




