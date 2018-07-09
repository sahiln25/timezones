import React, { Component } from 'react';
import RecordRowComponent from './RecordRowComponent';
import RecordsFormComponent from './RecordsFormComponent';
import axios from "axios/index";

import { baseURL } from "../config";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setRecords, showCreateRecordForm } from '../actions/RecordsActions';

class RecordsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramUserID: '',
            nameFilter: ''
        };

        if(this.props.match.params.userId) {
            this.state.paramUserID = this.props.match.params.userId;
        }

        this.getRecords();
    }

    createRecordForm() {
        this.props.showCreateRecordForm(true);
    }

    getRecords() { //gets the record of the logged in user or the user specified in the url param (if admin).
        if(localStorage.getItem("TOKEN") !== undefined && localStorage.getItem("TOKEN") !== '') {
            let config = {headers: {'x-access-token': String(localStorage.getItem("TOKEN"))}};
            let self = this;
            if (this.state.paramUserID) {
                axios.get(baseURL + 'record/all/user/' + self.state.paramUserID, config).then(function (response) {
                    self.props.setRecords(response.data.data.records);
                }).catch(function (error) {
                    self.props.history.push('/records');
                    console.log(error);
                });
            }
            else {
                axios.get(baseURL + 'record/all', config).then(function (response) {
                    self.props.setRecords(response.data.data.records);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    }

    deleteRecord(id) {
        let config = { headers: {'x-access-token': String(localStorage.getItem("TOKEN"))} };
        let self = this;

        let url = baseURL + 'record/' + id;

        axios.delete(url, config).then(function (response) {
            self.getRecords();
        }).catch(function (error) {
            console.log(error);
        });
    }

    renderRecordRowComponent() {
        let recordRows = [];
        for(let i = 0; i <  this.props.records.length; i++) {
            let record = this.props.records[i];
            if(record.name.includes(this.state.nameFilter)) { //filters by name
                recordRows.push(<RecordRowComponent key={record._id} record={record} updateRecords={() => this.getRecords()}/>);
            }
        }
        return recordRows;
    }

    render() {
        if (this.props.records && this.props.records.length >= 1) {
            return (
                <div className="container">
                    <h1>Records</h1>
                    <input type="text" className="form-control" placeholder="Filter by name..." onChange={(event) => this.setState({nameFilter: event.target.value})}/>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">City</th>
                            <th scope="col">GMT Difference</th>
                            <th scope="col">Current Time</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderRecordRowComponent()}
                        </tbody>
                    </table>
                    {
                        this.props.creatingRecord ?
                        <RecordsFormComponent userID={this.state.paramUserID}/> :
                        <button className="btn btn-primary" onClick={() => {this.createRecordForm()}}>Create New Record</button>
                    }
                </div>
            );
        } else {
            return (
                <div className="container">
                    <h2>Please create a new timezone.</h2>
                    {
                        this.props.creatingRecord ?
                            <RecordsFormComponent userID={this.state.paramUserID}/> :
                            <button className="btn btn-primary" onClick={() => {this.createRecordForm()}}>Create New Record</button>
                    }
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    let { headers, user } = state.NavBarReducer;
    let { records, creatingRecord } = state.RecordsReducer;
    return { headers, records, creatingRecord, user };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setRecords, showCreateRecordForm }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordsComponent);