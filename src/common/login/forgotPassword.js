import React, { Component } from "react"
import { AvForm, AvField } from "availity-reactstrap-validation"
import { FormGroup } from "reactstrap"
import leftArrow1 from "../../assets/images/LEGO+Account.svg"
import backicon from "../../assets/images/leftArrow.svg"
import { Link } from "react-router-dom"
import * as actions from ".././../redux/actions/index"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { injectIntl } from "react-intl";
import Spinner2 from "../../components/Spinner/Spinner2";
import { FormattedMessage, defineMessages } from '../../../node_modules/react-intl'


var message = ""
var status = ""
const messages = defineMessages({
	username: {
		id:"forgetPasswordRecover.YourUserName" ,
		defaultMessage:"Your username"
	}
});
class ForgotPassword extends Component {
	constructor(props) {
		super(props)
		this.formEl = React.createRef()
		this.state = {
			email: "",
			showMessage: false,
			isSend: false,
			isInvalid: true,
		}

		this.handleEmailKeyUp = this.keyUpHandler.bind(this, "EmailInput")
	}

	keyUpHandler(refName, e) {
		if (this.state.email !== "") {
			let result = this.checkValid(this.state.email)

			if (!result) {
				// $('#submitBtn').addClass('disableButton');
				this.setState({
					isInvalid: true,
				})
			} else {
				// $('#submitBtn').removeClass('disableButton');
				this.setState({
					isInvalid: false,
				})
			}
		}
	}

	onChangeCredintials = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		})

		if (this.state.isSend) {
			this.setState({
				isSend: false,
			})
		}
		this.checkValid(e.target.value)
	}

	checkValid = (email) => {
		const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		if (!email.match(mailformat)) {
			// $('#submitBtn').addClass('disableButton');
			return false
		} else {
			// $('#submitBtn').removeClass('disableButton');
			return true
		}
	}

	forgotPassword = () => {
		message = ""
		status = ""
		const data = {
			email: this.state.email,
			contact_number: "",
			carrier_code: "",
			store_id: this.props.globals.currentStore,
		}
		if (this.state.email !== "" && document.getElementById("submitBtn")) {
			// document.getElementById("btnLoader").style.visibility = "visible"
			document.getElementById("submitBtn").disabled = true
			this.props.onForgotPassword(data)
		}
		this.setState({ showMessage: true })
	}

	componentDidMount() {
		// document.getElementById("btnLoader").style.visibility = "hidden"
		// document.getElementById("header").style.display = "none"
		// document.getElementById("footer").style.display = "none"
		// document.body.style.paddingTop = "0px";
		// document.body.style.backgroundColor = "#f2f5f7";
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user_details.forgotPasswordDetails && this.state.showMessage) {
			if (
				nextProps.user_details.forgotPasswordDetails.code === 200 &&
				nextProps.user_details.forgotPasswordDetails.status
			) {
				message = nextProps.user_details.forgotPasswordDetails.message
				status = true
				delete nextProps.user_details.forgotPasswordDetails
				/*
				setTimeout(() => {
					this.props.history.push(`/${this.props.globals.store_locale}/login`)
				}, 3000)
				*/
			} else if (
				nextProps.user_details.forgotPasswordDetails.code === 400 &&
				nextProps.user_details.forgotPasswordDetails.status === false
			) {
				message = nextProps.user_details.forgotPasswordDetails.message
				status = false
				delete nextProps.user_details.forgotPasswordDetails
			}

			if (document.getElementById("submitBtn")) {
				document.getElementById("submitBtn").disabled = false
			}
			// document.getElementById("btnLoader").style.visibility = "hidden"
		}
	}

	render() {
		const {formatMessage} = this.props.intl;
		const { store_locale } = this.props.globals;
		const { user_details } = this.props;

		if (user_details.forgotPasswordLoader) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
		}
		return (
			<div>
				<div className="ForgotPassword">
					<div id="login">
						<div className="container">
							<div id="login-row" className="row justify-content-center align-items-center">
								<div id="login-column">
									<div id="login-box" className="col-md-12">
										<Link to={`/${store_locale}/login`}>
											<button className="backButton">
												<span>
													<img src={backicon} className="back-icon" alt="account" />
												</span>
											</button>
										</Link>
										<h3 className="text-center text-info">
											<span>
												<img src={leftArrow1} className="account-icon" alt="account" />
											</span>
										</h3>
										<h1 className="main-title-sign"><FormattedMessage id="forgetPasswordRecover.forget" defaultMessage="Recover your Password" /></h1>
										<p className="sub-head-line"><FormattedMessage id="forgetPasswordRecover.forget" defaultMessage="Recover your Password" /></p>
										<AvForm ref={this.formEl}>
											<AvField
												id="username"
											 	placeholder={formatMessage(messages.username)} 
												name="email"
												label="Username"
												required
												onFocus={this.onFocus}
												onKeyUp={this.handleEmailKeyUp}
												ref="EmailInput"
												value={this.state.email}
												onChange={this.onChangeCredintials}
												validate={{
													required: {
														value: true,
														errorMessage: store_locale === "en" ? "Please enter email address." : "يتطلب حقلا",
													},
													pattern: {
														value: /^(('[\w-\s]+')|([\w-]+(?:\.[\w-]+)*)|('[\w-\s]+')([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/,
														errorMessage:
															store_locale === "en"
																? "Please enter a valid email address."
																: "من فضلك أدخل بريد أليكترونى صحيح.",
													},
												}}
											/>
											<FormGroup>
												{message && this.state.showMessage && (
													<div className={status ? "successMessage" : "ErrorMessage"}>{message}</div>
												)}
												<div className="forgot-user2 forgot-user1">
													<button
														disabled={this.state.isInvalid}
														type="submit"
														onClick={this.forgotPassword}
														id="submitBtn"
														className="forgot-user forgot-user1">
														<FormattedMessage id="forgetPasswordSubmit.forget" defaultMessage="Submit" />
														{/* <i id="btnLoader" className="fa fa-spinner fa-spin ml-2"></i> */}
													</button>
												</div>
											</FormGroup>
											<div className="help-section">
												<div className="Section__Section--1YR06hT">
													<div className="forgot-user2 Button__link--1ZhhExr">
														<Link to={`/${store_locale}/login`}>
															<button type="button" className="back-link">
															 <FormattedMessage id="forgetBackAccount.forget" defaultMessage="Back to Login" />
															</button>
														</Link>
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
		user_details: state.login,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onForgotPassword: (payload) => dispatch(actions.forgotPassword(payload)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(ForgotPassword)))