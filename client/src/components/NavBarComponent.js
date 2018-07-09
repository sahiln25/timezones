import React, { Component } from 'react';

import axios from 'axios';

import { baseURL } from '../config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMessage } from '../actions/MessageActions';
import { setLoggedIn, setUser } from '../actions/NavBarActions';


class NavBarComponent extends Component {

    constructor(props) {
        super(props);
        this.checkLoggedIn();
    }

    componentWillReceiveProps() { //Just makes sure if props change, we check if the user is still logged in.
        this.checkLoggedIn();
    }

    checkLoggedIn() {
        const self = this;
        if(localStorage.getItem("TOKEN") !== undefined && localStorage.getItem("TOKEN") !== '') {
            let config = { headers: {'x-access-token': String(localStorage.getItem("TOKEN"))} };

            axios.get(baseURL + 'authentication', config).then(function (response) {
                self.props.setLoggedIn(true);
                axios.get(baseURL + 'user', config).then(function(response) {
                    self.props.setUser(response.data.data.user);
                }).catch(function(error) {
                    console.log(error);
                });

                if(self.props.history.location.pathname === '/register' || self.props.history.location.pathname === '/login') {
                    self.props.history.push('/'); //Can't register or login if already logged in.
                }
            }).catch(function (error) {
                console.log(error);
                if(self.props.history.location.pathname !== '/register' && self.props.history.location.pathname !== '/login') {
                    localStorage.setItem("TOKEN", '');
                    self.props.setLoggedIn(false);
                    self.props.history.push('/login');
                }
            });
        }
        else {
            self.props.setLoggedIn(false);
            self.props.history.push('/login');
        }
    }

    logout() {
        localStorage.setItem("TOKEN", undefined);
        this.checkLoggedIn();
    }

    renderUserButton() {
        if(this.props.user && (this.props.user.permission_level === "MANAGER" || this.props.user.permission_level === "ADMIN")){
            return <button className="navbar-btn btn btn-danger btn-header"onClick={() => {this.props.history.push('/users')}}>User List</button>
        }
        return null;
    }

    renderButtons() {
        if(this.props.loggedIn) {
            return (
                <div>
                    <button className="navbar-btn btn btn-default btn-header"onClick={() => {this.props.history.push('/records')}}>My Timezones</button>
                    {this.renderUserButton()}
                    <button className="navbar-btn btn btn-default btn-header"onClick={() => {this.logout()}}>Logout</button>
                </div>
            );
        }
        else {
            return (
                <div>
                    <button className="navbar-btn btn btn-default btn-header" onClick={() => {this.props.history.push('/login')}}>Login</button>
                    <button className="navbar-btn btn btn-default btn-header"onClick={() => {this.props.history.push('/register')}}>Register</button>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="container-fluid">
            <nav className="navbar navbar-default">
                <a className="navbar-brand" href="/">Timezone App</a>
                {this.renderButtons()}
            </nav>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { loggedIn, user } = state.NavBarReducer;
    return { loggedIn, user };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setLoggedIn, setMessage, setUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarComponent);