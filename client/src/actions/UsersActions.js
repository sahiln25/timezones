export function setUserList(userList) { //sets users list for manager/admin viewing
    const action = {
        type: 'SET_USER_LIST',
        userList
    };
    return action;
}
export function showUserCreateForm(creatingUser) { //toggles showing/hiding the create user form in the user list
    const action = {
        type: 'SET_CREATING_USER',
        creatingUser
    };
    return action;
}