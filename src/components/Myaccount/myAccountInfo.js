import React, { Suspense, Component } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { FormattedMessage, injectIntl } from "../../../node_modules/react-intl"
import * as actions from "../../redux/actions/index"
import $ from "jquery"
// import AvtarL from "../../../src/assets/images/icons/avtarL.svg"
// import AvtarR from "../../../src/assets/images/icons/avtarR.svg"
// import AvatarMy from "../../../src/assets/images/icons/avatarMy.png"
// import nickEdit from "../../../src/assets/images/icons/nickEdit.svg"
// import MyAccSideBar from "../Myaccount/MyAccSideBar"
import Modal from "react-responsive-modal"
// import DeleteAddess from "../Myaccount/deleteAddess"
// import EditAccount from "../Myaccount/editAccount"
// import ChangePassword from "../Myaccount/changePassword"
import Spinner2 from "../Spinner/Spinner"
// import AddressInfo from "../Myaccount/addressInfo"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import avtar1 from "../../../src/assets/AvtarImages/avtar1.png"
import avtar2 from "../../../src/assets/AvtarImages/avtar2.png"
import avtar3 from "../../../src/assets/AvtarImages/avtar3.png"
import avtar4 from "../../../src/assets/AvtarImages/avtar4.png"
import avtar5 from "../../../src/assets/AvtarImages/avtar5.png"
import avtar6 from "../../../src/assets/AvtarImages/avtar6.png"
import avtar7 from "../../../src/assets/AvtarImages/avtar7.png"
import avtar8 from "../../../src/assets/AvtarImages/avtar8.png"
// import AddBagAlert from "../../common/AlertBox/addToBagAlert"
import { createMetaTags } from '../utility/meta'
const MyAccSideBar = React.lazy(() => import('../Myaccount/MyAccSideBar'));
const DeleteAddess = React.lazy(() => import('../Myaccount/deleteAddess'));
const EditAccount = React.lazy(() => import('../Myaccount/editAccount'));
const ChangePassword = React.lazy(() => import('../Myaccount/changePassword'));
const AddressInfo = React.lazy(() => import('../Myaccount/addressInfo'));
const AddBagAlert = React.lazy(() => import('../../common/AlertBox/addToBagAlert'));

let avtarImage
let setAvtarImageFromAPI
let avatarName
avtarImage = [
	{
		image: avtar1,
		name: "avtar1",
	},
	{
		image: avtar2,
		name: "avtar2",
	},
	{
		image: avtar3,
		name: "avtar3",
	},
	{
		image: avtar4,
		name: "avtar4",
	},
	{
		image: avtar5,
		name: "avtar5",
	},
	{
		image: avtar6,
		name: "avtar6",
	},
	{
		image: avtar7,
		name: "avtar7",
	},
	{
		image: avtar8,
		name: "avtar8",
	},
]
class MyaccountInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			registerMessage: "",
			changePassModel: false,
			deleteModel: false,
			deleteAddessId: null,
			infoModel: false,
			addressModel: false,
			addressObj: null,
			avtarindex: 0,

			addMessagePopup: false,
			addMessage: "",

			removeApi: false,
		}
		this.userUpdatePayload = {}
	}
	closePassModal = () => {
		this.setState({ changePassModel: false })
	}

	closeAddressModal = (param) => {
		this.setState({ addressModel: false })
		if (param) {
			const payload2 = {
				customerid: this.props.login.customer_id,
			}
			this.props.onGetAddressBook(payload2)
		}
	}

	closeDeleteModel = (param) => {
		this.setState({ deleteModel: false })
		if (param) {
			const payload2 = {
				customerid: this.props.login.customer_id,
			}
			this.props.onGetAddressBook(payload2)
		}
	}
	callRemove = (state) => {
		this.setState({
			removeApi: state,
		})
	}

	closeInfoModal = (value) => {
		this.setState({ infoModel: false })
		if (value === "true") {
			this.setState({ infoModel: false })
		}
	}

	editBtn = () => {
		document.getElementById("lArr").style.display = "block"
		document.getElementById("rArr").style.display = "block"
		document.getElementById("editIcon").style.display = "none"
	}

	componentWillMount() {
		if (!this.props.login.customer_id) {
			this.props.history.push(`/${this.props.globals.store_locale}/login`)
			return
		}
		if (this.props.registerData.message) {
			this.setState({
				addMessagePopup: true,
				addMessage: this.props.registerData.message,
			})
			this.props.registerData.message = ""
		}
		const payload = {
			url_key: this.props.login.customer_id,
		}
		this.props.onGetAccountPageData(payload)
		const payload2 = {
			customerid: this.props.login.customer_id,
		}
		this.props.onGetAddressBook(payload2)
	}

	componentWillReceiveProps(nextProps) {
		//edit toaster message
		if (nextProps.account.user) {
			if (nextProps.account.user.status) {
				this.setState({
					addMessagePopup: true,
					addMessage:
						this.props.globals.store_locale === "en"
							? "Customer details updated successfully"
							: "تم تحديث بيانات العميل بنجاح	",
				})
				this.closeInfoModal("true")

				nextProps.account.user.status = false
			} else {
				if (nextProps.account.updateErr) {
					this.setState({
						addMessagePopup: true,
						addMessage: nextProps.account.updateErr.message,
					})
					this.closeInfoModal("true")
					nextProps.account.updateErr = null
				}
			}
		}
		//edit toaster message

		//change password toaster message
		if (nextProps.account.changePasswordData) {
			if (nextProps.account.changePasswordData.status) {
				this.setState({
					addMessagePopup: true,
					addMessage:
						this.props.globals.store_locale === "en" ? "Password updated successfully" : "تم تحديث كلمة المرور بنجاح",
				})
				this.closePassModal()
			} else {
				this.setState({
					addMessagePopup: true,
					addMessage:
						this.props.globals.store_locale === "en" ? "Old password doesn't match" : "كلمة المرور القديمة غير مطابقة",
				})
				this.closePassModal()
			}
			nextProps.account.changePasswordData = ""
		}
		//change password toaster message

		//add edit address toaster message 599
		if (nextProps.account.addAddressData && nextProps.account.addAddressData.message) {
			if (nextProps.account.addAddressData.status) {
				this.setState({
					addMessagePopup: true,
					addMessage: nextProps.account.addAddressData.message,
				})
				this.closeAddressModal(true)
			} else {
				this.setState({
					addMessagePopup: true,
					addMessage: nextProps.account.addAddressData.message,
				})
				this.closeAddressModal(false)
			}
			nextProps.account.addAddressData = {}
		}
		//add edit address toaster message

		//delete address toaster message
		if (nextProps.account.deleteAddressData && this.state.removeApi) {
			if (nextProps.account.deleteAddressData.message && this.state.removeApi) {
				this.setState({
					removeApi: false,
					addMessagePopup: true,
					addMessage: this.props.globals.store_locale === "en" ? "You deleted the address." : " لقد حذفت العنوان ",
				})
				this.closeDeleteModel()
			}
			nextProps.account.deleteAddressData = ""
		}
		//delete address toaster message	this.closeDeleteModel
	}

	componentDidMount() {
		//register toaster message
		if (this.props.location.state) {
			if (this.props.location.state.registerData && this.props.location.state.registerData.status) {
				this.setState({
					addMessagePopup: true,
					addMessage: this.props.location.state.registerData.message,
				})
			}
			//nextProps.registerData.message = ""
		}
		//register toaster message
		$("#myInfo").addClass("ActiveClass")
		if (this.props.account.user && this.props.location.state && this.props.location.state.openEdit) {
			this.setState({ infoModel: true })
		}
	}

	clearRegisterMessage = () => {
		setTimeout(() => {
			this.setState({ registerMessage: "" })
		}, 5000)
	}

	logout = () => {
		this.props.onLogoutUser()
		this.props.history.push(`/${this.props.globals.store_locale}/home`)
	}

	nextClick = () => {
		if (this.state.avtarindex !== avtarImage.length - 1) {
			const currentindex = this.state.avtarindex
			this.setState(
				{ avtarindex: currentindex + 1 },
				() => (document.getElementById("avtarimage").src = avtarImage[this.state.avtarindex].image)
			)
		}
	}
	prevClick = () => {
		if (this.state.avtarindex !== 0) {
			const currentindex = this.state.avtarindex
			this.setState(
				{ avtarindex: currentindex - 1 },
				() => (document.getElementById("avtarimage").src = avtarImage[this.state.avtarindex].image)
			)
		}
	}
	closeAddBag = () => {
		this.setState({
			addMessagePopup: false,
		})
	}

	render() {
		let alertBox = null
		if (this.state.addMessagePopup) {
			alertBox = <AddBagAlert message={this.state.addMessage} alertBoxStatus={true} closeBox={this.closeAddBag} />
		}

		avtarImage.map((item, index) => {
			if (
				this.props.account &&
				this.props.account.AddressBookData &&
				this.props.account.AddressBookData.avatar &&
				this.props.account.AddressBookData.avatar === item.name
			) {
				setAvtarImageFromAPI = item.image
				avatarName = item.name
			}
		})

		const { account } = this.props
		const { user } = this.props.account
		const { AddressBookData } = this.props.account
		return (
			<div>
			{createMetaTags(
					this.props.globals.store_locale === "en"
						? "My Account | Official LEGO® Online Store Saudi Arabia"
						: "حساب ليجو الخاص بك | متجر ليغو أونلاين الرسمي بالسعودية ",
					this.props.globals.store_locale === "en"
						? "Explore the world of LEGO® through games, videos, products and more! Shop awesome LEGO® building toys and brick sets and find the perfect gift for your kid"
						: "اكتشف عالم ليغو LEGO من خلال الألعاب، والفيديوهات، والمنتجات وأكثر! تسوق مجموعات ألعاب البناء و المكعبات المدهشة من ليغو LEGO واعثر على الهدية المثالية لطفلك",
					this.props.globals.store_locale === "en"
						? "LEGO, Online Store, Saudi Arabia, Bricks, Building Blocks, Construction Toys, Gifts"
						: "ليغو LEGO، تسوق اونلاين، السعودية، مكعبات، مكعبات بناء، العاب تركيب، هدايا"
				)}
				<Suspense fallback={<div></div>}>
				<div className="MyaccountInfo">
					<ToastContainer />
					{/* <LogoSlider /> */}
					<div className="row">
						<div className="col-md-3 sideBarContent">
							<MyAccSideBar userName={user && user.firstname + " " + user.lastname} />
						</div>

						<div className="col-md-9 pd-0">
							{alertBox}
							{this.clearRegisterMessage()}
							<div className="rightSideContent">
								<div className="row">
									<div className="col-md-6 col-6">
										<p className="accountTitle">
											<FormattedMessage id="myAccountInfo.Account" defaultMessage="Account" />
										</p>
									</div>
									<div className="col-md-6 col-6">
										<div className="LogOutDiv">
											<button className="" onClick={() => this.logout()}>
												<FormattedMessage id="myAccountInfo.Logout" defaultMessage="Logout" />
											</button>
										</div>
									</div>
								</div>
								{account.accountLoader ? (
									<Spinner2 />
								) : (
									<div className="row">
										<div className="col-md-5">
											{user && user.custom_attributes && (
												<div className="InputField">
													<form>
														<div className="avtarDiv">
															<p className="avtarText">
																<FormattedMessage id="myAccountInfo.Avtar" defaultMessage="Avtar" />
															</p>
															<ul className="list-inline">
																{/* <li
																	style={this.state.avtarindex === 0 ? { opacity: "0.5" } : {}}
																	onClick={() => this.prevClick()}
																	className="list-inline-item">
																	<img className="arrow" src={AvtarL} alt="avtarL" />
																</li> */}
																<li className="list-inline-item">
																	<div className="avtarImage">
																		<img
																			id="avtarimage"
																			className="avtarImg"
																			src={
																				this.props.account.AddressBookData.avatar === null
																					? avtar1
																					: setAvtarImageFromAPI
																			}
																			alt="AvatarMy"
																		/>
																	</div>
																</li>
																{/* <li
																	style={this.state.avtarindex === avtarImage.length - 1 ? { opacity: "0.5" } : {}}
																	onClick={() => this.nextClick()}
																	className="list-inline-item">
																	<img className="arrow" src={AvtarR} alt="avtarR" />
																</li> */}
															</ul>
														</div>
														{/* <div className="form-group">
													<label for="FName" className="">
														Nickname
													</label>
													<div className="form-group">
														<input
															readonly=""
															name="FName"
															id="FName"
															type="text"
															className="form-control nickName"
															value="LastGraciousDandelion"
														/>
														<img
															onClick={() => this.editBtn()}
															id="editIcon"
															className="editImg"
															src={nickEdit}
															alt="nickEdit"
														/>
														<img id="lArr" className="ImageLeft" src={AvtarL} alt="avtarL" />
														<img id="rArr" className="ImageRight" src={AvtarR} alt="avtarR" />
													</div>
												</div> */}
														<div className="row">
															<div className="col-md-6">
																<div className="form-group">
																	<label for="FName" className="">
																		<FormattedMessage id="myAccountInfo.FirstName" defaultMessage="First Name" />
																	</label>
																	<div className="form-group">
																		<input
																			readonly=""
																			name="FName"
																			id="FName"
																			type="text"
																			className="form-control"
																			value={user.firstname}
																		/>
																	</div>
																</div>
															</div>
															<div className="col-md-6">
																<div className="form-group">
																	<label for="LName" className="">
																		<FormattedMessage id="myAccountInfo.LastName" defaultMessage="Last Name" />
																	</label>
																	<div className="form-group">
																		<input
																			readonly=""
																			name="LName"
																			id="LName"
																			type="text"
																			className="form-control"
																			value={user.lastname}
																		/>
																	</div>
																</div>
															</div>
														</div>
														<div className="form-group">
															<label for="bdate" className="">
																<FormattedMessage id="myAccountInfo.dob" defaultMessage="Date Of Birth" />
															</label>
															<div className="form-group">
																<input
																	readonly=""
																	name="bdate"
																	id="bdate"
																	type="text"
																	className="form-control"
																	value={user.dob}
																/>
															</div>
														</div>
														<div className="form-group">
															<label for="Email" className="">
																<FormattedMessage id="myAccountInfo.Email" defaultMessage="Email" />
															</label>
															<div className="form-group">
																<input
																	readonly=""
																	name="Email"
																	id="Email"
																	type="email"
																	className="form-control"
																	value={user.email}
																/>
															</div>
														</div>
														<div className="form-group">
															<label for="phone" className="">
																<FormattedMessage id="myAccountInfo.Phone" defaultMessage="Phone" />
															</label>
															<div className="form-group">
																<input
																	readonly=""
																	name="phone"
																	id="phone"
																	type="text"
																	className="form-control"
																	value={user.custom_attributes[0].value}
																/>
															</div>
														</div>
														<p className="editAddress mb-2" onClick={() => this.setState({ infoModel: true })}>
															<FormattedMessage id="myAccountInfo.EditAccount" defaultMessage="Edit" />
														</p>
														<div className="form-group">
															<label for="password" className="">
																<FormattedMessage id="myAccountInfo.Password" defaultMessage="Password" />
															</label>
															<div className="form-group">
																<input
																	readonly=""
																	name="password"
																	id="password"
																	type="password"
																	className="form-control"
																	value="********"
																/>
															</div>
														</div>
														<p className="editAddress" onClick={() => this.setState({ changePassModel: true })}>
															<FormattedMessage id="myAccountInfo.ChangePassword" defaultMessage="Change Password" />
														</p>
													</form>
												</div>
											)}
										</div>
										<div className="col-md-7 pd-0">
											{account.AddressBookLoader ? (
												<Spinner2 />
											) : (
												AddressBookData && <div className="AddressDiv">
													<div className="row">
														<div className="col-6 col-md-8 alignRight">
															<p className="AddLabel">
																<FormattedMessage id="myAccountInfo.AddressBook" defaultMessage="Address Book" />
															</p>
														</div>
														<div className="col-6 col-md-4 editAlignProfile">
															<p
																className="editAddress"
																onClick={() => this.setState({ addressModel: true, addressObj: null })}>
																<FormattedMessage id="myAccountInfo.AddAddress" defaultMessage="Add Address" />
															</p>
														</div>
													</div>

													{AddressBookData.addressData && AddressBookData.addressData.length === 0 && (
														<div className="row">
															<div className="col-8">
																<p className="AddressText">
																	<FormattedMessage
																		id="myAccountInfo.addAddressMsg"
																		defaultMessage="No address in address book, Please add one."
																	/>
																</p>
															</div>
														</div>
													)}

													{AddressBookData.addressData &&
														AddressBookData.addressData.map((address) => {
															let userAddress = `${address.street}  ${
																address.customer_appartment ? address.customer_appartment : ""
															} ${address.company ? address.company : ""}  ${address.city} ${
																address.postcode
																	? (this.props.globals.store_locale === "en" ? "P.O. Box " : "الرمز البريدي ") +
																	  address.postcode
																	: ""
															}`
															return (
																<div>
																	<div className="row">
																		<div className="col-8">
																			<p className="AddressText">{userAddress}</p>
																		</div>
																	</div>
																	<div className="row matop">
																		<div className="col-8 alignRight">
																			<p
																				className="editAddress"
																				onClick={() => this.setState({ addressModel: true, addressObj: address })}>
																				<FormattedMessage id="myAccountInfo.Edit" defaultMessage="Edit" />
																			</p>
																		</div>
																		<div className="col-4 alignRight">
																			<p
																				className="editAddress"
																				onClick={() =>
																					this.setState({ deleteModel: true, deleteAddessId: address.Id })
																				}>
																				<FormattedMessage id="myAccountInfo.Delete" defaultMessage="Delete" />
																			</p>
																		</div>
																	</div>
																</div>
															)
														})}
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{this.state.changePassModel ? (
						<div>
							<Modal modalId="changePassModel" open={this.state.changePassModel} onClose={this.closePassModal}>
								{/* <div className="sInModel ">Account</div> */}
								<div className="modal-body">
									<div className="container-fluid nopadding">
										<ChangePassword onClose={this.closePassModal} />
									</div>
								</div>
							</Modal>
						</div>
					) : (
						""
					)}

					{this.state.infoModel ? (
						<div>
							<Modal modalId="changeInfoModel" open={this.state.infoModel} onClose={this.closeInfoModal}>
								{/* <div className="sInModel ">Account</div> */}
								<div className="modal-body">
									<div className="container-fluid nopadding">
										<EditAccount
											setAvtarImageNameAPI={avatarName}
											setAvtarImageFromAPI={setAvtarImageFromAPI}
											useredit={this.props.account.user}
											closeInfoModal={this.closeInfoModal}
										/>
									</div>
								</div>
							</Modal>
						</div>
					) : (
						""
					)}

					{this.state.addressModel ? (
						<div>
							<Modal
								modalId="changeAddressModel"
								open={this.state.addressModel}
								onClose={(param) => this.closeAddressModal(false)}>
								{/* <div className="sInModel ">Account</div> */}
								<div className="modal-body">
									<div className="container-fluid nopadding">
										<AddressInfo addressObj={this.state.addressObj} onClose={this.closeAddressModal} />
									</div>
								</div>
							</Modal>
						</div>
					) : (
						""
					)}

					{this.state.deleteModel ? (
						<div>
							<Modal
								modalId="deleteModel"
								open={this.state.deleteModel}
								onClose={(param) => this.closeDeleteModel(false)}>
								{/* <div className="sInModel ">Account</div> */}
								<div className="modal-body">
									<div className="container-fluid nopadding">
										<DeleteAddess
											deleteAddessId={this.state.deleteAddessId}
											onClose={this.closeDeleteModel}
											callRemove={this.callRemove}
										/>
									</div>
								</div>
							</Modal>
						</div>
					) : (
						""
					)}
				</div>
				</Suspense>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		login: state.login.customer_details,
		account: state.account,
		registerData: state.login.registerUserDetails,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGetAccountPageData: (payload) => dispatch(actions.getAccountPageData(payload)),
		onGetAddressBook: (payload) => dispatch(actions.getAddressBook(payload)),
		onLogoutUser: () => dispatch(actions.logoutUser()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(MyaccountInfo)))
