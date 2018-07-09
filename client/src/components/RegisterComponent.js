import React, { Component } from 'react';
import axios from 'axios';
import { baseURL } from '../config';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setMessage } from '../actions/MessageActions';
import { setLoggedIn } from "../actions/NavBarActions";

class RegisterComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: ''
        };
    }

    register() {
        if(this.passwordsMatch()) {
            let self = this;
            axios.post(baseURL + 'user', {
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
    }

    passwordsMatch() {
        if(this.state.password !== this.state.confirmPassword) {
            this.props.setMessage({message: 'Passwords do not match.', message_type: 2});
            this.setState({errorMessage: 'Passwords do not match.'});
            return false;
        }
        return true;
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h1>Register</h1>
                        <p className="lead">Already registered? Please log in <a href="" onClick={() => {this.props.history.push('/login');}}>here.</a></p>
                        <form>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input onChange={(event) => {this.setState({email: event.target.value})}} type="email" className="form-control" id="email" placeholder="Enter email" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input onChange={(event) => {this.setState({password: event.target.value})}} type="password" className="form-control" id="password" placeholder="Password" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <input onChange={(event) => {this.setState({confirmPassword: event.target.value})}} type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" />
                            </div>
                            <button type="button" className="btn btn-default" onClick={() => this.register()}>Register!</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterComponent);
