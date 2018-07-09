import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';

import createBrowserHistory from 'history/createBrowserHistory';

import AppComponent from './components/AppComponent';
import LoginComponent from'./components/LoginComponent';
import MessageComponent from './components/MessageComponent';
import NavBarComponent from './components/NavBarComponent';
import RecordsComponent from './components/RecordsComponent';
import RegisterComponent from './components/RegisterComponent';
import UsersComponent from './components/UsersComponent';

import AppReducer from './reducers/AppReducer';

const browserHistory = createBrowserHistory();

let store = createStore(AppReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
    <Provider store={store}>
        <div>
            <Router path="/" history={browserHistory}>
                <div>
                    <NavBarComponent history={browserHistory}/>
                    <MessageComponent />
                    <Route exact path="/register" component={RegisterComponent}/>
                    <Route exact path="/login" component={LoginComponent}/>
                    <Route exact path="/records" component={RecordsComponent}/>
                    <Route exact path="/records/user/:userId" component={RecordsComponent} />
                    <Route exact path="/users" component={UsersComponent}/>
                    <Route exact path="/" component={AppComponent}/>
                    <Route path = "*" component={AppComponent}/>
                </div>
            </Router>
        </div>
    </Provider>, document.getElementById('root')
);