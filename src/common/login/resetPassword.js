import React, { Component } from "react"
import {
	AvForm,
	AvField,
	AvGroup,
	AvInput,
	AvFeedback,
	AvRadioGroup,
	AvRadio,
	AvCheckboxGroup,
	AvCheckbox,
} from "availity-reactstrap-validation"
import { Button, Row, Col, Label, FormGroup, CustomInput } from "reactstrap"
import leftArrow1 from "../../assets/images/LEGO+Account.svg"
import facebookwhite from "../../assets/images/facebook_logo_white.svg"
import signman from "../../assets/images/signman.png"
import google from "../../assets/images/google.svg"
import apple from "../../assets/images/apple.svg"
import eyeopen from "../../assets/images/eyeopen.svg"
import adult from "../../assets/images/adult-register-geek.png"
import backicon from "../../assets/images/leftArrow.svg"
import { Link } from "react-router-dom"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import * as actions from ".././../redux/actions/index"
import Spinner2 from "../../components/Spinner/Spinner2"
import { css } from "glamor"
import { FormattedMessage, defineMessages, injectIntl } from '../../../node_modules/react-intl'

const messages = defineMessages({
	password: {
		id:"resetPassword.NewPassword" ,
		defaultMessage:"New Password"
	},
	password1: {
		id:"resetPassword.ConfirmPassword" ,
		defaultMessage:"Confirm Password"
	}
  });
var message = ""
var status = true
class ResetPassword extends Component {
	constructor(props) {
		super(props)
		this.state = {
			passwordErr: "",
			password1Err: "",
			classEye:"eye-icon",
			classEye1:"eye-icon",
			disableBtn: true
		}
		this.payload = {
			customerId: "",
			password: "",
			passwordConfirmation: "",
			resetPasswordToken: "",
			store_id: this.props.globals.currentStore,
		}
	}
	getUrlVars = () => {
		var vars = {}
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
			vars[key] = value
		})
		return vars
	}
	componentDidMount() {
		// document.getElementById("btnLoader").style.visibility = "hidden"
		// document.getElementById("header").style.display = "none"
		// document.getElementById("footer").style.display = "none"
		// document.body.style.paddingTop = "0px"

		if (this.getUrlVars()["id"] && this.getUrlVars()["token"]) {
			this.payload.customerId = this.getUrlVars()["id"]
			this.payload.resetPasswordToken = this.getUrlVars()["token"]
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.resetPasswordData && nextProps.resetPasswordData.message) {
			if (nextProps.resetPasswordData.status) {
				status= true
				message = nextProps.resetPasswordData.message
				nextProps.resetPasswordData.message = ''
				setTimeout(() =>this.props.history.push(`/${this.props.globals.store_locale}/login`), 3000)
			} else {
				status= false
				message = nextProps.resetPasswordData.message
				nextProps.resetPasswordData.message = ''
			}
			//document.getElementById("resetBtn").disabled = false
			// document.getElementById("btnLoader").style.visibility = "hidden"
		}
	}
	validatePassword = () => {
		var password = document.getElementById("password").value
		if (password.length < 8 || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password) === false) {
			this.setState({ 
				passwordErr: "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter and a number.",
				disableBtn: true
			})
		} else {
			this.setState({ passwordErr: "", disableBtn: false })
		}
	}
	checkPasswords = () => {
		var password = document.getElementById("password").value
		var password1 = document.getElementById("password1").value
		if (password === password1) {
			this.setState({ password1Err: "", disableBtn: false })
			this.payload.password = password
			this.payload.passwordConfirmation = password1
		} else {
			this.validatePassword();
			this.setState({ password1Err: "Passwords does not match!", disableBtn: true })
		}
	}
	onResetBtn = () => {
		if (Object.values(this.payload).find((val) => val === "") === undefined) {
			// document.getElementById("btnLoader").style.visibility = "visible"
			document.getElementById("resetBtn").disabled = true
			this.props.onResetPasword(this.payload)
		}
	}
	tooglePasswordVisibility = (elementId,eyeChangeId) => {
		const inputType = document.getElementById(elementId).type
		if (inputType === "password") {
			document.getElementById(elementId).type = "text"
			if(eyeChangeId=="eyeChange")
			{
				this.setState({classEye:"eye-icon-open"});
			}else if(eyeChangeId=="eyeChange1")
			{
				this.setState({classEye1:"eye-icon-open"});
			}
		} else {
			document.getElementById(elementId).type = "password"
			if(eyeChangeId=="eyeChange")
			{
				this.setState({classEye:"eye-icon"});

			}else if(eyeChangeId=="eyeChange1")
			{
				this.setState({classEye1:"eye-icon"});

			}
		}
	}
	render() {
		const {formatMessage} = this.props.intl;

		const store_locale = this.props.globals.store_locale
		if (this.props.resetPasswordLoader) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
		}
		return (
			<div>
				<div className="ResetPassword">
					<div id="login">
						<div className="container">
							<div id="login-row" className="row justify-content-center align-items-center">
								<div id="login-column">
									<div id="login-box" className="col-md-12">
										{/* <Link to={`/${store_locale}/login`}>
                    <button className="backButton" >
                    <span><img src={backicon} className="back-icon" alt="account" /></span>
                    </button>
                    </Link> */}
										<h3 className="text-center text-info">
											<Link to={`/${store_locale}/`}>
												<span>
													<img src={leftArrow1} className="account-icon" alt="account" />
												</span>
											</Link>
										</h3>
										<h1 className="main-title-sign"><FormattedMessage id="resetPassword.ResetPassword" defaultMessage="Reset Password" /></h1>
										{/* <p className="sub-head-line">Recover your Password</p> */}
										<div className="form-group">
											<label for="Password" className="">
												<FormattedMessage id="resetPassword.NewPassword" defaultMessage="New Password" />
											</label>
											<input
											 	placeholder={formatMessage(messages.password)} 
												name="Password"
												id="password"
												type="password"
												className="is-untouched is-pristine av-invalid form-control"
												label="Password"
												onChange={() => this.validatePassword}
											/>
											<div id="eyeChange" className={this.state.classEye} onClick={() => this.tooglePasswordVisibility("password","eyeChange")}></div>
											{this.state.passwordErr && <span className="text-danger">{this.state.passwordErr}</span>}
										</div>

										<div className="form-group">
											<label for="Password" className="">
												<FormattedMessage id="resetPassword.ConfirmPassword" defaultMessage="Confirm Password" />
											</label>
											<input
											 	placeholder={formatMessage(messages.password1)} 
												name="Password"
												id="password1"
												type="password"
												className="is-untouched is-pristine av-invalid form-control"
												onInput={this.checkPasswords}
											/>
											<div id="eyeChange1" className={this.state.classEye1} onClick={() => this.tooglePasswordVisibility("password1","eyeChange1")}></div>
											{this.state.password1Err && <span className="text-danger">{this.state.password1Err}</span>}
										</div>
										{message && <div className={status ? "successMessage" : "ErrorMessage"}>{message}</div>}

										{/* <AvField  placeholder="Your username" name="EmaiUsernameladdress" label="Username" required />
  
                        
                       
                        <FormGroup>
                            <div className="forgot-user2 forgot-user1">
                                <button type="submit" id="loginBtn" className="forgot-user forgot-user1">Submit</button>
                            </div>
                        </FormGroup> */}
										<div className="help-section">
											<div className="Section__Section--1YR06hT">
												<div className="forgot-user2 Button__link--1ZhhExr">
													<button
														disabled= {this.state.disableBtn}
														type="submit"
														id="resetBtn"
														className="forgot-user forgot-user1"
														onClick={this.onResetBtn}>
														<FormattedMessage id="resetPassword.Submit" defaultMessage="Submit" />
														{/* <i id="btnLoader" className="fa fa-spinner fa-spin ml-2"></i> */}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="legals">
					<button className="btn-legal" aria-haspopup="true" id="policyBtnId">
						<FormattedMessage id="footer.Pricacy" defaultMessage="Privacy Policy" />
					</button>
					<button className="btn-legal" aria-haspopup="true" id="cookiesBtnId">
						<FormattedMessage id="footer.Cookies" defaultMessage="Cookies" />
					</button>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		resetPasswordData: state.login.resetPasswordDetails,
		resetPasswordLoader: state.login.resetPasswordLoader,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onResetPasword: (payload) => dispatch(actions.resetPassword(payload)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(ResetPassword)))