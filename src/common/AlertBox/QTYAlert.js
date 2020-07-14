import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

class QTYAlert extends Component {
    constructor(props) {
        super(props)
        this.myIntl = props.intl
        this.state = {
            showAlertBoxReact: this.props.alertBoxStatus,
        }
    }

    closeErrorBox = () => {
        this.setState({
            showAlertBoxReact: false
        })
        this.props.closeBox();
    }

    render() {
        let alertBoxReact = null;
        if (this.state.showAlertBoxReact) {
            alertBoxReact = <div className="alertify" id="alertify">
                <div className="dialog" style={{background: '#fff', width: '27%'}}>
                    <div>
                        <p className="msg">{this.props.message}</p>
                        <nav>
                            <button className="OkBtn" tabIndex={1} onClick={this.closeErrorBox}>{this.myIntl.formatMessage({ id: 'alertBoxText.Ok' })}</button>
                        </nav>
                    </div>
                </div>
            </div>

        }
        return (
            <>
                {alertBoxReact}
            </>
        )
    }
}
export default injectIntl(QTYAlert);