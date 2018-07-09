import React, { Component } from 'react';

class DateComponent extends Component {
    componentDidMount() {

        let self = this;
        let timerUpdate = setInterval(function() {
            let d = new Date();

            // convert to msec
            // add local time zone offset
            // get UTC time in msec
            let utc = d.getTime() + (d.getTimezoneOffset() * 60000);

            // create new Date object for different city
            // using supplied offset
            let nd = new Date(utc + (3600000*self.props.offset));

            // return time as a string
            let element = document.getElementById(self.props.id);
            if(element) {
                element.innerHTML = nd.toLocaleString();
            }
            else {
                clearInterval(timerUpdate);
            }
        }, 1000);
    }

    render() {
        return (
            <div id={this.props.id}>Loading..</div>
        );
    }
}

export default DateComponent;