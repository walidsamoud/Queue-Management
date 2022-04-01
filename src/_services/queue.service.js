import { authHeader, ApiConfigs } from '../_helpers';

export const queueService = {
    getAll,
    getAllWithSummary,
    getPage,
    getPageWithSummary,
    getById,
    getByIdWithSummary,
    getWaitingList,
    getArchivedWaitingList,
    getInService,
    update,
    create,
    push,
    callNext,
    openCounter,
    closeCounter,
    updateMember,
    markAsNoShow,
    redirect,
    revokeTicket,
    getTicketByUid,
    revokeTicketByUid,
    getArchivedTicketByUid,
    submitFeedbackByUid,
    pushBack,
    swap,
    move,
    updateUrgentStatus,
    addNote,
    addDelay,
    resumeService,
    updateTranslations,
    getTranslations,
    delete: _delete,
    updateQueueSlots,
    getQueueSlots,
    createTicket,
    runningLate,
    getConfirmed,
    moveToLast,
    getQueueById
};

function getQueueById(id) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.queues.getQueueById.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function moveToLast(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.queues.moveToLast}`, requestOptions).then(handleResponse);
}

function getConfirmed() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader()}
    };
    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.queues.getConfirmed}`, requestOptions).then(handleResponse);
}

function createTicket(id, payload) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.queues.push.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.getAll}`, requestOptions).then(handleResponse);
}


function getAllWithSummary() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.getAllWithSummary}`, requestOptions).then(handleResponse);
}


function getPage(page) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.pagination+page}`, requestOptions).then(handleResponse);
}


function getPageWithSummary(page) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.paginationWithSummary+page}`, requestOptions).then(handleResponse);
}



function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.queues.get.replace(':id', id)}`, requestOptions).then(handleResponse);
}


function getByIdWithSummary(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.getWithSummary.replace(':id', id)}`, requestOptions).then(handleResponse);
}


function getWaitingList(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.getWaitingList.replace(':id', id)}`, requestOptions).then(handleResponse);
}


function getArchivedWaitingList(id, payload) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.getArchivedWaitingList.replace(':id', id)}`, requestOptions).then(handleResponse);
}


function getInService(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.getInService.replace(':id', id)}`, requestOptions).then(handleResponse);
}


function update(queue) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(queue)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.update.replace(':id', queue.id)}`, requestOptions).then(handleResponse);
}


function create(queue) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(queue)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.create}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues._delete.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function push(customer) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.push.replace(':id', customer.queue_id)}`, requestOptions).then(handleResponse);
}


function redirect(ticket) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.redirect.replace(':queue_id', ticket.queue_id)
        .replace(':customer_id', ticket.customer_id).replace(':target_id', ticket.target_id)}`
        , requestOptions).then(handleResponse);
}

function callNext(queue) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.callNext.replace(':queue_id', queue)}`, requestOptions)
        .then(handleResponse);
}

function openCounter(queue, counter) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.openCounter.replace(':queue', queue).replace(':counter', counter)}`, requestOptions)
        .then(handleResponse);
}

function updateMember(queue, customer, payload) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.updateMember.replace(':queue_id', queue).replace(':customer_id', customer)}`, requestOptions)
        .then(handleResponse);
}

function markAsNoShow(queue, customer) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.noshow.replace(':queue_id', queue).replace(':customer_id', customer)}`, requestOptions)
        .then(handleResponse);
}

function updateUrgentStatus(queue, ticket, payload) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.updateUrgentStatus.replace(':queue_id', queue).replace(':ticket_id', ticket)}`, requestOptions)
        .then(handleResponse);
}

function closeCounter(queue, counter) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.closeCounter.replace(':queue', queue).replace(':counter', counter)}`, requestOptions)
        .then(handleResponse);
}

function pushBack(queue, ticket) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.pushBack.replace(':queue_id', queue).replace(':ticket_id', ticket)}`, requestOptions)
        .then(handleResponse);
}

function addNote(queue, ticket, payload) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.addNote.replace(':queue_id', queue).replace(':ticket_id', ticket)}`, requestOptions)
        .then(handleResponse);
}

function swap(queue, customer_1, customer_2) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.swap.replace(':queue_id', queue)
        .replace(':customer_1', customer_1).replace(':customer_2', customer_2)}`, requestOptions)
        .then(handleResponse);
}

function move(queue, ticket_id, oldRank, newRank) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.move.replace(':queue_id', queue)
        .replace(':ticket_id', ticket_id).replace(':old', oldRank).replace(':new', newRank)}`, requestOptions)
        .then(handleResponse);
}

function revokeTicket(ticket) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.revoke.replace(':queue_id', ticket.queue_id)
        .replace(':customer_id', ticket.customer_id)}`, requestOptions).then(handleResponse);
}

function getTicketByUid(uid) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.queues.getTicketByUid.replace(':uid', uid)}`,
        requestOptions).then(handleResponse);
}

function getArchivedTicketByUid(uid) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.queues.getArchivedTicketByUid.replace(':uid', uid)}`,
        requestOptions).then(handleResponse);
}

function revokeTicketByUid(uid) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.queues.cancelByUid.replace(':uid', uid)}`,
        requestOptions).then(handleResponse);
}


function submitFeedbackByUid(data) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_user_url+ApiConfigs.queues.submitFeedbackByUid.replace(':uid', data.uid)}`, requestOptions).then(handleResponse);
}

function updateTranslations(id, translations) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(translations)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.update_translations.replace(':id', id)}`, requestOptions).then(handleResponse);
}


function getTranslations(id) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.get_translations.replace(':id', id)}`, requestOptions).then(handleResponse);
}


function updateQueueSlots(id, queueSlots) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(queueSlots)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.updateQueueSlots.replace(':id', id)}`, requestOptions).then(handleResponse);
}


function getQueueSlots(id) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.getQueueSlots.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function addDelay(id, payload) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.createDelay.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function resumeService(id) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.resumeService.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function runningLate(id) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.queues.runningLate.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                // /*location.reload(true);*/window.location.href = '/login';
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}