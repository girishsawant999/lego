import React, { Component } from "react"
import $ from "jquery"
import { FormattedMessage, injectIntl } from "../../../node_modules/react-intl"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { isMobile } from "react-device-detect"
class MyAccSideBar extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let locate = ""
		let url = this.props.history.location.pathname
		url = url.split("/")
		locate = url[url.length-1]
		const store_locale = this.props.globals.store_locale
		const {user} = this.props.account
		return (
			<div>
				<div className="sideBarContent">
					<div className="profileSidebar">
						<div className="profile-side-bar">
							<p className="headingTitle">
								<Link to={`/${store_locale}/profile`}>
								<FormattedMessage id="myAccountInfo.myProfile" defaultMessage="My Profile" />
								</Link>
							</p>

							<ul className="sidebar-links">
								<li id="profile" className="">
									{user ?
									   (<Link to={`/${store_locale}/profile`}>
									    <FormattedMessage id="myAccountInfo.hi" defaultMessage="Hi" />&nbsp; 
										{user.firstname} {user.lastname}
                    {isMobile && locate !== "profile" && <i class="fa fa-caret-up ml-2 mr-2" aria-hidden="true"></i> }</Link>)
								 	:  (<Link to={`/${store_locale}/profile`}>
										<FormattedMessage id="myAccountInfo.hi" defaultMessage="Hi" />&nbsp; 
										{this.props.login.customer_details.firstname} {this.props.login.customer_details.lastname}
                    {isMobile && locate !== "profile" && <i class="fa fa-caret-up ml-2 mr-2" aria-hidden="true"></i> }</Link>)
									}
								</li>
								<li id="myInfo" className="mobHide">
									<Link to={`/${store_locale}/myaccount-info`}>
									<FormattedMessage id="myAccountInfo.myInfo" defaultMessage="My Info" />
									</Link>
								</li>
								<li id="myOrder" className="mobHide">
									<Link to={`/${store_locale}/myOrder`}>
									<FormattedMessage id="myAccountInfo.myOrder" defaultMessage="My Order" />
									</Link>
								</li>
								<li id="MyWishlist" className="mobHide">
									<Link to={`/${store_locale}/wishlist`}>
									<FormattedMessage id="myAccountInfo.myWishlist" defaultMessage="My Wishlist" />
									</Link>
								</li>
								<li id="saveCards" className="mobHide">
									<Link to={`/${store_locale}/saveCards`}>
									<FormattedMessage id="myAccountInfo.saveCards" defaultMessage="Credit/Debit Card" />
									</Link>
								</li>
							</ul>
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
		login : state.login,
		account: state.account,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(MyAccSideBar)))
