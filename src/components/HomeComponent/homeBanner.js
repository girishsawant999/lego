import React, { Component } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "bootstrap/dist/css/bootstrap.css"
import { isMobile } from "react-device-detect"
import Radium from 'radium'
import { Link } from "react-router-dom"
import { connect } from 'react-redux';

class HomeBanner extends Component {
	constructor(props) {
		super(props)
		this.data = this.props.data
	}

	checkValidObject =(item) =>{
		let valid = true
		if(item.dropdown === "1") {
			if(item.imgdesktop && item.imgmobile){
				valid= true
			} else {
				valid =false
			}
		} else {
			if(item.videodesktop && item.videomobile){
				valid= true
			} else {
				valid =false
			}
		}

		return valid
	}

	createSlideElement = (key) => {
		const customStyle = {
			backgroundColor: this.data[key].btncolor,
			color: this.data[key].btntextcolor,

			":hover": {
				backgroundColor: this.data[key].btncolorhover,
				color: this.data[key].btntextcolorhover,
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
				// marginLeft:"-236px",
				transform: "translate(-50%,-50%)",
				width:"472px"
		    },
		}
		const { store_locale } =this.props.globals
		return (
			<div key={key}>
				<div className="ImageBanner" >
					{!isMobile && (
						<div className="web">
							{this.data[key].dropdown === "1" ? (
								<img src={this.data[key].imgdesktop} alt="banner1" />
							) : (
								<video
									loop
									muted
									autoPlay
									playsInline
									width="100%"
									style={{ height: "500px" }}
									height="500px"
									src={this.data[key].videodesktop}
									type="video/mp4"
								/>
							)}
						</div>
					)}
					{isMobile && (
						<div className="mob">
							{this.data[key].dropdown === "1" ? (
								<img src={this.data[key].imgmobile} alt="banner1" />
							) : (
								<video loop muted autoPlay width="100%" src={this.data[key].videomobile} type="video/mp4" />
							)}
						</div>
					)}

					<div className="bannerContent"  style={ isMobile?{backgroundColor:this.data[key].bgmobile}:{ ...bannerContent[this.data[key].bannercontentalignment]}} >
						<p className="headingTitle" style={{ color: this.data[key].desccolor }}>
							{this.data[key].title}
						</p>
						<p className="headingText" style={{ color: this.data[key].desccolor }}>
							{this.data[key].content}
						</p>
						<div className="buttonDiv">
						<Link to={`/${store_locale}/productlisting/${this.data[key].redirection}`} >
								<button 
									key={key}
									type="button"
									id={`btn-${key}`}
									className="whiteButton"
									style={customStyle}>
									{this.data[key].btntext}
									<svg
										id={`arrow-${key}`}
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
		)
	}

	render() {
		var settings2 = {
			dots: true,
			arrows: true,
			infinite: true,
			speed: 800,
			slidesToShow: 1,
			slidesToScroll: 1,
			centerMode: true,
			autoplay: true,
			centerPadding: "0",
			autoplaySpeed: 10000,

			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
			],
		}
		return (
			<div>
				<div className="HomeBanner" id="HomeBanner">
					<Slider {...settings2} className="sliderMain">
						{this.data &&
							Object.keys(this.data).map((key) => {
								return this.data[key].title && this.createSlideElement(key)  //this.checkValidObject(this.data[key])
							})}
					</Slider>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		globals: state.global,
		menuItem: state.menu.logoSlider
	};
}
const mapDispatchToProps = dispatch => {
	return {
	}
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Radium(HomeBanner));
