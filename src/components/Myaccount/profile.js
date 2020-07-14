import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import infoIcon from '../../../src/assets/images/523788.svg';
import truck from '../../assets/images/icons/orderStatusImg.png';
import wishlist from '../../assets/images/icons/wishlist.png';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';
import * as actions from "../../redux/actions/index"
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';

import MyAccSideBar  from '../Myaccount/MyAccSideBar';
class Profile extends Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		if (!this.props.login.customer_id) {
			this.props.history.push(`/${this.props.globals.store_locale}/login`)
			return
		}
	}
	logout = () => {
		this.props.onLogoutUser()
		this.props.history.push(`/${this.props.globals.store_locale}/home`)
	}
	componentDidMount() {
		$("#profile").addClass("ActiveClass")
	}
	render() {
		const store_locale = this.props.globals.store_locale
		return (
			<div>
				<div className="profile">
					<div className="row">
						<div className="col-md-3 sideBarContent">
							<MyAccSideBar />
						</div>
						<div className="col-md-9 pd-0">
							<div className="rightSideContent">
								<div className="row mBottom">
									<div className="col-md-6">
										<p className="accountTitle">&nbsp;</p>
									</div>
									<div className="col-md-6">
										<div className="LogOutDiv">
											<button className="" onClick={this.logout}><FormattedMessage id="profile.Logout.Title" defaultMessage="Logout" /></button>
										</div>
									</div>
								</div>
								<div className="profileList">
									<div className="row">
										<div className="col-md-4 col-6 col-sm-6 col-lg-4">
											<div className="myInfo">
												<Link to={`/${store_locale}/myaccount-info`}>
													<img className="avtarImg" src={infoIcon} alt="infoIcon" />
												</Link>
											</div>
											<p>
												<span><FormattedMessage id="MyAccSideBar.MyInfo" defaultMessage="My Info" /></span>
											</p>
										</div>
										<div className="col-md-4 col-6 col-sm-6 col-lg-4">
											<div className="myInfo">
												<Link to={`/${store_locale}/myOrder`}>
													<img className="avtarImg" src={truck} alt="order" />
												</Link>
											</div>
											<p>
												<span><FormattedMessage id="MyAccSideBar.MyOrder" defaultMessage="My Order" /></span>
											</p>
										</div>
										{/* <div className="col-md-4 col-6 col-sm-6 col-lg-3">
                        <div className="myInfo">
                            <a href=""><img className="avtarImg" src={infoSign} alt="infoIcon" /></a>
                        </div>
                        <p><span>My Sizes</span></p>
                    </div> */}
                    <div className="col-md-4 col-6 col-sm-6 col-lg-4">
                        <div className="myInfo">
                        <Link to={`/${store_locale}/wishlist`}><img className="wishlist" src={wishlist} alt="infoIcon" /></Link>
                           
                        </div>
                        <p><span><FormattedMessage id="MyAccSideBar.MyWishlist" defaultMessage="My Wishlist" /></span></p>
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

const mapStateToProps = state => {
    return {
      globals: state.global,
      login : state.login.customer_details,
    };
 }
 const mapDispatchToProps = dispatch => {
 return {
      onLogoutUser: () => dispatch(actions.logoutUser()),
 }
 }
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Profile)));
