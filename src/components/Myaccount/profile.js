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
import { createMetaTags } from '../utility/meta';

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
				{createMetaTags(
							this.props.globals.store_locale === "en"
								? "Profile | Official LEGO® Online Profi Saudi Arabia"
								: "الملف الخاص بي | متجر ليغو أونلاين الرسمي بالسعودية",
							this.props.globals.store_locale === "en"
								? "Explore the world of LEGO® through games, videos, products and more! Shop awesome LEGO® building toys and brick sets and find the perfect gift for your kid"
								: "اكتشف عالم ليغو LEGO من خلال الألعاب، والفيديوهات، والمنتجات وأكثر! تسوق مجموعات ألعاب البناء و المكعبات المدهشة من ليغو LEGO واعثر على الهدية المثالية لطفلك",
							this.props.globals.store_locale === "en"
								? "LEGO, Online Store, Saudi Arabia, Bricks, Building Blocks, Construction Toys, Gifts"
								: "ليغو LEGO، تسوق اونلاين، السعودية، مكعبات، مكعبات بناء، العاب تركيب، هدايا"
						)}
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
										<div className="col-md-3 col-6 col-sm-6 col-lg-3">
											<div className="myInfo">
												<Link to={`/${store_locale}/myaccount-info`}>
													<img className="avtarImg" src={infoIcon} alt="infoIcon" />
												</Link>
											</div>
											<p>
												<span><FormattedMessage id="MyAccSideBar.MyInfo" defaultMessage="My Info" /></span>
											</p>
										</div>
										<div className="col-md-3 col-6 col-sm-6 col-lg-3">
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
										<div className="col-md-3 col-6 col-sm-6 col-lg-3">
											<div className="myInfo">
											<Link to={`/${store_locale}/wishlist`}><img className="wishlist" src={wishlist} alt="infoIcon" /></Link>
											
											</div>
											<p><span><FormattedMessage id="MyAccSideBar.MyWishlist" defaultMessage="My Wishlist" /></span></p>
										</div>
										<div className="col-md-3 col-6 col-sm-6 col-lg-3">
											<div className="myInfo">
                        <Link to={`/${store_locale}/saveCards`}>
                          <svg
                            version="1.1"
                            id="Outline"
                            x="0px"
                            y="0px"
                            width="70px"
                            height="70px"
                            viewBox="0 0 20 20"
							style={{fill:"#036eb8"}}>
                            <g>
                              <path
                                class="st0"
                                d="M18.3,16.63H1.7c-0.91,0-1.64-0.74-1.65-1.65V5.02c0-0.91,0.74-1.64,1.65-1.65h16.6   c0.91,0,1.64,0.74,1.64,1.65v9.96C19.94,15.89,19.21,16.62,18.3,16.63z M1.7,4.01c-0.56,0-1.01,0.45-1.01,1.01v9.96   c0,0.56,0.45,1.01,1.01,1.01h16.6c0.56,0,1.01-0.45,1.01-1.01V5.02c0-0.56-0.45-1.01-1.01-1.01H1.7z"></path>
                              <path
                                class="st0"
                                d="M2.84,7.87c-0.37,0-0.67-0.3-0.67-0.67V6.16c0-0.37,0.3-0.67,0.67-0.67h1.04c0.37,0,0.67,0.3,0.67,0.67V7.2   c0,0.37-0.3,0.67-0.67,0.67H2.84z M2.47,7.2c0,0.2,0.17,0.37,0.37,0.37h1.04c0.2,0,0.37-0.17,0.37-0.37V6.83H3.88   c-0.08,0-0.15-0.07-0.15-0.15S3.8,6.53,3.88,6.53h0.37V6.16c0-0.2-0.17-0.37-0.37-0.37H2.84c-0.2,0-0.37,0.17-0.37,0.37v0.37h0.37   c0.08,0,0.15,0.07,0.15,0.15S2.92,6.83,2.84,6.83H2.47V7.2z"></path>
                              <path
                                class="st0"
                                d="M2.36,12.66c-0.11,0-0.19-0.09-0.19-0.19s0.09-0.19,0.19-0.19h4.98c0.11,0,0.19,0.09,0.19,0.19   s-0.09,0.19-0.19,0.19H2.36z"></path>
                              <path
                                class="st0"
                                d="M2.36,13.98c-0.11,0-0.19-0.09-0.19-0.19c0-0.11,0.09-0.19,0.19-0.19H9c0.11,0,0.19,0.09,0.19,0.19   S9.11,13.98,9,13.98l0,0L2.36,13.98z"></path>
                              <path
                                class="st0"
                                d="M16.43,14.65c-0.27,0-0.53-0.07-0.76-0.2L15.6,14.4l-0.07,0.04c-0.23,0.13-0.49,0.2-0.76,0.2   c-0.27,0-0.53-0.07-0.76-0.2c-0.35-0.2-0.6-0.53-0.71-0.92c-0.11-0.39-0.05-0.8,0.15-1.15c0.27-0.47,0.78-0.76,1.32-0.76   c0.27,0,0.53,0.07,0.76,0.2l0.07,0.04l0.07-0.04c0.23-0.13,0.49-0.2,0.76-0.2c0.27,0,0.53,0.07,0.76,0.2   c0.35,0.2,0.6,0.53,0.71,0.92c0.1,0.39,0.05,0.8-0.15,1.15C17.48,14.36,16.97,14.65,16.43,14.65z M16.43,11.99   c-0.12,0-0.23,0.02-0.34,0.05l-0.18,0.06l0.11,0.16c0.36,0.52,0.36,1.22,0,1.74l-0.11,0.16l0.18,0.06   c0.11,0.04,0.23,0.05,0.34,0.05c0.3,0,0.59-0.12,0.8-0.33c0.21-0.21,0.33-0.5,0.33-0.8c0-0.12-0.02-0.23-0.05-0.34   C17.36,12.31,16.93,11.99,16.43,11.99z M14.77,11.99c-0.63,0-1.13,0.51-1.14,1.14c0,0.63,0.51,1.14,1.14,1.14   c0.63,0,1.14-0.51,1.14-1.14S15.4,11.99,14.77,11.99L14.77,11.99z"></path>
                              <path
                                class="st0"
                                d="M2.36,10c-0.11,0-0.19-0.09-0.19-0.19s0.09-0.19,0.19-0.19h1.99c0.11,0,0.19,0.09,0.19,0.19S4.46,10,4.36,10   H2.36z"></path>
                              <path
                                class="st0"
                                d="M6.35,10c-0.11,0-0.19-0.09-0.19-0.19s0.09-0.19,0.19-0.19h1.99c0.11,0,0.19,0.09,0.19,0.19S8.45,10,8.34,10   H6.35z"></path>
                              <path
                                class="st0"
                                d="M10.33,10c-0.11,0-0.19-0.09-0.19-0.19s0.09-0.19,0.19-0.19h1.99c0.11,0,0.19,0.09,0.19,0.19   S12.43,10,12.32,10H10.33z"></path>
                              <path
                                class="st0"
                                d="M14.32,10c-0.11,0-0.19-0.09-0.19-0.19s0.09-0.19,0.19-0.19h1.99c0.11,0,0.19,0.09,0.19,0.19   S16.41,10,16.31,10H14.32z"></path>
                            </g>
                          </svg>
                        </Link>
											</div>
											<p><span><FormattedMessage id="myAccountInfo.saveCards" defaultMessage="Credit/Debit Card" /></span></p>
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
