import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMessage } from '../actions/MessageActions';
import { showUserCreateForm } from "../actions/UsersActions";

import {baseURL} from '../config';
import axios from "axios/index";

class CreateUserFormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        }
    }

    confirmCreateUser() {
        //Submit the user form.
        let self = this;
        axios.post(baseURL + 'user', {
            email: this.state.email,
            password: this.state.password
        }).then(function (response) {
            self.props.setMessage({message: response.data.message, message_type: 1});
            self.props.updateUsers();
            self.props.showUserCreateForm(false);
        }).catch(function (error) {
            console.log(error);
            self.props.setMessage({message: error.response.data.message, message_type: 2});
        });
    }

    render() {
        return (
            <div>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Email</th>
                        <th scope="col">Password</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><input placeholder="Email..." className="form-control" onChange={(event) => {this.setState({email: event.target.value})}} type="text" maxLength="40"/></td>
                        <td><input placeholder="Password..." className="form-control" onChange={(event) => {this.setState({password: event.target.value})}} type="password" maxLength="40"/></td>
                    </tr>
                    </tbody>
                </table>
                <button className="btn btn-primary" onClick={() => {this.confirmCreateUser()}}>Confirm</button>&nbsp;
                <button className="btn btn-danger" onClick={() => {this.props.showUserCreateForm(false)}}>Cancel</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { message, userList } = state;
    return { message, userList };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setMessage, showUserCreateForm }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserFormComponent);