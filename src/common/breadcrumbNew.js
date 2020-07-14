import React, { Component } from "react"
import rightArrow1 from "../assets/images/icons/rightArrow1.png"
import { Link } from 'react-router-dom';
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { FormattedMessage} from 'react-intl';

class Breadcrumb extends Component {
	constructor(props) {
		super(props)
	}
	render() {
        const { store_locale } = this.props.globals
		return (
			<div>
				<div className="container">
					<div className="Breadcrumb">
						<nav aria-label="breadcrumb">
							<ol className="breadcrumb">
								<li className="breadcrumb-item breadcrumb-item-n">
									<Link to={`/${store_locale}`}>
									<FormattedMessage id="Home" defaultMessage="Home" />
									</Link>
									&nbsp;&nbsp;<i class="fa breadcrumbArrow"></i>
								</li>
								{this.props.breadcrumbData &&
									this.props.breadcrumbData.map((item, index) => {
										if(this.props.breadcrumbData.length-1 === index) 
											return (
												<li className="breadcrumb-item breadcrumb-item-n">
                                                <span>{item.name}</span>
                                            </li>
											)
                                        return (
                                            <li className="breadcrumb-item breadcrumb-item-n">
                                                <Link to={`/${store_locale}/productlisting/${item.url_key}`}>{item.name}</Link>{" "}
												&nbsp;&nbsp;<i class="fa breadcrumbArrow"></i>
                                            </li>
										)
									})}
							</ol>
						</nav>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Breadcrumb))
