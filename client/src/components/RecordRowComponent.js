import React, { Component } from 'react';

import axios from "axios/index";

import { baseURL } from "../config";
import Geosuggest from 'react-geosuggest';
import DateComponent from "./DateComponent";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {setMessage} from "../actions/MessageActions";

class RecordRowComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingMode: false,
            editNameField: this.props.record.name,
            editCityField: this.props.record.city,
            editGMTField: this.props.record.gmt_difference
        }
    }

    deleteRecord() {
        this.setState({inDeleteProcess: true});
    }

    confirmDeleteRecord() {
        let config = { headers: {'x-access-token': String(localStorage.getItem("TOKEN"))} };
        let self = this;

        let url = baseURL + 'record/' + this.props.record._id;

        axios.delete(url, config).then(function (response) {
            self.props.setMessage({message: response.data.message, message_type: 1});
            self.props.updateRecords();
        }).catch(function (error) {
            console.log(error);
        });
    }

    cancelDelete() {
        this.setState({inDeleteProcess: false});
    }

    editRecord() {
        this.setState({editingMode: true});
    }

    confirmEdit() {
        let self = this;
        let config = { headers: {'x-access-token': String(localStorage.getItem("TOKEN"))} };

        let updatedRecord = {
            name: this.state.editNameField,
            city: this.state.editCityField,
            gmt_difference: this.state.editGMTField
        };

        axios.put(baseURL + 'record/'+ this.props.record._id, {...updatedRecord}, config).then(function (response) {
            self.setState({editingMode: false});
            self.props.updateRecords();
            self.props.setMessage({message: response.data.message, message_type: 1});
        }).catch(function (error) {
            console.log(error);
            self.props.setMessage({message: error.responese.data.message, message_type: 2});
        });
    }

    cancelEdit() {
        this.setState({
            editNameField: this.props.record.name,
            editCityField: this.props.record.city,
            editGMTField: this.props.record.gmt_difference,
            editingMode: false,
            inDeleteProcess: false
        });
    }

    suggestionSelected(suggest) {
        if(suggest && suggest.label) {
            this.setState({editCityField: suggest.label});

            let url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + suggest.location.lat + ',' + suggest.location.lng +
                '&timestamp=' + (new Date().getTime() / 1000) +
                '&key=AIzaSyB4gx_pGZKJaSjC4fTpMVEkMW1tFTtgPeQ';

            let self = this;
            axios.get(url).then(function(response) {
                let gmt_diff = (response.data.dstOffset+response.data.rawOffset)/60/60; //This will get gmt difference in hours.
                self.setState({editGMTField: gmt_diff});
            }).catch(function (error) {
                console.log(error);
            });
        }
    }

    renderEditFields() { //Renders row with all the fields as input texts which set to current values of that record
        return (
            <tr key={this.props.record._id}>
                <th scope="row"><input className="form-control" type="text" value={this.state.editNameField} onChange={(event) => {this.setState({editNameField: event.target.value})}} maxLength="40"/></th>
                <td><Geosuggest types={["(cities)"]} inputClassName="form-control" initialValue={this.state.editCityField} onChange={(value) => this.setState({editCityField: value})} onSuggestSelect={(suggest) => {this.suggestionSelected(suggest)}} maxLength="40"/></td>
                <td><input className="form-control" type="text" value={this.state.editGMTField} onChange={(event) => {this.setState({editGMTField: event.target.value})}} maxLength="5"/></td>
                <td>---</td>
                <td>
                    <button className="btn btn-info" onClick={() => {this.confirmEdit()}}>Confirm</button>
                </td>
                <td>
                    <button className="btn btn-danger" onClick={() => {this.cancelEdit()}}>Cancel</button>
                </td>
            </tr>
        );
    }

    renderInfoRow() { //Renders the normal row
        return (
            <tr key={this.props.record._id}>
                <th scope="row">{this.state.editNameField}</th>
                <td>{this.state.editCityField}</td>
                <td>{this.state.editGMTField}</td>
                <td><DateComponent id={this.props.record._id} offset={this.state.editGMTField}/></td>
                <td>
                    <button className="btn btn-info" onClick={() => {this.editRecord()}}>Edit</button>
                </td>
                {
                    this.state.inDeleteProcess ?
                        <td>
                            <button className="btn btn-danger" onClick={() => {this.confirmDeleteRecord()}}>Confirm</button>&nbsp;
                            <button className="btn btn-primary" onClick={() => {this.cancelDelete()}}>Cancel</button>
                        </td>
                        :
                        <td><button className="btn btn-danger" onClick={() => {this.deleteRecord()}}>Delete</button></td>
                }

            </tr>
        );
    }

    render() {
        if(this.state.editingMode === true) {
            return this.renderEditFields();
        }
        else {
            return this.renderInfoRow()
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setMessage }, dispatch)
}

export default connect(null, mapDispatchToProps)(RecordRowComponent);