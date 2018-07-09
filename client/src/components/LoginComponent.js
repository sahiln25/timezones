import React, { Component } from 'react';
import axios from 'axios';
import { baseURL } from '../config';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setMessage } from '../actions/MessageActions';
import { setLoggedIn } from "../actions/NavBarActions";

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    login() {
        let self = this;
        axios.post(baseURL + 'authentication', {
            email: this.state.email,
            password: this.state.password
        }).then(function (response) {
            localStorage.setItem("TOKEN", response.data.data.token);
            self.props.setMessage({message: response.data.message, message_type: 1});
            self.props.setLoggedIn(true);
            self.props.history.push('/'); //On successful registration, redirect to homepage.
        }).catch(function (error) {
            self.props.setMessage({message: error.response.data.message, message_type: 2});
        });

    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h1>Login</h1>
                        <p className="lead">Don't have an account? Please register <a href="" onClick={() => {this.props.history.push('/register');}}>here.</a></p>
                        <form>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input onChange={(event) => {this.setState({email: event.target.value})}} type="email" className="form-control" id="email" placeholder="Enter email" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input onChange={(event) => {this.setState({password: event.target.value})}} type="password" className="form-control" id="password" placeholder="Password" />
                            </div>
                            <button type="button" className="btn btn-default" onClick={() => this.login()}>Login!</button>
                        </form>
                    </div>
                </div>
            </div>

        );
    }

}


function mapStateToProps(state) {
    const { message } = state;
    return { message };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setMessage, setLoggedIn }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
