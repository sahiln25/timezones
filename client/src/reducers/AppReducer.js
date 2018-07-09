import { combineReducers } from 'redux';
import NavBarReducer from './NavBarReducer';
import MessageReducer from './MessageReducer';
import RecordsReducer from './RecordsReducer';
import UsersReducer from './UsersReducer';

export default combineReducers({
    MessageReducer,
    NavBarReducer,
    RecordsReducer,
    UsersReducer
});