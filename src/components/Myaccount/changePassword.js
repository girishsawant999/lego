import React, { Component } from "react"
import { FormattedMessage, injectIntl } from "../../../node_modules/react-intl"
import { Row, Col, Label } from "reactstrap"
import { Link } from "react-router-dom"
import leftArrow1 from "../../assets/images/LEGO+Account.svg"
import adult from "../../assets/images/adult-register-geek.png"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import PhoneNumber from "../../components/StaticPages/ContactUs/IntlTelePhone"
import * as actions from ".././../redux/actions/index"
import { Redirect } from "react-router-dom"

import Spinner2 from "../../components/Spinner/Spinner2"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { css } from "glamor"

class ChangePassword extends Component {
	constructor(props) {
		super(props)
		this.state = {
			passwordErr: "",
			password1Err: "",
			password2Err: "",
			isValid1: false,
			isValid2: false,
			isValid3: false,
			password1: "",
			password2: "",
			password3: "",
			classEye:"eye-icon",
			classEye1:"eye-icon",
			classEye2:"eye-icon"
		}
	}

	

	keyupChangeHandler = (event) => {
		const temp_state = {}
		temp_state[event.target.name] = event.target.value
		this.setState(temp_state)
	}
	validatePassword = () => {
		this.setState({ isValid1: true })
		var password = this.state.password1
		if (password.length >= 8 && password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)) {
			this.setState({ passwordErr: "" })
		} else {
			this.setState({
				passwordErr:this.props.globals.store_locale === 'en'? 
					"Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter and a number.":
					"يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وأن تحتوي على حرف كبير وحرف صغير ورقم.",
				isValid1: false,
			})
		}
	}
	validatePassword1 = () => {
		this.setState({ isValid2: true })
		var password = this.state.password2
		if (password.length >= 8 && password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)) {
			this.setState({ password1Err: "" })
		} else {
			this.setState({
				password1Err:this.props.globals.store_locale === 'en'? 
				"Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter and a number.":
				"يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وأن تحتوي على حرف كبير وحرف صغير ورقم.",
				isValid2: false,
			})
		}
	}
	validatePassword2 = () => {
		this.setState({ isValid3: true })
		var newpassword = ""
		newpassword = this.state.password2
		var password = this.state.password3
		if (password.length >= 8 && password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/) && password === newpassword) {
			this.setState({ password2Err: "" })
		} else {
			this.setState({
				password2Err:
				this.props.globals.store_locale === 'en'? 
					"Passwords does not match!":
					"كلمات المرور غير متطابقتين!",
				isValid3: false,
			})
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
			}else if(eyeChangeId=="eyeChange2")
			{
				this.setState({classEye2:"eye-icon-open"});
			}
			
		} else {
			document.getElementById(elementId).type = "password"
			if(eyeChangeId=="eyeChange")
			{
				this.setState({classEye:"eye-icon"});

			}else if(eyeChangeId=="eyeChange1")
			{
				this.setState({classEye1:"eye-icon"});

			}else if(eyeChangeId=="eyeChange2")
			{
				this.setState({classEye2:"eye-icon"});

			}
		}
	}
	onSave = () => {
		this.validatePassword()
		this.validatePassword1()
		this.validatePassword2()
		if (this.state.isValid1 && this.state.isValid2 && this.state.isValid3) {
			const payload = {
				customerId: this.props.login.customer_details.customer_id,
				newPassword: this.state.password2,
				currentPassword: this.state.password1,
			}

			if(this.state.password2 == this.state.password3){
				this.props.onChangePassword(payload)
			}
		}
	}
	render() {
		const { changePasswordLoader } = this.props.account
		if (changePasswordLoader) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
		}
		return (
			<div>
				<div className="ChangePassword bg-white">
					<div id="login">
						<div className="">
							<div id="login-row" className="row justify-content-center align-items-center">
								<div id="login-column">
									<div id="login-box" className="col-md-12">
										<h1 className="main-title-sign"><FormattedMessage id="myAccountInfo.ChangePassword" defaultMessage="Change Password" /></h1>
										<div className="form-group">
											<label for="phone"><FormattedMessage id="myAccountInfo.OldPassword" defaultMessage="Old Password" /> </label>
											<input
												type="password"
												className="form-control"
												placeholder=""
												name="password1"
												id="passwordChange"
												label="Password"
												onBlur={this.validatePassword}
												onInput={this.keyupChangeHandler}
											/>
											<div id="eyeChange" className={this.state.classEye} onClick={() => this.tooglePasswordVisibility("passwordChange","eyeChange")}></div>
											{this.state.passwordErr && <span className="error">{this.state.passwordErr}</span>}
										</div>
										<div className="form-group">
											<label for="phone"><FormattedMessage id="myAccountInfo.NewPassword" defaultMessage="New Password" /></label>
											<input
												type="password"
												className="form-control"
												placeholder=""
												name="password2"
												id="passwordChange1"
												label="New Password"
												onInput={this.keyupChangeHandler}
												onBlur={this.validatePassword1}
											/>
											<div id="eyeChange1" className={this.state.classEye1} onClick={() => this.tooglePasswordVisibility("passwordChange1","eyeChange1")}></div>
											{this.state.password1Err && <span className="error">{this.state.password1Err}</span>}
										</div>
										<div className="form-group">
											<label for="phone"><FormattedMessage id="myAccountInfo.ConfirmPassword" defaultMessage="Confirm Password" /></label>
											<input
												type="password"
												className="form-control"
												placeholder=""
												name="password3"
												id="passwordChange2"
												label="Confirm Password"
												onInput={this.keyupChangeHandler}
												onBlur={this.validatePassword2}
											/>
											<div id="eyeChange2" className={this.state.classEye2} onClick={() => this.tooglePasswordVisibility("passwordChange2","eyeChange2")}></div>
											{this.state.password2Err && <span className="error">{this.state.password2Err}</span>}
										</div>
										<div className="ButtonDivPass">
											<button className="cancelbtn" onClick={this.props.onClose}>
											<FormattedMessage id="myAccountInfo.Cancel" defaultMessage="Cancel" />
											</button>
											<button className="okbtn" onClick={this.onSave}>
											<FormattedMessage id="myAccountInfo.Save" defaultMessage="Save" />
											</button>
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

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		account: state.account,
		login: state.login,
	}
}
const mapDispatchToProps = (dispatch) => {
	return { onChangePassword: (payload) => dispatch(actions.changePassword(payload)) }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChangePassword))
