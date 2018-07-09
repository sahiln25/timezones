import React, { Component } from 'react';
import axios from "axios/index";

import { baseURL } from "../config";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showUserCreateForm, setUserList } from '../actions/UsersActions';

import CreateUserFormComponent from './CreateUserFormComponent';
import UserRowComponent from './UserRowComponent';


class UsersComponent extends Component {
    componentDidMount() {
        this.getUsers();
    }

    createUserForm() {
        this.props.showUserCreateForm(true);
    }

    getUsers() {
        let config = { headers: {'x-access-token': String(localStorage.getItem("TOKEN"))} };
        let self = this;
        axios.get(baseURL + 'user/all', config).then(function (response) {
            self.props.setUserList(response.data.data.users);
        }).catch(function (error) {
            console.log(error);
        });
    }

    render() {
        if (this.props.userList && this.props.userList.length >= 1 && this.props.user && (this.props.user.permission_level === "MANAGER" || this.props.user.permission_level === "ADMIN")) {
            return (
                <div className="container">
                    <h1>Users</h1>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Email</th>
                            <th scope="col">Password</th>
                            <th scope="col">Permission Level</th>
                            {(this.props.user && this.props.user.permission_level === "ADMIN") ?
                                <th scope="col">Timezones</th> :
                                null
                            }
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.props.userList.map(user =>
                                <UserRowComponent history={this.props.history} key={user._id} rowUser={user} updateUsers={() => this.getUsers()}/>
                            )}
                        </tbody>
                    </table>
                    {
                        this.props.creatingUser ?
                            <CreateUserFormComponent updateUsers={() => this.getUsers()}/> :
                            <button className="btn btn-primary" onClick={() => {this.createUserForm()}}>Create New User</button>
                    }
                </div>
            );
        } else {
            return (
                <div className="container">
                    <h2>Nothing found here.</h2>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    let { user } = state.NavBarReducer;
    let { creatingUser, userList } = state.UsersReducer;
    return { creatingUser, user, userList };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setUserList, showUserCreateForm }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersComponent);