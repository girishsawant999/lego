import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.css"
import { Link } from "react-router-dom"
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class QuickLogos extends Component {
	constructor(props) {
		super(props)
		this.data = this.props.data
	}

	render() {
		const { store_locale } = this.props.globals
		return (
			<div>
				<div className="QuickLogos">
					<ul className="list-inline">
						{this.data &&
							Object.keys(this.data).map((key) => {
								return this.data[key].heading && 
								(<li key={key} className="list-inline-item">
										<Link to={`/${store_locale}/productlisting/${this.data[key].redirection}`} >
											<img src={this.data[key].image} alt="logo_Slider" /> <p>{this.data[key].heading}</p>
										</Link>
									</li>
								)
							})}
					</ul>
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
 
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuickLogos));
 