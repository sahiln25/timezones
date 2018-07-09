export default ((state = {}, action) => {
    switch (action.type) {
        case 'SET_LOGGED_IN':
            let { loggedIn } = action;
            return {...state, loggedIn};
        case 'SET_USER':
            let { user } = action;
            return {...state, user};
        default:
            return state;
    }
});