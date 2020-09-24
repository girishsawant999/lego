import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

class addBagAlert extends Component {
    constructor(props) {
        super(props)
        this.myIntl = props.intl
        this.state = {
            showAlertBoxReact: this.props.alertBoxStatus,
        }
    }

    componentDidMount(){
        const timer = setTimeout(() => {
            this.closeErrorBox();
        }, 2500);
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
            alertBoxReact = <div className="alertify addToBagPupUp" id="alertify">
                <div id="dialogAlertbox">
                    <div>
                        <p className="msg">{this.props.message}</p>
                        {/* <nav>
                            <button className="ok" tabIndex={1} onClick={this.closeErrorBox}>{this.myIntl.formatMessage({ id: 'alertBoxText.Ok' })}</button>
                        </nav> */}
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
export default injectIntl(addBagAlert);