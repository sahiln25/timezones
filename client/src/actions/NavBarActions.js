export function setLoggedIn(loggedIn) {
    const action = {
        type: 'SET_LOGGED_IN',
        loggedIn
    };
    return action;
}
export function setUser(user) {
    const action = {
        type: 'SET_USER',
        user
    };
    return action
}