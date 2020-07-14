import React, { Component } from 'react';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import { Button, Row, Col, Label, FormGroup, CustomInput } from 'reactstrap';
import leftArrow1 from '../../assets/images/LEGO+Account.svg';
import facebookwhite from '../../assets/images/facebook_logo_white.svg';
import signman from '../../assets/images/signman.png';
import google from '../../assets/images/google.svg';
import apple from '../../assets/images/apple.svg';
import eyeopen from '../../assets/images/eyeopen.svg';
import adult from '../../assets/images/adult-register-geek.png';
import backicon from '../../assets/images/leftArrow.svg';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from '../../../node_modules/react-intl'

const messages = defineMessages({
	emailaddr: {
		id:"forgetUserRecover.YourEmailAddress" ,
		defaultMessage:"Your email address"
	}
  });
class ForgotUser extends Component {
    constructor(props) {
        super(props);
        
    }
    componentDidMount(){
       
            document.getElementById("header").style.display = "none";   
            document.getElementById("footer").style.display = "none";        
            document.body.style.paddingTop = "0px";
            document.body.style.paddingBottom = "0px";
          
        
    }


    render() {
		const {formatMessage} = this.props.intl;

        const store_locale=this.props.globals.store_locale
        return (
            <div>
                <div className="ForgotUser">
                <div id="login">
        <div className="container">
            <div id="login-row" className="row justify-content-center align-items-center">
                <div id="login-column">
                    <div id="login-box" className="col-md-12">
                    <Link to={`/${store_locale}/login`}>
                    <button className="backButton" >
                    <span><img src={backicon} className="back-icon" alt="account" /></span>
                    </button>
                    </Link>
                    <h3 className="text-center text-info">
                    <Link to={`/${store_locale}/`}><span><img src={leftArrow1} className="account-icon" alt="account" /></span></Link>
                            </h3> 
                            <h1 className="main-title-sign"><FormattedMessage id="forgetUserRecover.username" defaultMessage="Recover your Username" /></h1>
                            <p className="sub-head-line"><FormattedMessage id="forgetUserRecover.registeredEmail" defaultMessage="Enter the email address registered to your account. An email will be sent to that address with username(s) registered to that account." /></p>
                    <AvForm>                      
                        <AvField id="emailaddr" placeholder={formatMessage(messages.emailaddr)} name="Emailaddress" label="Email address" required />
  
                        
                       
                        <FormGroup>
                            <div className="forgot-user2 forgot-user1">
                                <button type="submit" id="loginBtn" className="forgot-user forgot-user1"><FormattedMessage id="contactUs.submitBtn" defaultMessage="Submit" /></button>
                            </div>
                        </FormGroup>
                        <div className="help-section">
                            
                            <div className="Section__Section--1YR06hT">
                                <div className="forgot-user2 Button__link--1ZhhExr">
                                <Link to={`/${store_locale}/login`}><button type="button" className="back-link"><FormattedMessage id="forgetBackAccount.forget" defaultMessage="Back to Login" /></button></Link>
                                </div>
                            </div>
                        </div>
                    </AvForm>
                    </div>
                </div>
            </div>
        </div>
    </div>  
                </div>
                
                <div className="legals">
                    <button className="btn-legal" aria-haspopup="true" id="policyBtnId"><FormattedMessage id="footer.Pricacy" defaultMessage="Privacy Policy" /></button>
                    <button className="btn-legal" aria-haspopup="true" id="cookiesBtnId"><FormattedMessage id="footer.Cookies" defaultMessage="Cookies" /></button>
                    </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
       globals:state.global
    };
 }
 
 const mapDispatchToProps = dispatch => {
    return {
    }
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(ForgotUser)))
