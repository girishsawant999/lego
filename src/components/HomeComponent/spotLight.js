import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.css"
import Radium from "radium"
import { Link } from "react-router-dom"
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isMobile } from "react-device-detect"


class LogoSlider extends Component {
	constructor(props) {
		super(props)
		this.data = this.props.data
	}

	render() {
		if (this.data && Object.keys(this.data).length > 0) {
			const btnStyle = {
				backgroundColor: this.data.btncolor,
				color: this.data.btntextcolor,
				":hover": {
					backgroundColor: this.data.btnhover,
					color: this.data.btntextcolorhover,
				},
			}
			const { store_locale } = this.props.globals
			return (
				<div class="bannerFullwidth">
				<div class="container-fluid">
					<div className="spotLight">
						<div className="row colReverse">
							<div className="col-lg-6 column leftBack col-md-6" style={{ backgroundColor: this.data.bgcolor }}>
								<div className="spotLeft"
							style={ { backgroundColor: this.data.bgcolormobile }}>
									<div className="bannerContent" style={!isMobile ? { textAlign:  this.data.bannercontentalignment}: {}}>
										<p className="headingTitle" style={{ color: this.data.headingcolor }}>
											{this.data.heading}
										</p>
										<p className="headingText" style={{ color: this.data.desccolor }}>
											{this.data.description}
										</p>
										<div className="buttonDiv">
											<Link to={`/${store_locale}/productdetails/${this.data.redirection}`}>
												<button type="button" id="shopBtn" className="whiteButton" style={btnStyle}>
													{this.data.btntext}
													<svg
														id="arrow"
														width="16"
														height="16"
														className="LinkWithChevron__StyledChevron-s8q0kp-1 ifWWhX Chevron__ChevronIcon-sc-1q2x5f4-0 bgViWV"
														viewBox="0 0 18 28"
														aria-hidden="true"
														data-di-res-id="3cc88b0b-59653321"
														data-di-rand="1590741222426">
														<path d="M1.825 28L18 14 1.825 0 0 1.715 14.196 14 0 26.285z" fill="currentColor"></path>
													</svg>
												</button>
											</Link>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-6 column col-md-6">
								<div className="spotRight">
									<img src={isMobile ? this.data.imagemobile : this.data.image} alt="spoteLight" />
								</div>
							</div>
						</div>
					</div>
				</div>
				</div>
			)
		} else {
			return <div></div>
		}
	}
}

const mapStateToProps = state => {
	return {
	   globals: state.global,
	};
 }
 const mapDispatchToProps = dispatch => {
	return {}
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Radium(LogoSlider)));
 