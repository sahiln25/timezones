import React, { Component } from 'react';

class AppComponent extends Component {
    componentDidMount() {
        this.props.history.push('/records'); //Go to the records page by default
    }

    render() {
        return (
            <div className="container"></div>
        );
    }
}

export default AppComponent;
