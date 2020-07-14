import React, { Component } from "react"
import { FormattedMessage, defineMessages, injectIntl } from "../../../node_modules/react-intl"
import { Row, Col, Label } from "reactstrap"
import minusIcon from "../../assets/images/icons/arrowDown.png"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import PhoneNumber from "./PhoneIntComp"
import * as actions from ".././../redux/actions/index"
import Spinner2 from "../../components/Spinner/Spinner2"

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
	},
	address: {
		id:"myAccountInfo.Address",
		defaultMessage:"Address"
	},
	pobox:{
		id:"shipping.Zipcode",
		defaultMessage:"P.O. Box"
	},
	apt:{
		id: "shipping.Apt2",
		defaultMessage: "Apt / Suite"
	},
	companyName: {
		id: "shipping.CompanyName2",
		defaultMessage: "Company Name"
	}
  });

class AddressInfo extends Component {
	constructor(props) {
		super(props)
		const { addressObj } = this.props
		this.state = {
			selectedCity: "",
			selectedCityName: "",
			city: [],

			firstNameErr: "",
			lastNameErr: "",
			phoneErr: "",
			addressErr: "",
			zipcodeErr: "",
			countryErr: "",
			cityErr: "",
			addTypeErr: "",
			defaultShippingErr: "",

			addressId: addressObj ? addressObj.Id : "",
			UserFirstName: addressObj ? addressObj.userFirstName : null,
			UserLastName: addressObj ? addressObj.userLastName : null,
			postcode: addressObj ? addressObj.postcode : null,
			carrier_code: addressObj ? addressObj.carrier_code : null,
			UserTelephone: addressObj ? addressObj.telephone : null,
			UserStreet: addressObj ? addressObj.street : null,
			UserCity: addressObj ? addressObj.city : null,
			UserCountry: addressObj ? addressObj.country_id : null,
			DefaultShipping: addressObj ? (addressObj.isdefaultShipping ? "1" : "0") : null,
			AddressType: addressObj ? addressObj.address_type : null,
			companyName: addressObj ? addressObj.company : null,
			customer_appartment: addressObj ? addressObj.customer_appartment : null,

			isdefaultPhone: true,
		}
		this.payloadValid = false
		this.formValid = true
	}

	componentWillMount() {
		this.props.onGetCountryLists({ store_id: this.props.globals.currentStore })
	}

	componentWillReceiveProps(nextProps) {
		var tempcity = []
		if (nextProps.countryList) {
			for (var i = 0; i < nextProps.countryList.length; i++) {
				if (nextProps.countryList[i] && nextProps.countryList[i].id === "SA") {
					for (var j = 0; j < nextProps.countryList[i].available_regions.length; j++) {
						tempcity[j] = nextProps.countryList[i].available_regions[j]
					}
				}
			}

			if (tempcity && tempcity.length > 0) {
				this.setState({ city: tempcity })
			}
		}
	}

	keyupChangeHandler = (event) => {
		const temp_state = {}
		temp_state[event.target.name] = event.target.value
		this.setState(temp_state)
	}

	validateFirstName = () => {
		var firstname = document.getElementById("firstname").value
		if (firstname.match(/^[A-Za-z]+$/)) {
			this.setState({ firstNameErr: "" })
			return true
		} else {
			firstname.length > 0
				? this.setState({ firstNameErr: this.props.globals.store_locale === 'en'? 
				"Firstname is invalid!": "الاسم الأول غير صالح!"
			 })
				: this.setState({ firstNameErr: this.props.globals.store_locale === 'en'? 
				"Firstname should not be empty!":"يجب ألا يكون الاسم الأول فارغًا!" })
			return false
		}
	}
	validateLastName = () => {
		var lastname = document.getElementById("lastname").value
		if (lastname.match(/^[A-Za-z]+$/)) {
			this.setState({ lastNameErr: "" })
			return true
		} else {
			lastname.length > 0
				? this.setState({ lastNameErr: this.props.globals.store_locale === 'en'? 
				"Lastname is invalid!" :"اسم العائلة غير صالح!"})
				: this.setState({ lastNameErr: this.props.globals.store_locale === 'en'? 
				 "Lastname should not be empty!":"لا يجب أن يكون اسم العائلة فارغًا!" })
			return false
		}
	}
	validateAddress = () => {
		var address = document.getElementById("address").value
		if (address.length < 1) {
			this.setState({ addressErr: this.props.globals.store_locale === 'en'? 
			"Address should not be empty!" :"يجب ألا يكون العنوان فارغًا!"})
			return false
		} else {
			this.setState({ addressErr: "" })
			return true
		}
	}
	validateZipcode = () => {
		var zipcode = document.getElementById("zipcode").value
		if (zipcode.length < 1) {
			this.setState({ zipcodeErr: "Zipcode should not be empty!" })
			return false
		} else {
			this.setState({ zipcodeErr: "" })
			return true
		}
	}
	contactNumber = (status, value, countryData, number, id) => {
		if (status) {
			this.setState({ UserTelephone: value, carrier_code: countryData.dialCode })
			this.setState({ phoneErr: "" })
			return true
		} else {
			value && value.length > 0
				? this.setState({ phoneErr: this.props.globals.store_locale === 'en'? 
				"Phone number is invalid!":"رقم الهاتف غير صالح!" })
				: this.setState({ phoneErr: this.props.globals.store_locale === 'en'? 
				"Phone number should not be empty!":"يجب ألا يكون رقم الهاتف فارغًا!" })
			return false
		}
	}

	phoneValid = () => {
		if (this.state.UserTelephone && this.state.carrier_code) {
			this.setState({ phoneErr: "" })
			return true
		} else {
			this.setState({ phoneErr: this.props.globals.store_locale === 'en'? 
			"Phone number should not be empty!":"يجب ألا يكون رقم الهاتف فارغًا!" })
			return false
		}
	}
	validateCountry = () => {
		if (this.state.UserCountry) {
			this.setState({ countryErr: "" })
			return true
		} else {
			this.setState({ countryErr: this.props.globals.store_locale === 'en'? 
			"Please select country!" :"يرجى تحديد البلد"})
			return false
		}
	}
	validateCity = () => {
		if (this.state.UserCity) {
			this.setState({ cityErr: "" })
			return true
		} else {
			this.setState({ cityErr: this.props.globals.store_locale === 'en'? 
			"Please select city!":"يرجى تحديد المدينة" })
			return false
		}
	}
	validateAddType = () => {
		if (this.state.AddressType) {
			this.setState({ addTypeErr: "" })
			return true
		} else {
			this.setState({ addTypeErr: "Please select Address Type!" })
			return false
		}
	}
	validateDefaultShipping = () => {
		if (this.state.DefaultShipping) {
			this.setState({ defaultShippingErr: "" })
			return true
		} else {
			this.setState({ defaultShippingErr: "Please select!" })
			return false
		}
	}
	onSave = () => {
		const payload = {
			addressId: this.state.addressId,
			UserId: this.props.account.user.id,
			UserFirstName: this.state.UserFirstName,
			UserLastName: this.state.UserLastName,
			store_id: this.props.globals.currentStore,
			WebsiteId:"1",
			//postcode: this.state.postcode,
			countryCode: this.state.UserCountry,
			carrier_code: this.state.carrier_code,
			UserTelephone: this.state.UserTelephone,
			UserStreet: this.state.UserStreet,
			UserCity: this.state.UserCity,
			UserRegionId: this.findCity(this.state.UserCity),
			UserCountry: this.state.UserCountry,
			DefaultBilling: 0,
			//DefaultShipping: this.state.DefaultShipping,
			//AddressType: this.state.AddressType,
		}
		const formInvalid = [
			this.validateFirstName(),
			this.validateLastName(),
			this.validateAddress(),
			//this.validateZipcode(),
			this.phoneValid(),
			this.validateCountry(),
			this.validateCity(),
			//this.validateAddType(),
			//this.validateDefaultShipping(),
		].includes(false)

		const payloadInvalid = Object.values(payload)
			.map((val) => val === null)
			.includes(true)
		if (!payloadInvalid && !formInvalid) {
			if (this.addressObj) {
			}
			payload.postcode = this.state.postcode ? this.state.postcode: "";
			payload.DefaultShipping = this.state.DefaultShipping ? this.state.DefaultShipping: "";
			payload.AddressType = this.state.AddressType ? this.state.AddressType: "";
			payload.companyName= this.state.companyName ?  this.state.companyName :"";
			payload.company= this.state.companyName ?  this.state.companyName :"";
			payload.customer_appartment= this.state.customer_appartment ? this.state.customer_appartment:"";
			this.props.onAddAddress(payload)
		}
	}

	findCity = (cityName) => {
		let id = '';
		this.state.city.forEach(city  => {
			if (cityName === city.name) {
				id = city.id;
			}
		});

		return id;
	}

	changeCountry = (e) => {
		if (e.target.value) {
			document.getElementById("UserCity").value = null
			if(this.props.countryList.length > 0) {
				const country = this.props.countryList.filter((country) => country.id === e.target.value)[0]
				this.setState({ city: country.available_regions })
		    }
		}
	}
	render() {
		const {formatMessage} = this.props.intl;
		const { store_locale } = this.props.globals
		let defaultPhoneNumber = {}
		if (this.state.isdefaultPhone) {
			defaultPhoneNumber = {
				...defaultPhoneNumber,
				carrier_code: this.state.carrier_code,
				contact_number: this.state.UserTelephone,
			}
		}
		const { addAddressLoader } = this.props.account
		if (addAddressLoader) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
		}
		return (
			<div>
				<div className="AddressInfo bg-white">
					<div id="login">
						<div className="">
							<div id="login-row" className="row justify-content-center align-items-center">
								<div id="login-column">
									<div id="login-box" className="col-md-12">
										<h1 className="main-title-sign"><FormattedMessage id="myAccountInfo.AddressInformation" defaultMessage="Address Information" /></h1>
										<Row>
											<Col xs="12" sm="6">
												<div className="form-group">
													<label for="Firstname"><FormattedMessage id="myAccountInfo.FirstName" defaultMessage="First Name" /> </label>
													<input
														type="text"
														className="form-control"
														name="UserFirstName"
														id="firstname"
														placeholder={formatMessage(messages.firstname)}
														value={this.state.UserFirstName}
														onInput={this.keyupChangeHandler}
														onBlur={this.validateFirstName}
													/>
													{this.state.firstNameErr && <span className="error">{this.state.firstNameErr}</span>}
												</div>
											</Col>
											<Col xs="12" sm="6">
												<div className="form-group">
													<label for="Firstlast"><FormattedMessage id="myAccountInfo.LastName" defaultMessage="Last Name" /> </label>
													<input
														type="text"
														className="form-control"
														name="UserLastName"
														id="lastname"
														placeholder={formatMessage(messages.lastname)}
														value={this.state.UserLastName}
														onInput={this.keyupChangeHandler}
														onBlur={this.validateLastName}
													/>
													{this.state.lastNameErr && <span className="error">{this.state.lastNameErr}</span>}
												</div>
											</Col>
										</Row>
										<div className="form-group">
											<div className="filter-group">
												<div className="select-side">
													<i className="glyphicon blue">
														{" "}
														<img src={minusIcon} alt="" className="Icon selectSortImg" />
													</i>
												</div>

												<label for="select" className="">
													<FormattedMessage id="myAccountInfo.SelectCountry" defaultMessage="Select Country" />
												</label>
												<select
													className="form-control filter-focus"
													name="UserCountry"
													id="UserCountry"
													onChange={(e) => {
														this.keyupChangeHandler(e)
														this.changeCountry(e)
													}}
													onBlur={this.validateCountry}
													value={this.state.UserCountry}>
													<option value="null" disabled selected hidden>
														{store_locale === 'en' ? "Select Country" : "إختر الدولة"}
													</option>
													{this.props.countryList.map((country) => {
														return (
															<option key={country.id} value={country.id}>
																{store_locale === "en" ? country.full_name_english : country.full_name_locale}
															</option>
														)
													})}
												</select>
												{this.state.countryErr && <span className="error">{this.state.countryErr}</span>}
											</div>
										</div>
										<div className="form-group">
											<div className="filter-group">
												<div className="select-side">
													<i className="glyphicon blue">
														{" "}
														<img src={minusIcon} alt="" className="Icon  selectSortImg" />
													</i>
												</div>
												<label for="select" className="">
													<FormattedMessage id="myAccountInfo.SelectCity" defaultMessage="Select City" />
												</label>
												<select
													className="form-control filter-focus"
													name="UserCity"
													id="UserCity"
													onChange={this.keyupChangeHandler}
													value={this.state.UserCity}
													onBlur={this.validateCity}>
													<option value="null" disabled selected hidden>
													{store_locale === 'en' ? "Select City" : "إختر المدينة"}
													</option>
													{this.state.city.map((c) => (
														<option key={c.id} value={c.name}>
															{c.name}
														</option>
													))}
												</select>
												{this.state.cityErr && <span className="error">{this.state.cityErr}</span>}
											</div>
										</div>
										<div className="form-group">
											<label for="name"> <FormattedMessage id="myAccountInfo.Address" defaultMessage="Address" /> </label>
											<input
												type="text"
												className="form-control"
												name="UserStreet"
												id="address"
												placeholder={formatMessage(messages.address	)}
												value={this.state.UserStreet}
												onInput={this.keyupChangeHandler}
												onBlur={this.validateAddress}
											/>
											{this.state.addressErr && <span className="error">{this.state.addressErr}</span>}
										</div>
										<div className="form-group">
											<label for="name"> <FormattedMessage id="shipping.Apt" defaultMessage="Apt / Suite (optional)" /> </label>
											<input
												type="text"
												className="form-control"
												name="customer_appartment"
												id="customer_appartment"
												placeholder={formatMessage(messages.apt	)}
												value={this.state.customer_appartment}
												onInput={this.keyupChangeHandler}
											/>
										</div>
										<div className="form-group">
											<label for="name"> <FormattedMessage id="shipping.CompanyName" defaultMessage="Company Name (optional)" /> </label>
											<input
												type="text"
												className="form-control"
												name="companyName"
												id="companyName"
												placeholder={formatMessage(messages.companyName	)}
												value={this.state.companyName}
												onInput={this.keyupChangeHandler}
											/>
										</div>
										<div className="form-group">
											<label for="phone"><FormattedMessage id="myAccountInfo.MobileNumber" defaultMessage="Mobile Number" /> </label>
											<PhoneNumber
												changed={this.contactNumber}
												isdefaultPhone={this.state.isdefaultPhone}
												defaultPhone={{ ...defaultPhoneNumber }}
											/>
											{this.state.phoneErr && <span className="error">{this.state.phoneErr}</span>}
										</div>
										<Row>
											<Col xs="12" sm="6">
												<div className="form-group">
													<label for="name"><FormattedMessage id="shipping.Zipcode" defaultMessage="P.O. Box" /> (<FormattedMessage id="optional" defaultMessage="Optional" />)</label>
													<input
														type="text"
														className="form-control"
														name="postcode"
														id="zipcode"
														placeholder={formatMessage(messages.pobox)}
														value={this.state.postcode}
														onInput={this.keyupChangeHandler}
														//onBlur={this.validateZipcode}
													/>
													{this.state.zipcodeErr && <span className="error">{this.state.zipcodeErr}</span>}
												</div>
											</Col>
											<Col xs="12" sm="6">
												&nbsp;
											</Col>
										</Row>

										<div className="form-group">
											<Row>
												<Col xs="12" sm="6">
													<div className="form-group">
														<label for="name" className="mb-0">
															{" "}
															<FormattedMessage id="myAccountInfo.AddressType" defaultMessage="Address Type" />
															&nbsp;(<FormattedMessage id="optional" defaultMessage="Optional" />)
														</label>
														<div className="custom-control custom-radio custom-control-inline">
															<input
																type="radio"
																className="custom-control-input"
																id="defaultInline1"
																name="AddressType"
																value="home"
																checked={this.state.AddressType === "home"}
																onChange={this.keyupChangeHandler}
															/>
															<label className="custom-control-label" for="defaultInline1">
																<FormattedMessage id="myAccountInfo.Home" defaultMessage="Home" />
															</label>
														</div>

														<div className="custom-control custom-radio custom-control-inline">
															<input
																type="radio"
																className="custom-control-input"
																id="defaultInline2"
																name="AddressType"
																value="work"
																checked={this.state.AddressType === "work"}
																onChange={this.keyupChangeHandler}
															/>
															<label className="custom-control-label" for="defaultInline2">
																<FormattedMessage id="myAccountInfo.Work" defaultMessage="Work" />
															</label>
														</div>
														{this.state.addTypeErr && <span className="error">{this.state.addTypeErr}</span>}
													</div>
												</Col>
												<Col xs="12" sm="6">
													<div className="form-group">
														<label for="name" className="mb-0">
															{" "}
															<FormattedMessage id="myAccountInfo.PrimaryAddress" defaultMessage="Primary Address ?" />
															&nbsp;(<FormattedMessage id="optional" defaultMessage="Optional" />)
														</label>
														<div className="custom-control custom-radio custom-control-inline">
															<input
																type="radio"
																className="custom-control-input"
																id="DefaultShipping1"
																name="DefaultShipping"
																value="1"
																checked={this.state.DefaultShipping === "1"}
																onChange={this.keyupChangeHandler}
															/>
															<label className="custom-control-label" for="DefaultShipping1">
																<FormattedMessage id="myAccountInfo.Yes" defaultMessage="Yes" />
															</label>
														</div>

														<div className="custom-control custom-radio custom-control-inline">
															<input
																type="radio"
																className="custom-control-input"
																id="DefaultShipping2"
																name="DefaultShipping"
																value="0"
																checked={this.state.DefaultShipping === "0"}
																onChange={this.keyupChangeHandler}
															/>
															<label className="custom-control-label" for="DefaultShipping2">
																<FormattedMessage id="myAccountInfo.No" defaultMessage="No" />
															</label>
														</div>
														{this.state.defaultShippingErr && (
															<span className="error">{this.state.defaultShippingErr}</span>
														)}
													</div>
												</Col>
											</Row>
										</div>
										<div className="ButtonDivEdit">
											<button className="cancelbtn" onClick={() => this.props.onClose(false)}>
												<FormattedMessage id="myAccountInfo.Cancel" defaultMessage="Cancel" />
											</button>
											<button className="okbtn" onClick={this.onSave}>
												<FormattedMessage id="myAccountInfo.SaveAddress" defaultMessage="Save Address" />
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
		countryList: state.country.countryList,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onAddAddress: (payload) => dispatch(actions.AddAddress(payload)),
		onGetCountryLists: (payload) => dispatch(actions.getCountryList(payload)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(AddressInfo)))
