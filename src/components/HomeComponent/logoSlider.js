import React, { Component } from "react"
import Slider from "react-slick"
// import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"
// import "bootstrap/dist/css/bootstrap.css"
import { Link } from "react-router-dom"
import { connect } from 'react-redux';

class LogoSlider extends Component {
	constructor(props) {
		super(props);
	}

	// componentDidMount() {
		// let store = this.props.globals.currentStore;
		// if (this.props.menuItem == "") {
		// 	this.props.onGetMenu({ store_id: store })
		// }
	// }
	render() {
		var settings1 = {
			dots: false,
			lazyLoad: false,
			arrows: true,
			infinite: true,
			speed: 800,
			slidesToShow: 1,
			slidesToScroll: 1 ,
			centerMode: true,
			autoplay: true,
			centerPadding: '0',
			autoplaySpeed: 5000,
		}

		let menuItem = this.props.menuItem && Object.values(this.props.menuItem)
		const { store_locale } =this.props.globals

		return (
			<div>
				<div className="logoOuter">
					<div className="Logo-Slider" id="">
						<Slider {...settings1} className="sliderMain">

							{menuItem && menuItem.map((menuItem, index) => {
								return menuItem.title && (
									<div key={index}>
										<ul className="list-inline">
											<li className="list-inline-item w20">
												<a >
													<img src={menuItem.logo} alt="logoSlider2" />{" "}
												</a>
											</li>
											<li className="list-inline-item w80">
												<a>
													<span>
														{menuItem.title} {"  "}
													{menuItem.url_title && menuItem.url && <Link to={`/${store_locale}/${menuItem.url}`} >
															<span className="learnMore">{menuItem.url_title}</span>
														</Link>}
													</span>
												</a>
											</li>
										</ul>
									</div>
								)
							})
							}
							
						</Slider>
					</div>
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
		// onGetMenu: (payload) => dispatch(actions.getMenu(payload)),
	}
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LogoSlider);
