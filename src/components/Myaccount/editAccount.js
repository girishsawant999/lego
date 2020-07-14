import React, { Component } from "react"
import {FormattedMessage, defineMessages , injectIntl } from "../../../node_modules/react-intl"
import { Row, Col, Label } from "reactstrap"
import { Link } from "react-router-dom"
import leftArrow1 from "../../assets/images/LEGO+Account.svg"
import adult from "../../assets/images/adult-register-geek.png"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import PhoneNumber from "./PhoneInputCompEditAccount"
import * as actions from ".././../redux/actions/index"
import { Redirect } from "react-router-dom"
import { css } from "glamor"
import Spinner2 from "../../components/Spinner/Spinner2"
import { tr } from "date-fns/locale"
import { toast } from "react-toastify"
import AvtarL from "../../../src/assets/images/icons/avtarL.svg"
import AvtarR from "../../../src/assets/images/icons/avtarR.svg"
import AvatarMy from "../../../src/assets/images/icons/avatarMy.png"
import avtar1 from "../../../src/assets/AvtarImages/avtar1.png"
import avtar2 from "../../../src/assets/AvtarImages/avtar2.png"
import avtar3 from "../../../src/assets/AvtarImages/avtar3.png"
import avtar4 from "../../../src/assets/AvtarImages/avtar4.png"
import avtar5 from "../../../src/assets/AvtarImages/avtar5.png"
import avtar6 from "../../../src/assets/AvtarImages/avtar6.png"
import avtar7 from "../../../src/assets/AvtarImages/avtar7.png"
import avtar8 from "../../../src/assets/AvtarImages/avtar8.png"
import "react-toastify/dist/ReactToastify.css"
var message = ""
let avtarImage;
let setAvtarImage;
avtarImage = [
	{
		image:avtar1,
		name:"avtar1"

	},
	{
		image:avtar2,
		name:"avtar2"
	},
	{
		image:avtar3,
		name:"avtar3"
	},
	{
		image:avtar4,
		name:"avtar4"
	},
	{
		image:avtar5,
		name:"avtar5"
	},
	{
		image:avtar6,
		name:"avtar6"
	},
	{
		image:avtar7,
		name:"avtar7"
	},
	{
		image:avtar8,
		name:"avtar8"
	},
]
let setAvtarImageFromAPI;
var moment = require('moment') 
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
class EditAccount extends Component {
	constructor(props) {
		super(props)
		this.state = {
			firstNameErr: "",
			lastNameErr: "",
			phoneErr: "",
			avtarImage:this.props.setAvtarImageFromAPI,
			emailErr: "",
			dateErr: "",
			passwordErr: "",
			password1Err: "",
			tncErr: "",
			customer: {
				id: this.props.useredit.id,
				email: this.props.useredit.email,
				firstname: this.props.useredit.firstname,
				lastname: this.props.useredit.lastname,
				storeId: this.props.globals.currentStore,
				dob: this.props.useredit.dob,
				carrier_code: this.props.useredit.custom_attributes[1].value,
				contact_number: this.props.useredit.custom_attributes[0].value,
				websiteId: 1,
				custom_attributes: this.props.useredit.custom_attributes
			},
			isdefaultPhone:true,
			avtarindex: 0
		}
		this.payload = {
			id: this.props.useredit.id,
			email: this.props.useredit.email,
			firstname: this.props.useredit.firstname,
			lastname: this.props.useredit.lastname,
			storeId: this.props.globals.currentStore,
			dob: this.props.useredit.dob,
			carrier_code: this.props.useredit.custom_attributes[1].value,
			contact_number: this.props.useredit.custom_attributes[0].value,
			websiteId: 1,
			custom_attributes: this.props.useredit.custom_attributes

		}
		this.payloadValid = false
		this.store_locale = this.props.globals.store_locale
	}

	handleValidation = () => {
		let fields = this.state.customer;
		let errors = {};
		let formIsValid = true;

	}
	nextClick = () => {
		
		if (this.state.avtarindex !== avtarImage.length-1) {
			const currentindex = this.state.avtarindex
			// this.setState(
			// 	{ avtarindex: currentindex + 1 },
			// 	() => (document.getElementById("avtarimage").src = avtarImage[this.state.avtarindex].image)
			// )
			this.setState({avtarindex:currentindex+1})
			this.setState({avtarImage:avtarImage[this.state.avtarindex].image})

		}
	}
	prevClick = () => {
		if (this.state.avtarindex !== 0) {
			const currentindex = this.state.avtarindex
			this.setState({avtarindex:currentindex-1})
			this.setState({avtarImage:avtarImage[this.state.avtarindex].image})
		}
	}


	onInputHandler = () => {
		this.setState((prevState) => ({
			...prevState,
			customer: {
				...prevState.customer,
				firstname: document.getElementById("firstname").value,
				lastname: document.getElementById("lastname").value,
				email: document.getElementById("email").value,
				dob:
					document.getElementById("yearId").value +
					"-" +
					document.getElementById("monthId").value +
					"-" +
					document.getElementById("dayId").value,
			},
		}))
	}

	componentDidMount() {
		// document.getElementById("btnLoader").style.visibility = "hidden"
		// document.getElementById("header").style.display = "none"
		// document.getElementById("footer").style.display = "none"
		// document.body.style.paddingTop = "0px"
		// document.body.style.paddingBottom = "0px"
	}

	componentWillReceiveProps(nextProps) {
		// if(nextProps.useredit){
		// 	this.toastId = toast("Edit customer info sucessfully", {
		// 		className: css({
		// 			color: "green !important",
		// 			fontSize: "13.5px",
		// 		}),
		// 		onClose: this.toastClosed,
		// 	})
		// 	this.closeModal();
		// }

		if (nextProps.account.user) {
			if (nextProps.account.user.status) {
				const payload2 = {
					customerid: this.props.login.customer_id,
				}
				this.props.onGetAddressBook(payload2)
				this.closeModal()
				//nextProps.account.user.status = false
			}
		}
		// message = ""
		// if (nextProps.registerData) {
		// 	if (nextProps.registerData.status) {
		// 		this.props.history.push({
		// 			pathname: `/${this.props.globals.store_locale}/myaccount-info/`,
		// 			state: { message: nextProps.registerData.message },
		// 		})
		// 	} else {
		// 		message = nextProps.registerData.message
		// 	}
		// 	if (document.getElementById("registerButton")) {
		// 		document.getElementById("registerButton").disabled = false
		// 	}
		// }
	}

	validateFirstName = () => {
		let formIsValid = true
		var firstname = document.getElementById("firstname").value
		if (firstname.match(/^[A-Za-z]+$/)) {
			this.payload.firstname = firstname
			this.setState({ isFirstNameValid: true })
			this.setState({ firstNameErr: "" })
		} else {
			this.setState({ isFirstNameValid: false })
			firstname.length > 0
				? this.setState({ firstNameErr: this.store_locale === 'en' ? "Firstname is invalid!" : "الاسم الأول غير صالح!" })
				: this.setState({ firstNameErr: this.store_locale === 'en' ? "Firstname should not be empty!" : "يجب ألا يكون الاسم الأول فارغًا!" })
			formIsValid = false
		}
		return formIsValid
	}
	validateLastName = () => {
		let formIsValid = true
		var lastname = document.getElementById("lastname").value
		if (lastname.match(/^[A-Za-z]+$/)) {
			this.payload.lastname = lastname
			this.setState({ isLastNameValid: true })
			this.setState({ lastNameErr: "" })
		} else {
			this.setState({ isLastNameValid: false })
			lastname.length > 0
				? this.setState({ lastNameErr: this.store_locale === 'en' ? "Lastname is invalid!" : "اسم العائلة غير صالح!" })
				: this.setState({ lastNameErr: this.store_locale === 'en' ?  "Lastname should not be empty!" :"لا يجب أن يكون اسم العائلة فارغًا!"  })
			formIsValid = false
		}
		return formIsValid
	}
	contactNumber = (status, value, countryData, number, id) => {
		let formIsValid = true	
		if (status) {
			this.payload.carrier_code = countryData.dialCode
			this.payload.contact_number = value
			this.setState({ isPhoneValid: true })
			this.setState({ phoneErr: "" })
			delete this.state.phoneErr
		} else if (value !== undefined && number != undefined) 
		{
			value && value.length > 0
				? this.setState({ phoneErr: this.store_locale === 'en' ? "Phone number is invalid!" : "رقم الهاتف غير صالح!"  })
				: this.setState({ phoneErr: this.store_locale === 'en' ? "Phone number should not be empty!" :"يجب ألا يكون رقم الهاتف فارغًا!" })
			formIsValid = false
		}
		return formIsValid
	}
	validateEmail = () => {
		return true //comment this line for validating email
		let formIsValid = true
		var email = document.getElementById("email").value
		if (email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)) {
			this.payload.email = email
			this.setState({ isEmailValid: true })
			this.setState({ emailErr: "" })
		} else {
			this.setState({ isEmailValid: false })
			email.length > 0
				? this.setState({ emailErr: "Email is invalid!" })
				: this.setState({ emailErr: "Email should not be empty!" })
			formIsValid = false
		}
		return formIsValid
	}
	dateChecker = (event) => {
		var days = document.getElementById("dayId").value
		var months = document.getElementById("monthId").value
		var years = document.getElementById("yearId").value
		this.setState({ dateErr: "" })
		this.payload.dob = months + days + years
		
		if(!moment(months, 'MM',true).isValid()){
			this.setState({ dateErr: this.store_locale === 'en' ? "Birth date is invalid!" : "تاريخ الميلاد غير صالح!"})			
			return false
		}
		if(!moment(days, 'DD',true).isValid()){
			this.setState({ dateErr: this.store_locale === 'en' ? "Birth date is invalid!" : "تاريخ الميلاد غير صالح!"})
			return false
		}
		if(!moment(years, 'YYYY',true).isValid()){
			this.setState({ dateErr: this.store_locale === 'en' ? "Birth date is invalid!" : "تاريخ الميلاد غير صالح!"})
			return false
		}
		if(years<1900){
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

	handleChange = (field, e) => {

		let fields = this.state.customer;
		fields[field] = e.target.value;
		this.setState({ fields });


	}

	validateForm = () => {
		let formIsvalid=false
		if (
			this.validateFirstName() &&
			this.validateLastName() &&
			this.contactNumber() &&
			this.validateEmail() &&
			this.dateChecker()) {
				formIsvalid=true
		}
		return formIsvalid

	}
	validatePayload = () => {
		var payloadKeys = [
			"firstname",
			"lastname",
			"carrier_code",
			"contact_number",
			"dob",
			"email",

		]

		const nullPayloadFields = payloadKeys.find((key) => this.payload[key] === "")
		if (nullPayloadFields === undefined) {
			this.payloadValid = false
		} else {
			this.payloadValid = true
		}
	}

	tooglePasswordVisibility = (elementId) => {
		const inputType = document.getElementById(elementId).type
		if (inputType === "password") {
			document.getElementById(elementId).type = "text"
		} else {
			document.getElementById(elementId).type = "password"
		}
	}
	updateUserAccountInfo = () => {
		let dateValidationStatus = this.dateChecker
		// this.validateForm()
		// this.validatePayload()
		let avtarImageName;
		// avtarImage.map((item,index)=>{
		// 	if(this.state.avtarindex===index+1){
		// 		avtarImageName=item.name
		// 	}
		// })
		let splitAvtarName;
		let _split_value_toavtar;
		if(parseInt(this.state.avtarindex)===0 && this.state.avtarImage!=="" &&  this.state.avtarImage!==null && this.state.avtarImage!==undefined){
			//avtarImageName=this.props.setAvtarImageNameAPI
			splitAvtarName=this.state.avtarImage.split("/");
			_split_value_toavtar=splitAvtarName[splitAvtarName.length-1].split(".")
		}
		
		else if(parseInt(this.state.avtarindex)!==0 && this.state.avtarImage!=="" && this.state.avtarImage!==null &&  this.state.avtarImage!==undefined ){
			splitAvtarName=this.state.avtarImage.split("/");
			_split_value_toavtar=splitAvtarName[splitAvtarName.length-1].split(".")
		}
		
		//let _split_value_toavtar=splitAvtarName.split(".")
		let day = document.getElementById("dayId").value;
		let month = document.getElementById("monthId").value;
		let year = document.getElementById("yearId").value;
		let dob = year + "-" + month + "-" + day
		let customer = {
			id: this.payload.id,
			email: this.payload.email,
			firstname: this.payload.firstname,
			lastname: this.payload.lastname,
			storeId: this.payload.storeId,
			dob: dob,
			websiteId: 1,
			custom_attributes: [
				{
					attribute_code: "customer_telephone",
					value: this.payload.contact_number
				},
				{
					attribute_code: "country_carrier_code",
					value: this.payload.carrier_code
				},
				{
					attribute_code: "avatar",
					value:this.state.avtarImage!==undefined ? _split_value_toavtar[0]:"avtar1"
				}
			]
		}
		if (this.validateForm()) {
          //  document.getElementById("saveData").disabled = true
			this.props.updateAccountInformation({ customer })
		}

	}
	closeModal=()=>{
		this.props.closeInfoModal("true")

	}
	render() {
		const {formatMessage} = this.props.intl;

		avtarImage.map((item, index) => {
			if (this.props.setAvtarImageName !== undefined && this.props.setAvtarImageName === item.name) {
				setAvtarImageFromAPI = item.image
			}
		})
		let defaultPhoneNumber = {};
        if (this.state.isdefaultPhone) {
            defaultPhoneNumber = {
                ...defaultPhoneNumber,
				carrier_code: this.props.useredit.custom_attributes[1].value,
				contact_number: this.props.useredit.custom_attributes[0].value,
            }
        }
		const store_locale = this.props.globals.store_locale

		const { updateLoader } = this.props.account

		if (updateLoader) {
			return (
				<div  className="mobMinHeight col-md-9 pd-0">
					<Spinner2 />
				</div>
			)
		}

		return (
			
			<div>
				
				<div className="EditAccount bg-white">
					<div id="login">
						<div className="">
							<div id="login-row" className="row justify-content-center align-items-center">
								<div id="login-column">
									<div id="login-box" className="col-md-12">
										<h1 className="main-title-sign"><FormattedMessage id="myAccountInfo.EditAccount" defaultMessage="Edit Account" /></h1>
										<div className="avtarDiv EditAvtar">
															<p className="avtarText">
																<FormattedMessage id="myAccountInfo.Avtar" defaultMessage="Avatar" />
															</p>
															<ul className="list-inline">
																<li
																	style={this.state.avtarindex === 0 ? { opacity: "0.5" } : {}}
																	onClick={() => this.prevClick()}
																	className="list-inline-item">
																	<img className="arrow" src={AvtarL} alt="avtarL" />
																</li>
																<li className="list-inline-item">
																	<div className="avtarImage">
																		<img id="avtarimage" className="avtarImg" src={this.state.avtarImage===undefined ? avtar1:this.state.avtarImage} alt="AvatarMy" />
																	</div>
																</li>
																<li
																	style={this.state.avtarindex === avtarImage.length - 1 ? { opacity: "0.5" } : {}}
																	onClick={() => this.nextClick()}
																	className="list-inline-item">
																	<img className="arrow" src={AvtarR} alt="avtarR" />
																</li>
															</ul>
														</div>
										<div className="form-group">
											<label for="Firstname"> <FormattedMessage id="myAccountInfo.FirstName" defaultMessage="First Name" /></label>
											<input
												type="text"
												className="form-control"
												name="firstname"
												id="firstname"
												placeholder={formatMessage(messages.firstname)}
												value={this.state.customer.firstname}
												onChange={this.handleChange.bind(this, "firstname")}
												onBlur={this.validateFirstName}
											/>
											{this.state.firstNameErr && <span className="error">{this.state.firstNameErr}</span>}
										</div>
										<div className="form-group">
											<label for="Firstlast"> <FormattedMessage id="myAccountInfo.LastName" defaultMessage="Last Name" /></label>
											<input
												type="text"
												className="form-control"
												name="lastname"
												id="lastname"
												placeholder={formatMessage(messages.lastname)}
												value={this.state.customer.lastname}
												onChange={this.handleChange.bind(this, "lastname")}
												onBlur={this.validateLastName}
											/>
											{this.state.lastNameErr && <span className="error">{this.state.lastNameErr}</span>}
										</div>

										<div className="form-group">
											<label for="phone"><FormattedMessage id="myAccountInfo.MobileNumber" defaultMessage="Mobile Number" /> </label>
											<PhoneNumber changed={this.contactNumber}
											isdefaultPhone={this.state.isdefaultPhone}
											defaultPhone={{ ...defaultPhoneNumber }} />
											{this.state.phoneErr && <span className="error">{this.state.phoneErr}</span>}
										</div>
										{/* <div className="form-group">
											<label for="name"> <FormattedMessage id="contactUs.email" defaultMessage="Email address" /></label>
											<input
												type="text"
												className="form-control"
												name="email"
												id="email"
												placeholder="Email address"
												value={this.state.customer.email}
												onChange={this.handleChange.bind(this, "email")}
												onBlur={this.validateEmail}
											/>
											{this.state.emailErr && <span className="error">{this.state.emailErr}</span>}
										</div> */}
										<div className="form-group">
											<Row>
												<Col xs="12">
													<span className="birth-title"><FormattedMessage id="myAccountInfo.dob" defaultMessage="Date of birth" /></span>
												</Col>
												<Col xs="4" sm="4">
													<label for="name"> <FormattedMessage id="myAccountInfo.Month" defaultMessage="Month" /></label>
													<input
														type="text"
														id="monthId"
														className="form-control"
														name="dd"
														maxLength="2"
														defaultValue={this.state.customer.dob.split("-")[1]}
														onBlur={this.dateChecker}
													/>
												</Col>
												<Col xs="4" sm="4">
													<label for="name"> <FormattedMessage id="myAccountInfo.Day" defaultMessage="Day" /></label>
													<input
														type="text"
														id="dayId"
														className="form-control"
														name="mm"
														maxLength="2"
														defaultValue={this.state.customer.dob.split("-")[2]}
														onBlur={this.dateChecker}
													/>
												</Col>
												<Col xs="4" sm="4">
													<label for="name"> <FormattedMessage id="myAccountInfo.Year" defaultMessage="Year" /></label>
													<input
														type="text"
														id="yearId"
														className="form-control"
														name="yyyy"
														maxlength="4"
														defaultValue={this.state.customer.dob.split("-")[0]}
														onBlur={this.dateChecker}
													/>
												</Col>
												<Col xs="12">{this.state.dateErr && <span className="error">{this.state.dateErr}</span>}</Col>
											</Row>
										</div>
										<div className="ButtonDivEdit">
											<button onClick={()=>this.closeModal()}className="cancelbtn"><FormattedMessage id="myAccountInfo.Cancel" defaultMessage="Cancel" /></button>
											<button id="saveData" onClick={() => this.updateUserAccountInfo()} className="okbtn"><FormattedMessage id="myAccountInfo.Save" defaultMessage="Save" /></button>
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
		account: state.account,
		registerData: state.login.registerUserDetails,
		registerLoader: state.login.registerLoader,
		globals: state.global,
		login: state.login.customer_details,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onGetAddressBook: (payload) => dispatch(actions.getAddressBook(payload)),
		onGetAccountPageData: (payload) => dispatch(actions.getAccountPageData(payload)),
		updateAccountInformation: (payload) => dispatch(actions.updateAccountInfoData(payload))
	}

}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(EditAccount)))
