export function setMessage(payload) { //setMessage to be displayed to user upon login, record creation, etc.
    const action = {
        type: 'SET_MESSAGE',
        payload: payload
    };
    return action;
}

