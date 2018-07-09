export default ((state = {}, action) => {
    switch (action.type) {
        case 'SET_RECORDS':
            let { records } = action;
            return { records };
        case 'SET_CREATING_RECORD':
            let {creatingRecord} = action;
            return {...state, creatingRecord};
        default:
            return state;
    }
});