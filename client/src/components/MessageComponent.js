import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMessage } from "../actions/MessageActions";

class MessageComponent extends Component {

    render() {
        let typeClass = "";
        let prefix = '';
        if(this.props.message_type === 0) {
            typeClass = "alert alert-info";
            prefix = <strong>Please Note: </strong>;
        }
        else if(this.props.message_type === 1) {
            typeClass = 'alert alert-success';
            prefix = <strong>Success!</strong>;
        }
        else {
            typeClass = "alert alert-danger";
            prefix = <strong>Error! </strong>;
        }

        return (
            <div className="container-fluid">
                { this.props.message !== '' && this.props.message !== undefined
                    ?
                    <div className={typeClass}>
                        {prefix} {this.props.message}
                        <div className="pull-right"><button className="btn btn-light btn-xs" onClick={() => {this.props.setMessage({message: "", message_type: 0})}}>X</button></div>
                    </div>
                    :
                    null
                }
            </div>
        );
    }

}

function mapStateToProps(state) {
    let { message, message_type } = state.MessageReducer;
    return { message, message_type };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setMessage }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageComponent);
