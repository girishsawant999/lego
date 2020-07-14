import React, { Component } from 'react';
import $ from 'jquery';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import { Button, Label, FormGroup, CustomInput } from 'reactstrap';
import { Link } from 'react-router-dom';
import leftArrow1 from '../../assets/images/LEGO+Account.svg';
import facebookwhite from '../../assets/images/facebook_logo_white.svg';
import signman from '../../assets/images/signman.png';
import google from '../../assets/images/google.svg';
import apple from '../../assets/images/apple.svg';
import eyeopen from '../../assets/images/eyeopen.svg';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class SignUp extends Component {
    constructor(props) {
        super(props);
        
    }
componentDidMount(){
   
        // document.getElementById("header").style.display = "none";   
        // document.getElementById("footer").style.display = "none";        
        // document.body.style.paddingTop = "0px";
    
 
}
    render() {
        const store_locale=this.props.globals.store_locale
        return (
            <div>
                <div className="SignUp">
                
    <div id="login">
        <div className="container">
            <div id="login-row" className="row justify-content-center align-items-center">
                <div id="login-column">
                    <div id="login-box" className="col-md-12">
                    <h3 className="text-center text-info">
                            <span><img src={leftArrow1} className="account-icon" alt="account" /></span>
                            </h3> 
                            <div className="experience--login">
                                <div className="login-minifig">
                                <span><img src={signman} className="signman-icon" alt="account" /></span>
                                    {/* <div className="circle-icon"> Icon </div> */}
                                </div>
                            </div>

                    <AvForm>                      
                        <AvField  name="Username" label="Username" required />
                        <AvField  name="Password" label="Password" required />                        
                        <AvGroup check>
                            <AvInput type="checkbox" name="checkbox" />
                            <Label className="custCheck" check for="checkbox"> Remember me</Label>
                        </AvGroup>  
                        <p className="subtext">Remember to log out afterwards if you’re using a shared computer, for example in a library or school.</p>
                       
                        <FormGroup>
                            <div className="forgot-user2 forgot-user1">
                                <button type="submit" id="loginBtn" className="forgot-user forgot-user1">Log in</button>
                            </div>
                        </FormGroup>
                        <div className="help-section">
                            <div className="forgot-user2 forgot-users">
                                <button type="button" className="forgot-user forgot-users">
                                    Forgot username?
                                </button>
                            </div>

                            <span className="help-section--breaker"></span><div className="forgot-user2 forgot-users"><button type="button" id="forgot-password" className="forgot-user forgot-users">Forgot password?</button></div></div>
                            <h2 className="or-first"><span>Or</span></h2>
                            
                            <div className="omb_login">    	
                                <div className="row omb_row-sm-offset-3 omb_socialButtons">
                                    <div className="col-xs-4 col-8">
                                        <a href="#" className="btn btn-block omb_btn-facebook">
                                            <i className="fa  visible-xs"><span><img src={facebookwhite} className="facebook-white" alt="account" /></span></i>
                                            <span className="hidden-xs">Continue with Facebook</span>
                                        </a>
                                    </div>
                                    <div className="col-xs-4 col-2">
                                        <a href="#" className="btn btn-block omb_btn-twitter">
                                            <i className="fa"><span><img src={google} className="google-icon" alt="google" /></span></i>			        
                                        </a>
                                    </div>	
                                    <div className="col-xs-4 col-2">
                                        <a href="#" className="btn btn-block omb_btn-google">
                                            <i className="fa"><span><img src={apple} className="google-icon" alt="apple" /></span></i>
                                            
                                        </a>
                                    </div>	
                                </div>
                            </div>
                            <div className="Section__Section--1YR06hT">
                                Don’t have a LEGO® Account?
                                <div className="forgot-user2 Button__link--1ZhhExr">
                                    <button type="button" id="need-account" className="forgot-user Button__link--1ZhhExr">Create account</button>
                                </div>
                            </div>

                    </AvForm>
                    </div>
                </div>
            </div>
        </div>
    </div>


                 <p className="register-strip">   <Link to={`/${store_locale}/login`}> already hav account</Link></p> 
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
 
 export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
