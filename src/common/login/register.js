import React, { Suspense, Component } from "react"
import { injectIntl } from "../../../node_modules/react-intl"
import { Row, Col, Label } from "reactstrap"
import { Link } from "react-router-dom"
import leftArrow1 from "../../assets/images/LEGO+Account.svg"
import adult from "../../assets/images/adult-register-geek.png"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
// import PhoneNumber from "../login/phoneComponent"
import * as actions from ".././../redux/actions/index"
import { Redirect } from "react-router-dom"
import MyaccountInfo from "../../components/Myaccount/myAccountInfo"
import Spinner2 from "../../components/Spinner/Spinner2"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { css } from "glamor"
import { FormattedMessage, defineMessages } from '../../../node_modules/react-intl';

const PhoneNumber = React.lazy(() => import('../login/phoneComponent'))
var message = ""
var moment = require("moment")
const messages = defineMessages({
	firstname: {
		id:"createAccountFLabel.Register" ,
		defaultMessage:"First Name"
	} ,
	lastname : {
		id:"createAccountLLabel.Register" ,
		defaultMessage:"Last Name" 
	},
	email : {
		id:"createAccountEmail.Register",
		defaultMessage:"Email address" 
	}
  });
class AccountCreate extends Component {
	constructor(props) {
		super(props)
		this.state = {
			firstNameErr: "",
			lastNameErr: "",
			phoneErr: "",
			emailErr: "",
			dateErr: "",
			passwordErr: "",
			password1Err: "",
			tncErr: "",

			firstname: "",
			lastname: "",
			carrier_code: "",
			contact_number: "",
			days: "",
			months: "",
			years: "",
			email: "",
			password: "",
			confirmpassword: "",
			tnc: false,
			isdefaultPhone: false,
			classEye:"eye-icon",
			classEye1:"eye-icon",
		}
		this.store_locale = this.props.globals.store_locale

	}

	componentWillReceiveProps(nextProps) {
		message = ""
		if (window.location.search && window.location.search.includes('checkout')) {
			this.props.history.push(`/${this.props.globals.store_locale}/cart`)
		} else if (nextProps.registerData) {
			if (nextProps.registerData.status) {
				this.props.history.push(`/${this.props.globals.store_locale}/profile/`)
				// this.props.history.push({
				// 	pathname: `/${this.props.globals.store_locale}/myaccount-info/`,
				// 	state: { registerData: nextProps.registerData }
				//   })
				/*	this.toastId = toast(nextProps.registerData.message, {
					className: css({
						color: "green !important",
						fontSize: "13.5px",
					}),
					onClose: this.toastClosed,
				})	*/
			} else {
				message = nextProps.registerData.message
			}
			//nextProps.registerData.message = ""
			if (document.getElementById("registerButton")) {
				document.getElementById("registerButton").disabled = false
			}
		}
	}

	keyupChangeHandler = (event) => {
		if (["days", "years", "months"].includes(event.target.name)) {
			if (event.target.value) {
				event.target.value = event.target.value.replace(/[^\d]/, "")
				if (event.target.id === "dayId") {
					var month = document.getElementById("monthId").value
					var years = document.getElementById("yearId").value
					if (month === "02") {
						if ((years % 4 === 0 && years % 100 !== 0) || years % 400 === 0) {
							if (event.target.value > 29) {
								event.target.value = event.target.value.slice(0, -1)
							}
						} else if (event.target.value > 28) {
							event.target.value = event.target.value.slice(0, -1)
						}
					} else if (["04", "06", "09", "11"].includes(month) && event.target.value > 30) {
						event.target.value = event.target.value.slice(0, -1)
					} else if (event.target.value > 31) {
						event.target.value = event.target.value.slice(0, -1)
					}
				} else if (event.target.id === "monthId" && event.target.value > 12) {
					event.target.value = event.target.value.slice(0, -1)
				}
			}
		}
		const temp_state = {}
		temp_state[event.target.name] = event.target.value
		this.setState(temp_state)
	}
	validateFirstName = (e) => {
		var firstname = e ? e.target.value : this.state.firstname
		if (firstname.match(/^[A-Za-z]+$/)) {
			this.setState({ firstNameErr: "" })
			return true
		} else {
			firstname.length > 0
				? this.setState({ firstNameErr: this.store_locale === 'en' ? "Firstname is invalid!" : "الاسم الأول غير صالح!" })
				: this.setState({ firstNameErr: this.store_locale === 'en' ? "Firstname should not be empty!" : "يجب ألا يكون الاسم الأول فارغًا!" })
			return false
		}
	}
	validateLastName = (e) => {
		var lastname = e ? e.target.value : this.state.lastname
		if (lastname.match(/^[A-Za-z]+$/)) {
			this.setState({ lastNameErr: "" })
			return true
		} else {
			lastname.length > 0
				? this.setState({ lastNameErr: this.store_locale === 'en' ? "Lastname is invalid!" : "اسم العائلة غير صالح!"})
				: this.setState({ lastNameErr: this.store_locale === 'en' ?  "Lastname should not be empty!" :"لا يجب أن يكون اسم العائلة فارغًا!" })
			return false
		}
	}
	validateEmail = (e) => {
		var email = e ? e.target.value : this.state.email
		if (email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)) {
			this.setState({ emailErr: "" })
			return true
		} else {
			email.length > 0
				? this.setState({ emailErr: this.store_locale === 'en' ?  "Email is invalid!": "البريد الإلكتروني غير صالح!" })
				: this.setState({ emailErr: this.store_locale === 'en' ? "Email should not be empty!" : "يجب ألا يكون البريد الإلكتروني فارغًا!"})
			return false
		}
	}
	contactNumber = (status, value, countryData, number, id) => {
		if (status) {
			this.setState({ contact_number: value, carrier_code: countryData.dialCode, isdefaultPhone: true })
			this.setState({ phoneErr: "" })
			return true
		} else {
			value && value.length > 0
				? this.setState({ phoneErr: this.store_locale === 'en' ? "Phone number is invalid!" : "رقم الهاتف غير صالح!" })
				: this.setState({ phoneErr: this.store_locale === 'en' ? "Phone number should not be empty!" :"يجب ألا يكون رقم الهاتف فارغًا!"})
			return false
		}
	}

	phoneValid = () => {
		if (this.state.contact_number && this.state.carrier_code) {
			this.setState({ phoneErr: "" })
			return true
		} else {
			this.setState({ phoneErr: this.store_locale === 'en' ? "Phone number should not be empty!" :"يجب ألا يكون رقم الهاتف فارغًا!" })
			return false
		}
	}

	dateChecker = () => {
		var days = this.state.days
		var months = this.state.months
		var years = this.state.years
		if (days && days < 10 && days.length < 2) {
			days = "0" + days
			this.setState({ days: days })
		}
		if (months && days < 10 && months.length < 2) {
			months = "0" + months
			this.setState({ months: months })
		}
		if (years && years < 1900) {
			this.setState({ dateErr: this.store_locale === 'en' ?  "Hi we can see that you are not an adult" : "مرحبا يمكننا أن نرى أنك لست بالغا" })
			return false
		}
		if (months && days && years && moment(months + days + years, "MMDDYYYY").isValid()) {
			this.setState({ dateErr: "" })
			if (this.underAgeValidate(`${years}/${months}/${days}`)) {
				this.setState({ dateErr: this.store_locale === 'en' ?  "Hi we can see that you are not an adult" : "مرحبا يمكننا أن نرى أنك لست بالغا"  })
				return false
			} else {
				return true
			}
		} else {
			this.setState({ dateErr: this.store_locale === 'en' ? "Birth date is invalid!" : "تاريخ الميلاد غير صالح!"})
			return false
		}
	}
	underAgeValidate = (dob) => {
		const birthday = +new Date(dob)
		const myAge = ~~((Date.now() - birthday) / 31557600000)
		if (myAge < 18) {
			return true
		} else {
			return false
		}
	}
	validatePassword = (e) => {
		var password = e ? e.target.value : this.state.password
		if (password.length < 8 || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password) === false) {
			this.setState({
				passwordErr:
				this.store_locale === 'en' ?
					"Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter and a number.":
					"يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وأن تحتوي على حرف كبير وحرف صغير ورقم.",
			})
			return false
		} else {
			this.setState({ passwordErr: "" })
			return true
		}
	}
	checkPasswords = (e) => {
		var password = this.state.password
		var password1 = e ? e.target.value : this.state.confirmpassword
		if (password === password1) {
			this.setState({ password1Err: "" })
			return true
		} else {
			this.validatePassword()
			this.setState({ 
				 password1Err:this.store_locale === 'en' ? "Passwords does not match!":"كلمات المرور غير متطابقتين!" })
			return false
		}
	}
	checkTnC = () => {
		const tnc = document.getElementById("tnc").checked
		this.setState({ tnc: tnc })
		if (!tnc) {
			this.setState({ tncErr:this.store_locale === 'en' ? "Please accept terms and conditions!":"يرجى قبول الشروط والأحكام!" })
			return false
		} else {
			this.setState({ tncErr: "" })
			return true
		}
	}
	formInvalid = () => {
		return [
			this.validateFirstName(),
			this.validateLastName(),
			this.phoneValid(),
			this.validateEmail(),
			this.dateChecker(),
			this.validatePassword(),
			this.checkPasswords(),
			this.checkTnC(),
		].includes(false)
	}
	registerUser = () => {
		const guestquote = this.props.guestUser ? this.props.guestUser.new_quote_id ?
          this.props.guestUser.new_quote_id : '' : '';
		const payload = {
			firstname: this.state.firstname,
			lastname: this.state.lastname,
			carrier_code: this.state.carrier_code,
			contact_number: this.state.contact_number,
			dob: `${this.state.days}-${this.state.months}-${this.state.years}`,
			email: this.state.email,
			password: this.state.password,
			confirmpassword: this.state.confirmpassword,
			store_id: this.props.globals.currentStore,
			quest_quote: guestquote,
			newsletterSubscription: "1",
		}
		if (!this.formInvalid()) {
			this.props.onRegisterUser(payload)
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
		const store_locale = this.props.globals.store_locale
		const {formatMessage} = this.props.intl;

		let defaultPhoneNumber = {}
		if (this.state.isdefaultPhone) {
			defaultPhoneNumber = {
				...defaultPhoneNumber,
				carrier_code: this.state.carrier_code,
				contact_number: this.state.contact_number,
			}
		}

		if (this.props.registerLoader) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
		}

		return (
			<div>
				<div className="AccountCreate">
					<div id="login">
						<div className="container">
							<div id="login-row" className="row justify-content-center align-items-center">
								<div id="login-column">
									<div id="login-box" className="col-md-12">
										{/* <Link to={`/ar/login`}>
                    <button className="backButton" >
                        <span><img src={backicon} className="back-icon" alt="account" /></span>
                    </button>
                    </Link> */}
										<h3 className="text-center text-info">
											<Link to={`/${store_locale}/`}>
												{" "}
												<span>
													<img src={leftArrow1} className="account-icon" alt="account" />
												</span>
											</Link>
										</h3>
										<h1 className="main-title-sign"><FormattedMessage id="createAccount.Register" defaultMessage="Create User Account" /></h1>
										<p className="sub-head-line"><FormattedMessage id="createAccountSubHead.Register" defaultMessage="We just need a few pieces of information for your LEGO® Account." /> </p>
										{/* <div className="omb_login">    	
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
                            </div> */}
										{/* <h2 className="or-first"><span>Or use your email</span></h2> */}
										<div className="form-group">
											<label for="Firstname"> <FormattedMessage id="createAccountFLabel.Register" defaultMessage="First Name" /></label>
											<input
												type="text"
												className="form-control"
												name="firstname"
												id="firstname"
												placeholder={formatMessage(messages.firstname)}
												value={this.state.firstname}
												onInput={this.keyupChangeHandler}
												onChange={(e) => this.validateFirstName(e)}
											/>
											{this.state.firstNameErr && <span className="error">{this.state.firstNameErr}</span>}
										</div>
										<div className="form-group">
											<label for="Firstlast"> <FormattedMessage id="createAccountLLabel.Register" defaultMessage="Last Name" /></label>
											<input
												type="text"
												className="form-control"
												name="lastname"
												id="lastname"
												placeholder={formatMessage(messages.lastname)}
												value={this.state.lastname}
												onInput={this.keyupChangeHandler}
												onChange={(e) => this.validateLastName(e)}
											/>
											{this.state.lastNameErr && <span className="error">{this.state.lastNameErr}</span>}
										</div>

										<div className="form-group">
											<label for="phone"> <FormattedMessage id="createAccountMobile.Register" defaultMessage="Mobile Number" /></label>
											<Suspense fallback={<div></div>}> 
											<PhoneNumber
												changed={this.contactNumber}
												isdefaultPhone={this.state.isdefaultPhone}
												defaultPhone={{ ...defaultPhoneNumber }}
											/>
											</Suspense>
											{/* <PhoneNumber changed={this.contactNumber} /> */}
											{this.state.phoneErr && <span className="error">{this.state.phoneErr}</span>}
										</div>
										<div className="form-group">
											<label for="name"> <FormattedMessage id="createAccountEmail.Register" defaultMessage="Email address" /></label>
											<input
												type="text"
												className="form-control"
												name="email"
												id="email"
												placeholder={formatMessage(messages.email)}
												value={this.state.email}
												onInput={this.keyupChangeHandler}
												onChange={(e) => this.validateEmail(e)}
											/>
											{this.state.emailErr && <span className="error">{this.state.emailErr}</span>}
										</div>
										<div className="form-group">
											<Row>
												<Col xs="12">
													<span className="birth-title"><FormattedMessage id="createAccountDOB.Register" defaultMessage="Date of birth" /></span>
												</Col>
												<Col xs="4" sm="4">
													<label for="name"> <FormattedMessage id="createAccountMonth.Register" defaultMessage="Month" /></label>
													<input
														type="text"
														id="monthId"
														className="form-control"
														name="months"
														placeholder="MM"
														maxlength="2"
														value={this.state.months}
														onInput={this.keyupChangeHandler}
														onBlur={this.dateChecker}
													/>
												</Col>
												<Col xs="4" sm="4">
													<label for="name"> <FormattedMessage id="createAccountDay.Register" defaultMessage="Day" /></label>
													<input
														type="text"
														id="dayId"
														className="form-control"
														name="days"
														placeholder="DD"
														maxlength="2"
														value={this.state.days}
														onInput={this.keyupChangeHandler}
														onBlur={this.dateChecker}
													/>
												</Col>
												<Col xs="4" sm="4">
													<label for="name"> <FormattedMessage id="createAccountYear.Register" defaultMessage="Year" /></label>
													<input
														type="text"
														id="yearId"
														className="form-control"
														name="years"
														placeholder="YYYY"
														maxlength="4"
														value={this.state.years}
														onInput={this.keyupChangeHandler}
														onBlur={this.dateChecker}
													/>
												</Col>
												<Col xs="12">{this.state.dateErr && <span className="error">{this.state.dateErr}</span>}</Col>
											</Row>
										</div>
										<div className="form-group">
											<label for="phone"> <FormattedMessage id="createAccountPassword.Register" defaultMessage="Password" /></label>
											<input
												type="password"
												className="form-control"
												placeholder="********"
												name="password"
												id="password"
												label="Password"
												value={this.state.password}
												onInput={this.keyupChangeHandler}
												onChange={(e) => this.validatePassword(e)}
											/>
											<div id="eyeChange" className={this.state.classEye} onClick={() => this.tooglePasswordVisibility("password","eyeChange")}></div>
											{this.state.passwordErr && <span className="error">{this.state.passwordErr}</span>}
										</div>
										<div className="form-group">
											<label for="phone"><FormattedMessage id="createAccountCPassword.Register" defaultMessage="Confirm Password" /></label>
											<input
												type="password"
												className="form-control"
												placeholder="********"
												name="confirmpassword"
												id="password1"
												label="Confirm Password"
												value={this.state.confirmpassword}
												onInput={this.keyupChangeHandler}
												onChange={(e) => this.checkPasswords(e)}
											/>
											<div id="eyeChange1" className={this.state.classEye1} onClick={() => this.tooglePasswordVisibility("password1","eyeChange1")}></div>
											{this.state.password1Err && <span className="error">{this.state.password1Err}</span>}
										</div>
										<span className="error">{message}</span>
										<div className="form-group onCheck mb-1">
											<input
												className="custCheck"
												id="tnc"
												type="checkbox"
												name="checkbox"
												checked={this.state.tnc}
												onChange={this.checkTnC}
											/>
											<Label check for="tnc" className="pb-1">
												{" "}
												<FormattedMessage id="createAccountTC.Register" defaultMessage="Accept Terms and Conditions" />
											</Label>
										</div>
										<div className="pb-3 mbten">
											{this.state.tncErr && <span className="error">{this.state.tncErr}</span>}
										</div>
										{this.store_locale === 'en' ?
											<p className="subtext">
											When you agree to the{" "}
											<Link  target="_blank"  to={`/${store_locale}/terms-conditions`} className="privacy-link">
											<FormattedMessage id="createAccountATC.Register" defaultMessage="Terms and Conditions" />
											</Link>{" "}
											you also consent to our use of your personal information to process and operate your LEGO Account.
											To see how to control your personal data, please see our privacy policy.
										</p>
										:
										<p className="subtext">
										عندما توافق على <Link  target="_blank"  to={`/${store_locale}/terms-conditions`} className="privacy-link">
											<FormattedMessage id="createAccountATC.Register" defaultMessage="Terms and Conditions" />
											</Link>{" "} ، فإنك توافق أيضًا على إستخدامنا لمعلوماتك الشخصية لمعالجة وتشغيل حساب  LEGO الخاص  بك لمعرفة كيفية التحكم في بياناتك الشخصية. يرجى الإطلاع على سياسة الخصوصية الخاصة بنا.
									   	</p>
										}
										<div className="forgot-user2 forgot-user1">
											<button id="registerButton" className="forgot-user forgot-user1" onClick={this.registerUser}>
											<FormattedMessage id="createAccountNext.Register" defaultMessage="Next" />
											</button>
										</div>
										<div className="goBack">
											<Link to={`/${store_locale}/login`}><FormattedMessage id="createAccountAccount.Register" defaultMessage="Already have a LEGO® Account?" /></Link>
										</div>
										{/* <AvForm>                      
                    
                    <AvField  placeholder="First Name" name="Username" label="First Name" required />
                    <AvField  placeholder="Last Name" name="Username" label="Last Name" required />
                    <AvField  placeholder="512345618" name="Username" label="Mobile Number" required />
                    <div className="form-group">
                                <label for="phone"> <FormattedMessage id="contactUs.purpose" defaultMessage="Phone:"/></label>
                                <PhoneNumber  changed={this.contactNumber}/>
                                {this.state.isPhoneValid == false && 
                                         <span className='error'>Phone is not valid!</span>}
                            </div>
                            <div className="form-group">
                                <label for="name"> <FormattedMessage id="contactUs.name" defaultMessage="Your Name:"/></label>
                                <input type="text" className="form-control" name="name" value="" placeholder="Your Name" />
                               
                                        
                            </div>
                    <AvField  placeholder="example@domain.com" name="Username" label="Email address" required />
                    <Row>
                    <Col xs="12"><span className="birth-title">Date of birth</span></Col>

                    <Col xs="12" sm="4">
                    <AvField placeholder="MM" name="month" label="Month" required />
                    </Col>
                    <Col xs="12" sm="4">
                    <AvField placeholder="DD" name="day" label="Day" required />
                    </Col>
                    <Col xs="12" sm="4">
                    <AvField placeholder="YYYY" name="year" label="Year" required />
                    </Col>
                    </Row>
                    <Row> <Col className="nopadding"><AvField  placeholder="********" name="Password" label="Password" required /><div className="eye-icon"></div></Col></Row>
                    <Row> <Col className="nopadding"><AvField  placeholder="********" name="Password" label="Confirm Password" required /><div className="eye-icon"></div></Col></Row>
                    <Row> <Col className="nopadding"><div className="select-down"></div>
                    <AvField type="select" name="select" label="Country and region">
                    <option>Australia</option>
                    <option>Canada</option>
                    <option>Denmark</option>
                    <option>France</option>
                    <option>Germany</option>
                    </AvField>
                    </Col>
                    </Row>
                    
                 <AvGroup check>
                            <AvInput type="checkbox" name="checkbox" />
                            <Label className="custCheck" check for="checkbox"> Accept Terms and Conditions</Label>
                        </AvGroup>

                        <p className="subtext">When you agree to the <a href="#" className="privacy-link">Terms and Conditions</a> you also consent to our use of your personal information to process and operate your LEGO Account. To see how to control your personal data, please see our privacy policy.

</p>
                       
                        <FormGroup>
                            <div className="forgot-user2 forgot-user1">
                                <button type="submit" id="loginBtn" className="forgot-user forgot-user1">Next</button>
                            </div>
                        </FormGroup>
                   
                        
                            
                            
                            <div className="Section__Section--1YR06hT">
                                
                                <div className="forgot-user2 Button__link--1ZhhExr">
                                <Link to={`/${store_locale}/login`}> <button type="button" id="need-account" className="forgot-user Button__link--1ZhhExr">Already have a LEGO®  Account?</button></Link>
                                </div>
                            </div>

                    </AvForm> */}
										<div className="app-footer">
											<span>
												<img src={adult} alt="apple" />
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="legals">
					<button className="btn-legal" aria-haspopup="true" id="policyBtnId">
						Privacy Policy
					</button>
					<button className="btn-legal" aria-haspopup="true" id="cookiesBtnId">
						Cookies
					</button>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		registerData: state.login.registerUserDetails,
		registerLoader: state.login.registerLoader,
		globals: state.global,
		guestUser: state.guest_user,
	}
}
const mapDispatchToProps = (dispatch) => {
	return { onRegisterUser: (payload) => dispatch(actions.registerUser(payload)) }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(AccountCreate)))
