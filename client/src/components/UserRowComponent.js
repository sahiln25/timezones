import React, { Component } from 'react';
import {baseURL} from "../config";
import axios from "axios/index";

import { permissions } from '../config';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setMessage } from "../actions/MessageActions";

class UserRowComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editEmailField: this.props.rowUser.email,
            editPasswordField: "",
            editPermissionField: this.props.rowUser.permission_level,
            editingMode: false,
            inDeleteProcess: false
        };
    }

    deleteUser() {
        this.setState({inDeleteProcess: true});
    }

    confirmDeleteUser() {
        let config = { headers: {'x-access-token': String(localStorage.getItem("TOKEN"))} };
        let self = this;

        let url = baseURL + 'user/' + this.props.rowUser._id;

        axios.delete(url, config).then(function (response) {
            self.props.setMessage({message: response.data.message, message_type: 1});
            self.props.updateUsers();
        }).catch(function (error) {
            console.log(error);
        });
    }

    cancelDelete() {
        this.setState({inDeleteProcess: false});
    }


    editUser() {
        this.setState({editingMode: true});
    }

    confirmEdit() {
        let self = this;
        let config = { headers: {'x-access-token': String(localStorage.getItem("TOKEN"))} };

        let updatedUser = {
            email: this.state.editEmailField,
            password: this.state.editPasswordField,
            permission_level: this.state.editPermissionField
        };

        axios.put(baseURL + 'user/'+ this.props.rowUser._id, {...updatedUser}, config).then(function (response) {
            self.setState({editingMode: false});
            if(self.props.rowUser._id === self.props.user._id) {
                localStorage.setItem("TOKEN", response.data.data.token);
            }
            self.props.updateUsers();
            self.props.setMessage({message: response.data.message, message_type: 1});
        }).catch(function (error) {
            console.log(error);
            self.props.setMessage({message: error.response.data.message, message_type: 2});
        });
    }

    cancelEdit() {
        this.setState({editingMode: false});
    }

    renderDeleteColumn() { //Renders the delete button column
        //Managers can only delete regular users so disable button if not regular
        if(this.props.user.permission_level === "MANAGER" && this.props.rowUser.permission_level !== "REGULAR") {
            return (
                <td><button className="btn disabled">Delete</button></td>
            );
        }
        else if(this.state.inDeleteProcess) {
            return (
                <td>
                    <button className="btn btn-danger" onClick={() => {this.confirmDeleteUser()}}>Confirm</button>&nbsp;
                    <button className="btn btn-primary" onClick={() => {this.cancelDelete()}}>Cancel</button>
                </td>
            );
        }
        else {
            return (
                <td><button className="btn btn-danger" onClick={() => {this.deleteUser()}}>Delete</button></td>
            );
        }
    }

    renderPermissionSelector() { //Renders the select input with the available permissions.
        if(this.props.user.permission_level === "ADMIN") {
            return (
                <select value={this.state.editPermissionField} className="form-control" onChange={(event) => {this.setState({editPermissionField: event.target.value})}}>
                    {permissions.map((permission) =>
                        <option key={permission}>{permission}</option>
                    )}
                </select>
            );
        }
        else {
            return (
                <div className="alert alert-warning">ADMIN ONLY</div>
            )
        }
    }

    renderInfoRow() { //Renders the normal row
        return (
            <tr>
                <td>{this.props.rowUser.email}</td>
                <td>-----</td>
                <td>{this.props.rowUser.permission_level}</td>
                {(this.props.user.permission_level === "ADMIN") ?
                    <td><button className="btn btn-primary" onClick={() => this.props.history.push('/records/user/' + this.props.rowUser._id)}>Timezones</button></td> :
                    null
                }
                {(this.props.user.permission_level === "MANAGER" && this.props.rowUser.permission_level !== "REGULAR") ?
                    <td><button className="btn disabled">Edit</button></td> :
                    <td><button className="btn btn-info" onClick={() => this.editUser()}>Edit</button></td>
                }

                {this.renderDeleteColumn()}
            </tr>
        );
    }

    renderEditFields() {  //Renders row with all the fields as input texts which set to current values of that user
        return (
            <tr>
                <td><input type="text" className="form-control" value={this.state.editEmailField} onChange={(event) => {this.setState({editEmailField: event.target.value})}} maxLength="40"/></td>
                <td><input type="password" placeholder="Enter new password..." className="form-control" value={this.state.editPasswordField} onChange={(event) => {this.setState({editPasswordField: event.target.value})}} maxLength="20"/></td>
                <td>
                    {this.renderPermissionSelector()}
                </td>
                <td>
                    <button className="btn btn-info" onClick={() => {this.confirmEdit()}}>Confirm</button>
                </td>
                <td>
                    <button className="btn btn-danger" onClick={() => {this.cancelEdit()}}>Cancel</button>
                </td>
            </tr>
        );
    }

    render() {
        if(this.state.editingMode === true) {
            return this.renderEditFields();
        }
        else {
            return this.renderInfoRow();
        }
    }
}

function mapStateToProps(state) {
    let { user } = state.NavBarReducer;
    return { user };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setMessage }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRowComponent);