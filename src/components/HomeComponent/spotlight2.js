import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.css"
import Radium from "radium"
import { Link } from "react-router-dom"
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isMobile } from "react-device-detect"
import DotsHomeBanner from '../../assets/images/DotsHomeBanner.jpg';
import DotsHomeBannerSmall from '../../assets/images/Hero-Standard-Small.jpg';


class LogoSlider extends Component {
	render() {
		const customStyle = {
			backgroundColor:  this.props.data.btncolor,
			color:  this.props.data.btntextcolor,

			":hover": {
				backgroundColor:  this.props.data.btnhover,
				color:  this.props.data.btntextcolorhover,
			},
		}
		const bannerContent = {
			null: {
				textAlign:"left",
				left: "6.875rem",
			},
			left: {
				textAlign:"left",
				left: "6.875rem",
			},
			right: {
				textAlign:"right",
				right: "6.875rem",
			},
			center: { 
				left: "50%",
				textAlign: "center",
				marginLeft:"-236px",
				width:"472px"
		    },
		}
		const { store_locale } =this.props.globals

		return (
		 <div className="HomeBanner" id="HomeBanner">
			<div >
				<div className="ImageBanner" >
						<div className="web" >
							{ this.props.data.imageyesno === "1" ? (
								<img src={ this.props.data.image} alt="banner1"  />
							) : (
								<video
									loop
									muted
									autoPlay
									playsInline
									width="100%"
									height="500px"
									src={ this.props.data.videodesktop}
									type="video/mp4"
								/>
							)}
						</div>

						<div className="mob">
							{ this.props.data.imageyesno === "1" ? (
								<img src={ this.props.data.imagemobile} alt="banner1" />
							) : (
								<video loop muted autoPlay width="100%" src={ this.props.data.videomobile} type="video/mp4" />
							)}
						</div>


					<div className="bannerContent"  style={ isMobile?{backgroundColor: this.props.data.bgcolormobile}:{ ...bannerContent[ this.props.data.bannercontentalignment]}} >
						<p className="headingTitle" style={{ color:  this.props.data.headingcolor }}>
							{ this.props.data.heading}
						</p>
						<p className="headingText" style={{ color:  this.props.data.desccolor }}>
							{ this.props.data.description}
						</p>
						<div className="buttonDiv">
						<Link to={`/${store_locale}/productlisting/${ this.props.data.redirection}`} >
								<button 
									type="button"
									id={`btn`}
									className="whiteButton"
									style={customStyle}>
									{ this.props.data.btntext}
									<svg
										id={`arrow`}
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
			</div>
		)
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
 