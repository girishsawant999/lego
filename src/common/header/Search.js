import React, { Component } from "react"
import { withRouter,Link } from "react-router-dom"
import { connect } from "react-redux"
import $ from "jquery"
import * as actions from "../../redux/actions/index"

let productData = ""
let check = false

class Search extends Component {
	constructor(props) {
		super(props)
		this.state = {
			redirect: false,
			searchText: "",
			showAutoSuggestion: false,
			checkLoop: true,
			open: false,
			popupVisible: false,
		}
	}
	stickyFilterFix = () =>{
		if (this.state.showAutoSuggestion) {
			$('.mobileFilterStripe').addClass('zIndex1')
		} else {
			$('.mobileFilterStripe').removeClass('zIndex1')
		}

	}
	autoSearchText = (e) => {
		if (e.keyCode !== 13) {
			// this.state.searchText = e.target.value
			this.setState({searchText : e.target.value})
			if (e.target.value.length >= 0) {
				const data = {
					q: e.target.value,
					storeId: this.props.globals.currentStore,
				}
				check = true
				if (this.state.searchText.length > 2) {
					this.setState({ showAutoSuggestion: true })
					this.props.onGetProductSuggestionData(data)
				} else {
					this.setState({ showAutoSuggestion: false })
				}
				this.setState({ checkLoop: true })
			} else {
				check = false
				this.setState({ showAutoSuggestion: false })
			}
		}
	}

	handleKeyPress = (e) => {
		if (e.keyCode === 13 && e.target.value) {
			$("#AutoSuggestions").hide()
			check = false
			this.setState({ redirect: true, searchText: e.target.value,showAutoSuggestion:false })
			this.props.history.push(`/${this.props.globals.store_locale}/product/search?query=${this.state.searchText}`)
			e.preventDefault()
			this.SideBarClose()
		}
	}
 
	SideBarClose = () =>{       
        // document.getElementById("mText").style.cssText = "font-size:9px; bottom:-14px";
         $("#SideBar").removeClass("leftZero");
         $("#sideBarOverlay").removeClass("sidebar-overlay");
         document.body.style.overflowY = "auto";
        $("#mText").removeClass("mLeft25");
        $("#mTex1").removeClass("mLeft25");
	  }
	  
	componentDidMount() {
		$(document).click( (e) => {
			if (e.target.id !== "searchInput" && e.target.id !== 'AutoSuggestions') {
				$("#AutoSuggestions").hide()
				this.setState({showAutoSuggestion:false})
				check = false
			}
		})
	  }
	  
	render() {
		let styleSearchInput = {}
		let styleAutosuggestion = {}
		if (check) {
			if (
				this.props.autoSearchSuggestionData &&
				this.props.autoSearchSuggestionData.product_data &&
				Object.keys(this.props.autoSearchSuggestionData.product_data).length > 0 &&
				this.props.autoSearchSuggestionData.product_data !== undefined
			) {
				productData = Object.values(this.props.autoSearchSuggestionData.product_data)
			}
		}
		if (this.state.showAutoSuggestion && this.props.autoSearchSuggestionDataMsg) {
			styleSearchInput = {
				borderRadius: "1.25rem 1.25rem 0rem 0rem",
				border: "1px solid #31a1e0",
				borderBottom: "none",
			}
			styleAutosuggestion = {
				border: "1px solid #31a1e0",
				borderRadius: "0rem 0rem 1.25rem 1.25rem",
				borderTop: "none",
				zIndex: "3"
			}
		}
		this.stickyFilterFix()
		return (
			<div className="search">
				<input
					id="searchInput"
					type="text"
					className=""
					placeholder={ this.props.globals.store_locale==='en' ? "Search...": "بحث... " } 
					onFocus={(e)=>{ if(e.target.value) this.setState({ showAutoSuggestion: true }) }}
					onKeyUp={this.autoSearchText}
					onKeyDown={this.handleKeyPress}
					style={styleSearchInput}
					autoComplete="off"
				/>
				{this.state.searchText ? <Link to={`/${this.props.globals.store_locale}/product/search?query=${this.state.searchText}`}>
					<i className="fa fa-search" aria-hidden="true" onClick={(e) => {
						this.SideBarClose()
						this.setState({ showAutoSuggestion: false })}}></i>
					</Link>
					:<i className="fa fa-search" aria-hidden="true"  onClick={(e) => {
						this.SideBarClose()
						this.setState({ showAutoSuggestion: false })}}></i>}

				{this.state.showAutoSuggestion && this.props.autoSearchSuggestionData !== undefined && productData ? (
					<div id="AutoSuggestions" className="auto_Suggestion" style={styleAutosuggestion}>
						{productData.map((item, index) => (
							<Link to={`/${this.props.globals.store_locale}/productdetails/${item.json.url_key}`}>
							<div className="search_item">
									<span className="underline_hover" onClick={(e) => {
										this.SideBarClose()
										this.setState({ showAutoSuggestion: false })
									}}>{item.json.name}</span>
							</div>
							</Link>
						))}
					</div>
				) : (
					this.state.showAutoSuggestion &&
					this.props.autoSearchSuggestionDataMsg && (
						<div id="AutoSuggestions" className="auto_Suggestion" style={styleAutosuggestion}>
							<div className="search_item">
								<span className="underline_hover">{this.props.autoSearchSuggestionDataMsg}</span>
							</div>
						</div>
					)
				)}
			</div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		globals: state.global,
		autoSearchSuggestionData: state.plp.autoSerachsuggestionData ? state.plp.autoSerachsuggestionData.data : "",
		autoSearchSuggestionDataMsg: state.plp.autoSerachsuggestionData ? state.plp.autoSerachsuggestionData.message : "",
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGetProductSuggestionData: (payload) => dispatch(actions.getAutoSuggestionProductSearchList(payload)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Search))
