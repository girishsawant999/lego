import React, { Component } from "react"
import { AvForm, AvField, AvGroup, AvInput } from "availity-reactstrap-validation"
import { Label, FormGroup } from "reactstrap"
import { Link, withRouter } from "react-router-dom"
import leftArrow1 from "../../assets/images/LEGO+Account.svg"
import facebookwhite from "../../assets/images/facebook_logo_white.svg"
import signman from "../../assets/images/signman.png"
import google from "../../assets/images/google.svg"
import apple from "../../assets/images/apple.svg"
import * as actions from ".././../redux/actions/index"
import Spinner2 from "../../components/Spinner/Spinner2"
import { connect } from "react-redux"
import $ from 'jquery'
import {store} from "../../redux/store/store"
import { FormattedMessage } from '../../../node_modules/react-intl'

var message = ""

class SignIn extends Component {
	constructor(props) {
		super(props)
		this.formEl = React.createRef()
		this.state = {
			email: "",
			password: "",
			hasError: "",
			myCartFlag: true,
			isChecked: false,
			classEye:"eye-icon",
			product_id: "",

		}
	 this.store_locale = this.props.globals.store_locale
	}
	componentDidMount() {
		let product_id = ""
		if(this.props.history.location) {
			if(this.props.history.location.state) {
				if(this.props.history.location.state.data) {
					product_id = this.props.history.location.state.data.product_id
					this.setState({
						product_id: this.props.history.location.state.data.product_id
					})
				}

			}
		}
	}
	
	componentWillReceiveProps(nextProps) {
		message = ""
		if (nextProps.isUserLoggedIn) 
		{
			if (window.location.search && window.location.search.includes('checkout')) {
				this.props.history.push(`/${this.props.globals.store_locale}/cart`)
			} else if(this.props.location.state)
			{
				var {from} = this.props.location.state || {from: {pathname: '/'}}
				this.props.history.push(from) 
			}else
			{
				this.props.history.push(`/${this.props.globals.store_locale}/profile`)
			}
			
		} else {
			if (nextProps.loginErrorMessage) {
				message = nextProps.loginErrorMessage
			}
		}
	}


	login = () => {
		
		if (this.validateEmail()&& this.validatePassword()) {

		const guestquote = this.props.guestUser ? this.props.guestUser.new_quote_id ?
          this.props.guestUser.new_quote_id : '' : '';
			const payload = {
				email: this.state.email,
				password: this.state.password,
				guestquote: guestquote,
				product_id: this.state.product_id
			}
			this.props.onLoginUser(payload)
			const rememberData={
				email: this.state.email,
				password: this.state.password,
				isChecked:this.state.isChecked
			}
			this.props.onRememberDataStore(rememberData)
		}
	}

	tooglePasswordVisibility = (elementId,eyeChangeId) => {
		const inputType = document.getElementById(elementId).type

		if (inputType === "password") {
			document.getElementById(elementId).type = "text";
			this.setState({classEye:"eye-icon-open"});
			
		} else {
			document.getElementById(elementId).type = "password";
			this.setState({classEye:"eye-icon"});
		}
	}
	onChangeCheckbox = event => {
        this.setState({
            isChecked: event.target.checked
        })
	}
	keyupChangeHandler = (event) => {
		this.setState({
			[event.target.name] : event.target.value
		})
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
	render() {
		const store_locale = this.props.globals.store_locale
		const { loginLoader } = this.props.customer_details
		if (loginLoader) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
		}
		return (
			<div>
				<div className="SignIn">
					<div id="login">
						<div className="container">
							<div id="login-row" className="row justify-content-center align-items-center">
								<div id="login-column">
									<div id="login-box" className="col-md-12">
										<h3 className="text-center text-info">
											<Link to={`/`}>
												<span>
													<img src={leftArrow1} className="account-icon" alt="account" />
												</span>
											</Link>
										</h3>
										<div className="experience--login">
											<div className="login-minifig">
												<span>
													<img src={signman} className="signman-icon" alt="account" />
												</span>
												{/* <div className="circle-icon"> Icon </div> */}
											</div>
										</div>
										<div className="form-group">
											<label for="name"> <FormattedMessage id="login.Username" defaultMessage="Username" /></label>
											<input
												type="text"
												className="form-control"
												name="email"
												id="email"
												placeholder={this.props.globals.store_locale=== "en" ? "Username": "اسم المستخدم"}
												value={this.state.email}
												onInput={this.keyupChangeHandler}
												onChange={(e) => this.validateEmail(e)}
											/>
											{this.state.emailErr && <span className="error">{this.state.emailErr}</span>}
										</div>
										<div className="form-group">
											<label for="phone"> <FormattedMessage id="createAccountPassword.Register" defaultMessage="Password" /></label>
											<div id="eyeChange" className={this.state.classEye} onClick={() => this.tooglePasswordVisibility("password","eyeChange")}></div>
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
												onKeyUp={(e) => {
													if(e.keyCode=== 13) this.login()
												}}
											/>
											
											{this.state.passwordErr && <span className="error">{this.state.passwordErr}</span>}
										</div>
										<AvForm ref={this.formEl}>
											<span className="error">{message}</span>
											<AvGroup check>
												<AvInput onChange={this.onChangeCheckbox}   id="rememberChkBox" type="checkbox" name="checkbox" />
												<Label className="custCheck" check for="checkbox">
													{" "}
													 <FormattedMessage id="loginRemember.login" defaultMessage="Remember me" />
												</Label>
											</AvGroup>
											<p className="subtext">
											 <FormattedMessage id="loginRememberMessage.login" defaultMessage="Message Remember to log out afterwards if you’re using a shared computer, for example in a library or" />
											</p>
											<FormGroup>
												<div className="forgot-user2 forgot-user1 text-center">
													<button type="submit" id="loginBtn" className="forgot-user forgot-user1" onClick={()=>{this.login()}}>
													<FormattedMessage id="loginBtn.login" defaultMessage="Log in" />
														{/* <i id="btnLoader" className="fa fa-spinner fa-spin ml-2"></i> */}
													</button>
												</div>
											</FormGroup>
											<div className="help-section">
												<div className="forgot-link">
													<div className="forget-left">
														{/* <Link to={`/${store_locale}/forgotUser`}>
															<button type="button" className="two-link">
																Forgot username?
															</button>
														</Link>

													 <span className="help-section--breaker"></span> */}
														<Link to={`/${store_locale}/forgotPassword`}>
															<button type="button" id="forgot-password" className="two-link">
															<FormattedMessage id="loginForgetPass.login" defaultMessage="Forgot password?" />
															</button>
														</Link>
													</div>
												</div>
											</div>
											{/* <h2 className='or-first'>
                        <span>Or</span>
                      </h2>

                      <div className='omb_login'>
                        <div className='row omb_row-sm-offset-3 omb_socialButtons'>
                          <div className='col-xs-4 col-8'>
                            <a href='#' className='btn btn-block omb_btn-facebook'>
                              <i className='fa  visible-xs'>
                                <span>
                                  <img
                                    src={facebookwhite}
                                    className='facebook-white'
                                    alt='account'
                                  />
                                </span>
                              </i>
                              <span className='face-icon'>
                                Continue with Facebook
                              </span>
                            </a>
                          </div>
                          <div className='col-xs-4 col-2'>
                            <a href='#' className='btn btn-block omb_btn-twitter'>
                              <i className='fa'>
                                <span>
                                  <img
                                    src={google}
                                    className='google-icon'
                                    alt='google'
                                  />
                                </span>
                              </i>
                            </a>
                          </div>
                          <div className='col-xs-4 col-2'>
                            <a href='#' className='btn btn-block omb_btn-google'>
                              <i className='fa'>
                                <span>
                                  <img
                                    src={apple}
                                    className='google-icon'
                                    alt='apple'
                                  />
                                </span>
                              </i>
                            </a>
                          </div>
                        </div>
                      </div> */}
											<div className="Section__Section--1YR06hT">
											<FormattedMessage id="loginDAccount.login" defaultMessage="Don’t have a LEGO® Account?" />
												<div className="forgot-user2 Button__link--1ZhhExr">
													<Link to={`/${store_locale}/register`}>
														<button type="button" id="need-account" className="forgot-user Button__link--1ZhhExr">
														<FormattedMessage id="loginCreateAccount.login" defaultMessage="Create account" />
														</button>
													</Link>
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
		guestUser: state.guest_user,
		customer_details: state.login,
		isUserLoggedIn: state.login.isUserLoggedIn,
		loginErrorMessage: state.login.loginErrorMessage,
		globals: state.global,
		registerUserDetails: state.login.registerUserDetails,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onLoginUser: (payload) => dispatch(actions.loginUser(payload)),
		onRememberDataStore:(payload)=>dispatch(actions.storeRememberData(payload))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn))
