import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.css"
import ButtonrightArrow from "../../assets/images/icons/rightArrow.png"
import { FormattedMessage } from '../../../node_modules/react-intl';
import { Link } from "react-router-dom"
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Trending extends Component {
	constructor(props) {
		super(props)
		this.data = this.props.data
	}

	render() {
		const { store_locale } = this.props.globals

		return (
			<div>
				<div className="trendingNow">
					<div className="container">
						<p className="headTitle"> <FormattedMessage id="Trending.now" defaultMessage="Trending now " /></p>
						<div className="trendImages">
							<div className="row">
								{this.data &&
									Object.keys(this.data).map((key) => {
										return (
											<div key={key} className="col-lg-4 col-md-4 col-sm-6">
												<Link to={`/${store_locale}/productdetails/${this.data[key].redirection}`} className="LinkTo">
													<div className="images">
														<img src={this.data[key].image} alt="logoSlider2" />
														<p className="imagesTitle">{this.data[key].heading}</p>
														<p className="imagesText">{this.data[key].btndesc}</p>
														<p className="shopNow">
															{this.data[key].btntext}
															<img src={ButtonrightArrow} alt="ButtonrightArrow" />
														</p>
													</div>
												</Link>
											</div>
										)
									})}
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
 
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Trending));
 