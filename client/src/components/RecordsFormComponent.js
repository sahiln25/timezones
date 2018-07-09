import React, { Component } from 'react';

import Geosuggest from 'react-geosuggest';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMessage } from '../actions/MessageActions';
import { setRecords, showCreateRecordForm } from '../actions/RecordsActions';
import {baseURL} from "../config";
import axios from "axios/index";

class RecordsFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            city: "",
            gmt_difference: 0
        }
    }

    confirmCreateRecord() {
        let self = this;
        let currRecords = self.props.records;
        let config = { headers: {'x-access-token': String(localStorage.getItem("TOKEN"))} };

        let newRecord = {
            name: this.state.name,
            city: this.state.city,
            gmt_difference: this.state.gmt_difference,
            user: this.props.user._id
        };

        if(this.props.userID) {
            newRecord.user = this.props.userID;
        }

        axios.post(baseURL + 'record', {...newRecord}, config).then(function (response) {
            self.props.showCreateRecordForm(false);
            newRecord._id = response.data.data._id;
            currRecords.push(newRecord);
            self.props.setRecords(currRecords);
            self.props.setMessage({message: response.data.message, message_type: 1});
        }).catch(function (error) {
            console.log(error.response);
            self.props.setMessage({message: error.response.data.message, message_type: 2});
        });
    }

    suggestionSelected(suggest) {
        if(suggest && suggest.label) {
            this.setState({city: suggest.label});

            let url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + suggest.location.lat + ',' + suggest.location.lng +
                      '&timestamp=' + (new Date().getTime() / 1000) +
                      '&key=AIzaSyB4gx_pGZKJaSjC4fTpMVEkMW1tFTtgPeQ';

            let self = this;
            axios.get(url).then(function(response) {
                let gmt_diff = (response.data.dstOffset+response.data.rawOffset)/60/60; //This will get gmt difference in hours.
                self.setState({gmt_difference: gmt_diff});
            }).catch(function (error) {
                console.log(error);
            });
        }
    }

    render() {
        return (
            <div>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">City</th>
                        <th scope="col">GMT Difference</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input placeholder="Timezone Name..." className="form-control" onChange={(event) => {this.setState({name: event.target.value})}} type="text" maxLength="40"/></td>
                            <td><Geosuggest types={["(cities)"]} inputClassName="form-control" onChange={(value) => this.setState({city: value})} onSuggestSelect={(suggest) => {this.suggestionSelected(suggest)}} maxLength="40"/></td>
                            <td><input value={this.state.gmt_difference} placeholder="Difference in GMT..." className="form-control" onChange={(event) => {this.setState({gmt_difference: event.target.value})}} type="text" maxLength="5"/></td>
                        </tr>
                    </tbody>
                </table>
                <button className="btn btn-danger" onClick={() => {this.confirmCreateRecord()}}>Confirm</button>&nbsp;
                <button className="btn btn-danger" onClick={() => {this.props.showCreateRecordForm(false)}}>Cancel</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.NavBarReducer;
    const { creatingRecord, records } = state.RecordsReducer;
    return { creatingRecord, records, user };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ showCreateRecordForm, setMessage, setRecords }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordsFormComponent);