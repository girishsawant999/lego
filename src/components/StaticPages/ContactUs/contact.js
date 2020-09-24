import React, { Component } from "react"
import { FormattedMessage, injectIntl, defineMessages, intlShape } from "../../../../node_modules/react-intl"
import PhoneNumber from "./IntlTelePhone"
import phone from "../../../assets/images/icons/call.png"
import msg from "../../../assets/images/icons/message.png"
import FbContact from "../../../assets/images/icons/fbContactUs.png"
import TwContact from "../../../assets/images/icons/twContactUs.png"
import YtContact from "../../../assets/images/icons/ytContactUs.png"
import InContact from "../../../assets/images/icons/inContactUs.png"
import WhatApp from '../../../assets/images/icons/whatsApp2.png';

import * as actions from "../../../redux/actions/index"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { css } from "glamor"
import AddBagAlert from '../../../common/AlertBox/addToBagAlert';

const messages = defineMessages({
	name: {
		id: "contactUs.name",
		defaultMessage: "Your Name",
	},
	email: {
		id: "contactUs.email",
		defaultMessage: "Email Address",
	},
	customerServices: {
		id: "contactUs.customerServices",
		defaultMessage: "Customer Services",
	},
	Deliveries: {
		id: "contactUs.Deliveries",
		defaultMessage: "Deliveries",
	},
	General: {
		id: "contactUs.General",
		defaultMessage: "General",
	},
	Order: {
		id: "contactUs.order",
		defaultMessage: "Order",
	},
	Payment: {
		id: "contactUs.payment",
		defaultMessage: "Payment",
	},
	Returns: {
		id: "contactUs.returns",
		defaultMessage: "Returns",
	},
	Stores: {
		id: "contactUs.stores",
		defaultMessage: "Stores",
	},
})
const validEmailRegex = RegExp(
	/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
)

class ContactUs extends Component {
	toastId = null
	constructor(props) {
		super(props)
		this.formEl = React.createRef()
		this.myRef = React.createRef()
		this.state = {
			name: "",
			email: "",
			phoneNumber: "",
			purpose: "",
			carrier_code: "",
			comment: "",
			isPhoneValid: null,
			nameErr: "",
			emailErr: "",
			phoneErr: "",
			commentErr: "",
			purposeErr: "",

			contactData: {
				name: "",
				email: "",
				phoneNumber: "",
				purpose: "",
				carrier_code: "",
				comment: "",
				storeId: "",
			},
			
			addMessagePopup: false,
			addMessage: "",
		}
	}

	handlePurpose = (value) => {
		this.state.purposeErr = value.target.value.length <= 0 ? "Please select Purpose!" : ""
		this.setState({ purpose: value.target.value })
	}

	onCommentChanges = (value) => {
		this.setState({ comment: value.target.value })
	}

	handleChange = (e) => {
		e.preventDefault()
		const { name, value } = e.target
		let errors = this.state
		switch (name) {
			case "name":
				errors.nameErr = value.length <= 0 ? "Name is required" : ""

				this.setState({ name: value })
				break
			case "email":
				errors.emailErr = validEmailRegex.test(value) ? "" : "Email is not valid!"

				this.setState({ email: value })
				break
			case "comment":
				errors.commentErr = value.length <= 0 ? "Comment is required" : ""

				this.setState({ comment: value })
				break
			default:
				break
		}
		this.setState({ errors })
	}

	toastClosed = (e) => {
		this.toastId = null
		this.setState({ name: "" })
		this.setState({ email: "" })
		this.setState({ comment: "" })
		//this.setState({ purpose: "customer_services" })
		this.props.onclearContactUsProps()
		this.formEl && this.formEl.reset()
	}

	componentDidMount() {
        window.scrollTo(0, 0);
    }

	componentWillReceiveProps(nextProps) {
		if (nextProps.contactUsDetails.contactUsDetails) {
			if (nextProps.contactUsDetails.contactUsDetails.status === true) {
				/*this.toastId = toast(nextProps.contactUsDetails.contactUsDetails.message, {
					className: css({
						color: "green !important",
						fontSize: "13.5px",
					}),
					onClose: this.toastClosed,
				})*/
				this.setState({
					name: "",
					email: "",
					phoneNumber: "",
					purpose: "",
					carrier_code: "",
					comment: "",
					isPhoneValid: null,
					nameErr: "",
					emailErr: "",
					phoneErr: "",
					commentErr: "",
					purposeErr: "",
					
					addMessagePopup: true,
					addMessage: nextProps.contactUsDetails.contactUsDetails.message
				 });
			}

			if (nextProps.contactUsDetails.contactUsDetails.status === false) {
				//if (nextProps.contactUsDetails.contactUsDetails.message === "Please provide valid Number.") {
				//	this.setState({ isPhoneValid: true })
				//} else {
					/*	this.errorToastId = toast(nextProps.contactUsDetails.contactUsDetails.message, {
						className: css({
							color: "red !important",
						}),
						onClose: this.errorToastClosed,
					})*/
				//}

				this.setState({
					name: "",
					email: "",
					phoneNumber: "",
					purpose: "",
					carrier_code: "",
					comment: "",
					isPhoneValid: null,
					nameErr: "",
					emailErr: "",
					phoneErr: "",
					commentErr: "",
					purposeErr: "",
					
					addMessagePopup: true,
					addMessage: nextProps.contactUsDetails.contactUsDetails.message
				 });
			}
		}
	}

	handleSubmit = (e) => {
		e.preventDefault()
		const { name, value } = e.target
		
		if (this.state.name == "") {
			this.setState({ nameErr: "Name is required!" })
		}
		if (this.state.email == "") {
			this.setState({ emailErr: "Email is not valid!" })
		}
		if (this.state.phoneNumber == "") {
			this.setState({ isPhoneValid: false })
		}
		if (this.state.comment == "") {
			this.setState({ commentErr: "Comment is required!" })
		}
		if (this.state.purpose == "") {
			this.setState({ purposeErr: "Please select Purpose!" })
		}
		if (this.state.name != "" && this.state.email != "" && this.state.phoneNumber != "" && this.state.comment != "" && this.state.purpose != "") {
			let storeId = this.props.globals.currentStore !== null ? this.props.globals.currentStore : 1
			var data = this.state.contactData
			data.name = this.state.name
			data.email = this.state.email
			data.carrier_code = this.state.carrier_code
			data.phoneNumber = this.state.phoneNumber
			data.purpose = this.state.purpose
			data.comment = this.state.comment
			data.storeId = storeId
			this.setState({ contactData: data })
			this.props.onSetContactUsData(data)
		}
	}

	contactNumber = (status, value, countryData, number, id) => {
		if (status) {
			this.setState({ carrier_code: countryData.dialCode })
			this.setState({ phoneNumber: value })
			this.setState({ isPhoneValid: true })
		} else {
			this.setState({ isPhoneValid: false })
		}
	}

	closeAddBag = () => {
		this.setState({
		   addMessagePopup: false
		})
	 }

	render() {
		const { errors } = this.state
		const { formatMessage } = this.props.intl

		let alertBox = null;
		if (this.state.addMessagePopup) {
            alertBox = <AddBagAlert
                message={this.state.addMessage}
                alertBoxStatus={true}
                closeBox={this.closeAddBag} />
		}
		return (
			<div ref={this.myRef}>
				<ToastContainer />
				<div className="ContactBlue">
					<div className="Title">
						<FormattedMessage id="contactUs.Contact" defaultMessage="Contact Us" />
					</div>
				</div>
				<div className="ContactUsPage">
					{alertBox}

					<div className="row">
						<div className="col-md-6">
							<div className="contactForm">
								<p className="writeToUs">
									<FormattedMessage id="contactUs.title" defaultMessage="Write to us " />
								</p>
								<form className="form" onSubmit={this.handleSubmit} ref={(c) => (this.formEl = c)}>
									<div className="form-group">
										<label for="name">
											{" "}
											<FormattedMessage id="contactUs.name" defaultMessage="Your Name:" />
										</label>
										<input
											type="text"
											className="form-control"
											name="name"
											value={this.state.name}
											onChange={this.handleChange}
											placeholder={formatMessage(messages.name)}
											id="name"
										/>
										{this.state.nameErr.length > 0 && (
											<span className="error">
												<FormattedMessage id="contactUs.nameErr" defaultMessage="Please enter name." />
											</span>
										)}
									</div>
									<div className="form-group">
										<label for="email">
											{" "}
											<FormattedMessage id="contactUs.email" defaultMessage="Email address:" />
										</label>
										<input
											type="email"
											className="form-control"
											name="email"
											value={this.state.email}
											onChange={this.handleChange}
											placeholder={formatMessage(messages.email)}
											id="email"
										/>
										{this.state.emailErr.length > 0 && (
											<span className="error">
												<FormattedMessage id="contactUs.emailErr" defaultMessage="Please enter email address." />
											</span>
										)}
									</div>
									<div className="form-group">
										<label for="phone">
											{" "}
											<FormattedMessage id="contactUs.phone" defaultMessage="Phone:" />
										</label>
										<PhoneNumber changed={this.contactNumber} />
										{this.state.isPhoneValid == false && (
											<span className="error">
												<FormattedMessage id="contactUs.phoneErr" defaultMessage="Please enter contact number." />
											</span>
										)}
									</div>
									<div className="form-group">
										<label for="purpose">
											{" "}
											<FormattedMessage id="contactUs.purpose" defaultMessage="Purpose:" />
										</label>
										<select
											id="purpose"
											name="purpose"
											className="selectlist apex-item-select"
											size={1}
											onChange={this.handlePurpose.bind(this)}
											value={this.state.purpose}>
											<option value="">{formatMessage(messages.customerServices)}</option>
											<option value="Deliveries">{formatMessage(messages.Deliveries)}</option>
											<option value="General"> {formatMessage(messages.General)}</option>
											<option value="order"> {formatMessage(messages.Order)}</option>
											<option value="payment">{formatMessage(messages.Payment)}</option>
											<option value="returns"> {formatMessage(messages.Returns)}</option>
											<option value="stores"> {formatMessage(messages.Stores)}</option>
										</select>
										{this.state.purposeErr.length > 0 && (
											<span className="error">
												<FormattedMessage id="contactUs.purposeErr" defaultMessage="Please select Purpose." />
											</span>
										)}
									</div>
									<div className="form-group">
										<label for="pwd">
											<FormattedMessage id="contactUs.comment" defaultMessage="Your comment:" />
										</label>
										<textarea
											className="form-control"
											id="exampleFormControlTextarea1"
											value={this.state.comment}
											name="comment"
											onChange={this.handleChange}
											rows="3"
											cols="50"></textarea>
										
										{this.state.commentErr.length > 0 && (
											<span className="error">
												<FormattedMessage id="contactUs.CommentErr" defaultMessage="Please enter Comment." />
											</span>
										)}
									</div>
									<button className="FormSubmit">
										<FormattedMessage id="contactUs.submitBtn" defaultMessage="Submit " />
									</button>
								</form>
							</div>
						</div>
						<div className="col-md-6">
							<div className="contactRight">
								<div className="directContact">
									<p className="directHeading">
										<FormattedMessage id="contactUs.directContact" defaultMessage="DIRECT CONTACT " />
									</p>
									<ul className="list-inline">
										<li className="list-inline-item">
											<img src={phone} alt="phone" />
										</li>
										<li className="list-inline-item">
											<a href="tel:8001180009">8001180009</a>
										</li>
									</ul>
									<ul className="list-inline">
										<li className="list-inline-item">
											<img src={msg} alt="msg" />
										</li>
										<li className="list-inline-item">
											<a href="mailto:help@lego.saudiblocks.com" target="_top">
												help@lego.saudiblocks.com
											</a>
										</li>
									</ul>
								</div>
								<div className="socialMedia">
									<p className="directHeading">
										<FormattedMessage id="contactUs.socialmedia" defaultMessage="SOCIAL MEDIA" />
									</p>
									<ul className="list-inline">
										<li className="list-inline-item">
											<a href="https://www.facebook.com/legosaudi/">
												{" "}
												<img src={FbContact} alt="footerLogo" />{" "}
											</a>
										</li>
										<li className="list-inline-item">
											<a href="https://twitter.com/LEGO_Group">
												{" "}
												<img src={TwContact} alt="footerLogo" />{" "}
											</a>
										</li>
										<li className="list-inline-item">
											<a href="https://www.instagram.com/lego.saudistores">
												{" "}
												<img src={InContact} alt="footerLogo" />{" "}
											</a>
										</li>
										<li className="list-inline-item">
											<a href="https://m.youtube.com/user/LEGO">
												{" "}
												<img src={YtContact} alt="footerLogo" />{" "}
											</a>
										</li>
									
									</ul>
									<div className="whatAppDivC">
                              <a target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?phone=966580353071&text=I%20initiate%20this%20chat%20from%20Lego%20website%20" className="wApp">  
                              <img src={WhatApp} alt="footerLogo" />message on whatsapp </a>
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
		contactUsDetails: state.contactUsDetails,
		intl: intlShape.isRequired,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSetContactUsData: (payload) => dispatch(actions.setContactUsData(payload)),
		onclearContactUsProps: () => dispatch(actions.onclearContactUsProps()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(ContactUs)))
