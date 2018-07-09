export default ((state = {}, action) => {
    switch (action.type) {
        case 'SET_MESSAGE':
            let { message, message_type } = action.payload;
            return {...state, message, message_type};
        default:
            return state;
    }
});