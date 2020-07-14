import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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