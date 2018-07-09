export default ((state = {}, action) => {
    switch (action.type) {
        case 'SET_USER_LIST':
            let { userList } = action;
            return { userList };
        case 'SET_CREATING_USER':
            let {creatingUser} = action;
            return {...state, creatingUser};
        default:
            return state;
    }
});