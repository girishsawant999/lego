import React, { Component } from "react"
import Slider from "react-slick"
// import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"
// import "bootstrap/dist/css/bootstrap.css"
import { isMobile } from "react-device-detect"
import Radium from 'radium'
import { Link } from "react-router-dom"
import { connect } from 'react-redux';

class HomeBanner extends Component {
	constructor(props) {
		super(props)
		this.data = this.props.data && Object.values(this.props.data)
		if (this.data) {
			this.data.sort((a,b)=> {
				return parseInt(a.sortorder) - parseInt(b.sortorder)
			})
		}
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

	createSlideElement = (item,key) => {
		const customStyle = {
			backgroundColor: item.btncolor,
			color: item.btntextcolor,

			":hover": {
				backgroundColor: item.btncolorhover,
				color: item.btntextcolorhover,
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
							{item.dropdown === "1" ? (
								<img src={item.imgdesktop} alt="banner1" />
							) : (
								<video
									loop
									muted
									autoPlay
									playsInline
									width="100%"
									style={{ height: "500px" }}
									height="500px"
									src={item.videodesktop}
									type="video/mp4"
								/>
							)}
						</div>
					)}
					{isMobile && (
						<div className="mob">
							{item.dropdown === "1" ? (
								<img src={item.imgmobile} alt="banner1" />
							) : (
								<video loop muted autoPlay width="100%" src={item.videomobile} type="video/mp4" />
							)}
						</div>
					)}

					<div className="bannerContent"  style={ isMobile?{backgroundColor:item.bgmobile}:{ ...bannerContent[item.bannercontentalignment]}} >
						<p className="headingTitle" style={{ color: item.desccolor }}>
							{item.title}
						</p>
						<p className="headingText" style={{ color: item.desccolor }} dangerouslySetInnerHTML={{__html: item.content}}></p>
						<div className="buttonDiv">
						<Link to={`/${store_locale}/${item.redirection}`} >
								<button 
									key={key}
									type="button"
									id={`btn-${key}`}
									className="whiteButton"
									style={customStyle}>
									{item.btntext}
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
							this.data.map((item,index) => {
								return item.title && this.createSlideElement(item,index)  //this.checkValidObject(item)
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
