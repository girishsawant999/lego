import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import * as actions from "../../../redux/actions"
import { connect } from "react-redux"
import renderHTML from "react-render-html"
import Spinner2 from "../../Spinner/Spinner2"
import { createMetaTags } from '../../utility/meta'

class AboutUs extends Component {
	constructor(props) {
		super(props)
		this.myRef = React.createRef()
	}

	componentWillMount() {
		let storeId = this.props.globals.currentStore !== null ? this.props.globals.currentStore : 1

		const payload = {
			url_key: "aboutus/storeId/" + storeId,
		}
		this.props.discover_more.content = null
		this.props.getCMSPage(payload)
		
	}
	componentDidMount() {
		window.scrollTo(0, 0)
		// setTimeout(() => {
		//     this.myRef.current.scrollIntoView();
		// }, 100);
	}

	render() {
		return (
			<div>
				{this.props.globals.staticPageLoader ? (
					<div className="mobMinHeight">
						<Spinner2 />
					</div>
				) : (
					<>
					{this.props.discover_more && this.props.discover_more.content && 
					renderHTML(this.props.discover_more.content)}
					{this.props.discover_more && createMetaTags(
					this.props.discover_more.meta_title,
					this.props.discover_more.meta_description,
					this.props.discover_more.meta_keywords) }
					</>
				)}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		discover_more: state.global.discover_more,
		globals: state.global,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		getCMSPage: (payload) => dispatch(actions.getCMSPage(payload)),
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AboutUs))
