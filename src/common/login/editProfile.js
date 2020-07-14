import React, { Component } from 'react';
import $ from 'jquery';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import { Button, Row, Col, Label, FormGroup, CustomInput } from 'reactstrap';
import { Link } from 'react-router-dom';
import leftArrow1 from '../../assets/images/LEGO+Account.svg';
import facebookwhite from '../../assets/images/facebook_logo_white.svg';
import signman from '../../assets/images/signman.png';
import google from '../../assets/images/google.svg';
import apple from '../../assets/images/apple.svg';
import eyeopen from '../../assets/images/eyeopen.svg';
import adult from '../../assets/images/adult-register-geek.png';
import backicon from '../../assets/images/leftArrow.svg';
import close from '../../assets/images/closemodel.svg';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';


class EditProfile extends Component {
    constructor(props) {
        super(props);
        
    }
// componentDidMount(){
   
//         document.getElementById("header").style.display = "none";   
//         document.getElementById("footer").style.display = "none";        
//         document.body.style.paddingTop = "0px";
//         document.body.style.paddingBottom = "0px";
//         document.body.style.backgroundColor = "#f2f5f7";
    
 
// }
    render() {
        const store_locale=this.props.globals.store_locale
        return (
            <div>
                <div className="editProfile">
                    <div id="login">
                        <div className="container">
                            <div id="login-row" className="row justify-content-center align-items-center">
                                <div id="login-column">
                                    <div id="login-box" className="col-md-12">                                    
                                        <h3 className="text-center text-info"><Link to={'/'}> <span><img src={leftArrow1} className="account-icon" alt="account" /></span></Link><img src={close} className="back-icon" alt="account" />
                                        </h3> 
                                        <h1 className="main-title-sign">Edit Profile</h1>                                        
                                        <div className="avtarpart">
                                            <h2 className="editprofile subheader">Avatar</h2>
                                            <div className="avatar-picker">
                                                <div className="avatar-picker-container">
                                                    <button className="arrow arrow-left" title="Previous avatar"></button>
                                                    <div className="avtarGrid">
                                                        <div className="Avatar-pd">
                                                            <div className="avtarCircle">
                                                                <div className="avtarImg"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="arrow arrow-right" aria-label="Next avatar" title="Next avatar"></button>
                                                </div>
                                            </div>
                                            
                                            <div className="lastThreeTab">
                                            <h2 className="editprofile subheader">Nickname</h2>
                                               <div className="optionBtn">
                                                    <div className="optionBtn-grid">
                                                        <div className="optionBtn-py">
                                                            <span className="optionSpan">LastGraciousDandelion</span>
                                                            <button className="optionbtnstyle"></button>
                                                        </div>
                                                    </div>
                                                </div><br />
                                                <div>
                                                    <div className="afterselectbtn">
                                                        <button className="btnToIcon twoIconLeft twoIconLeftBlur"></button>
                                                        <div className="centerLine centerLinePy"><span className="centerLinePySpan" title="LastGraciousDandelion">LastGraciousDandelion</span></div>
                                                        <button className="btnToIcon btnRightIcon" aria-label="Hear next username" title="Hear next username"></button>
                                                    </div>
                                                </div>
                                                <ul className="editprofile navigation">
                                                    <li>
                                                        <button className="btttonSize AnchorButton__icon--1eJ1WHx">My information</button>
                                                    </li>
                                                    <li>
                                                        <button className="btttonSize AnchorButton__icon--1eJ1WHx1">Security</button>
                                                    </li>
                                                    <li>
                                                        <button className="btttonSize AnchorButton__icon--1eJ1WHx2">Log out</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="Section__Section--1YR06hT">
                                            <div className="btnSavegrid">
                                                <button className="btnSave" disabled="">Save</button>
                                            </div>
                                        </div>             
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
 
 export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);

