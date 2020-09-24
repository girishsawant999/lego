import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class StoreFilter extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <div>
                <div className="storeFilter">
                    {this.props.title}
                </div>
            </div>
        )
    }
}


export default (StoreFilter);