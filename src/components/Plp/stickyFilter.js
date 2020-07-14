import React, { Component } from "react"
import { FormattedMessage, injectIntl } from "../../../node_modules/react-intl"
import $ from "jquery"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import footerLogo from "../../assets/images/emmet-fe70d8bbd77eb5ec2f0a84f515f5121b.png"
import feature1 from "../../assets/images/filter.png"
import rightmenuIcon from "../../assets/images/rightmenuIcon.png"
import minusIcon from "../../assets/images/icons/arrowDown.png"
import downArrow from "../../assets/images/icons/arrowDown.png"
import "bootstrap/dist/css/bootstrap.css"
import LogoSlider from "../../components/HomeComponent/logoSlider"
import bagIcon from "../../assets/images/icons/bag.png"
import PlusIcon from "../../assets/images/icons/arrowDown.png"
import Collapsible from "react-collapsible"
import starYellow from '../../assets/images/icons/starYellow.png';
import starGrey from '../../assets/images/icons/starGrey.png';

class StickyFilter extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openSortModelFlag: false,
			openSubFilter: false,
			filters: [],
			pageOn: 1,
			currentFilter: "",
			sortSelected: null,
		}
	}

	onPressOnAllFilters = () => {
		const element1 = document.getElementById("filteroverlay")
		const element2 = document.getElementById("filterOpen")
		if (element1 && element2.classList.contains("filterSidebar")) {
			element1.classList.add("openBackgroung", "overlay-filter")
			element2.classList.add("filterSidebar", "open-filter")
		}

		$("body").addClass("hideScroll")
	}

	onPressCloseIcon = () => {
		const element1 = document.getElementById("filteroverlay")
		const element2 = document.getElementById("filterOpen")
		element1.classList.remove("openBackgroung", "overlay-filter")
		element2.classList.remove("open-filter")
		// if(element1.classList.contains("openBackgroung overlay-filter") && element2.classList.contains("filterSidebar open-filter")){
		//    element1.classList.remove("openBackgroung", "overlay-filter");
		//    element2.classList.remove("open-fiter");

		// }
		$("body").removeClass("hideScroll")
		this.onPressBackIcon()
	}
	onSortByClick = () => {
		this.setState({
			openSortModelFlag: !this.state.openSortModelFlag,
		})
	}
	openSubFilter = () => {
		this.setState({
			openSortModelFlag: false,
			openSubFilter: !this.state.openSubFilter,
		})
	}

	applyfilter = (filter) => {
		let { filters } = this.state
		if (filters.includes(filter.name)) {
			var index = filters.indexOf(filter.name)
			filters.splice(index, 1)
		} else {
			filters.push(filter.name)
		}
		this.setState({ filters: filters })
		this.props.filterProducts(filter)
	}

	resetFIlter = () => {
		this.setState({ filters: [] })
		this.props.resetFilter()
		this.onPressCloseIcon()
	}

	closeOtherSide = (value) => {
		let collapses = document.getElementsByClassName("open")
		for (let i = 0; i < collapses.length; i++) {
			collapses[i].click()
		}
	}

	selectedFilterCat = (filterCat) => {
		this.setState({ pageOn: 2, currentFilter: filterCat })
	}

	onPressBackIcon = () => {
		this.setState({ pageOn: 1, currentFilter: "" })
	}

	sortingclick = () => {
		this.setState({ pageOn: 3, currentFilter: "" })
	}

	getCurrencyAddedName = (name) => {
		let resultName = '';
		if (name) {
			let slitedName = name.split('-');
			if (!slitedName[1]) {
				resultName = `SAR ${slitedName[0]}`;
			} else {
				resultName = `SAR ${slitedName[0]} - SAR ${slitedName[1]}`;
			}
		}

		return resultName;
	}

	render() {
		// let filters = this.props.plpData && this.props.plpData.filters;
		// let filterTitle = filters && Object.keys(filters)
		let filterTitle = this.props.filterCopy && Object.keys(this.props.filterCopy)
		let filters = {}
		filterTitle.sort()
		filterTitle.forEach((key) => {
			filters[key] = this.props.filterCopy[key]
		})
		let products = this.props.product && Object.values(this.props.product);
		let showRating = false
		if (products && products.length > 0 ) {
            showRating = products.filter(product => product.json.ratingValue > 0).length > 0 
        }
		return (
			<div className="StickyFilter">
				<div className="stickeyFilterSecton">
					<div className="FilterList">
						<div className="mobileFilterStripe" onClick={() => this.onPressOnAllFilters()}>
							<div className="filterContent">
								<p className="sort_By">
									<span>
										<FormattedMessage id="plp.FilterAndSort" />
									</span>
								</p>
								<span className="filter_Icon">
									<img src={feature1} className="allFiltericon" id="hover" />
								</span>
							</div>
						</div>
						<div id="filteroverlay">
							<div id="filterOpen" className="filterSidebar">
								<div className="filterheading">
									{this.state.pageOn !== 1 && (
										<span onClick={() => this.onPressBackIcon()} className="">
											<img
												className="arrowRight backIcon"
												src={rightmenuIcon}
												id="hover"
												alt="back"
											/>
										</span>
									)}
									<h3 className="">
										<FormattedMessage id="plp.FilterAndSort" />
									</h3>
									<span onClick={() => this.onPressCloseIcon()} className="closeIcon">
										✕
									</span>
								</div>
								{this.state.pageOn === 1 && (
									<div className="InsideSiderHeight">
										<div className="subheading" onClick={() => this.sortingclick()}>
											<p className="">
												<span>Sort by</span>
												<span className="selectedSort"></span>
											</p>
											<img className="arrowRight" src={rightmenuIcon} id="hover" />
										</div>
										{filters &&
											Object.keys(filters).map((filter, index) => {
												return (
													<span>
														<div onClick={(e) => this.selectedFilterCat(filter)} className="subheading">
															<p className="">{filter}</p>
															<img className="arrowRight" src={rightmenuIcon} id="hover" />
														</div>
													</span>
												)
											})}
									</div>
								)}
								{this.state.pageOn === 2 && (
									<div style={{ textAlign: "start" }}>
										<ul className="list-group contentwrapper">
											{this.state.currentFilter &&
												filters &&
												filters[this.state.currentFilter].map((filterInner, index) => {
													return (
														<div class="heightFilterInner">
															{this.state.filters.includes(filterInner.name) ? (
																<>
																{filterInner.code !== "ratingfilters" && <div class="selectedFilter priceFilter" onClick={(e) => this.applyfilter(filterInner)}>
																	<span class="colorSpan"></span>
																	{/* <input type="checkbox" id={`${filterInner}${index}`} checked={this.state.filters.includes(filterInner.name)} onClick={(e) => this.applyfilter(filterInner)} value={filterInner.name}  /> */}
																	{filterInner.code !== 'price' && <label for="color-0">{filterInner.name}</label>}
																	{filterInner.code === 'price' && 
																	<label for="color-0">{this.getCurrencyAddedName(filterInner.name)}</label>}
																</div>}
																{filterInner.code === "ratingfilters" && <div class="selectedFilter priceFilter" onClick={(e) => this.applyfilter(filterInner)}>
																	<span class="colorSpan"></span>
																	{/* <input type="checkbox" id={`${filterInner}${index}`} checked={this.state.filters.includes(filterInner.name)} onClick={(e) => this.applyfilter(filterInner)} value={filterInner.name}  /> */}
																	<label for="color-0">
																		<ul className="list-inline starList" id="startListPLP" >
																			<li className="list-inline-item">
																				<span>
																					<img src={ parseInt(filterInner.value) >= 1 ? starYellow : starGrey} alt="startYellow" />{" "}
																				</span>
																			</li>
																			<li className="list-inline-item">
																				<span>
																					<img src={ parseInt(filterInner.value) >= 2 ? starYellow : starGrey} alt="startYellow" />
																				</span>
																			</li>
																			<li className="list-inline-item">
																				<span>
																					<img src={ parseInt(filterInner.value) >= 3 ? starYellow : starGrey} alt="startYellow" />
																				</span>
																			</li>
																			<li className="list-inline-item">
																				<span>
																					<img src={ parseInt(filterInner.value) >= 4 ? starYellow : starGrey} alt="startYellow" />
																				</span>
																			</li>
																			<li className="list-inline-item">
																				<span>
																					<img src={ parseInt(filterInner.value) === 5 ? starYellow : starGrey} alt="startGrey" />
																				</span>
																			</li>
																		</ul>
																	</label>
																	
																</div>}
																</>
															) : (
																<>
																{filterInner.code !== "ratingfilters" && <div
																	class="notSelectedFilter priceFilter"
																	onClick={(e) => this.applyfilter(filterInner)}>
																	<span class="colorSpan"></span>
																	<input type="checkbox" id={`${filterInner}${index}`} />
																	{filterInner.code !== 'price' && <label for="color-3">{filterInner.name}</label>}
																	{filterInner.code === 'price' && 
																	<label for="color-0">{this.getCurrencyAddedName(filterInner.name)}</label>}
																</div>}
																{filterInner.code === "ratingfilters" && <div
																	class="notSelectedFilter priceFilter"
																	onClick={(e) => this.applyfilter(filterInner)}>
																	<span class="colorSpan"></span>
																	<input type="checkbox" id={`${filterInner}${index}`} />
																	<label for="color-3">
																		<ul className="list-inline starList" id="startListPLP" >
																			<li className="list-inline-item">
																				<span>
																					<img src={ parseInt(filterInner.value) >= 1 ? starYellow : starGrey} alt="startYellow" />{" "}
																				</span>
																			</li>
																			<li className="list-inline-item">
																				<span>
																					<img src={ parseInt(filterInner.value) >= 2 ? starYellow : starGrey} alt="startYellow" />
																				</span>
																			</li>
																			<li className="list-inline-item">
																				<span>
																					<img src={ parseInt(filterInner.value) >= 3 ? starYellow : starGrey} alt="startYellow" />
																				</span>
																			</li>
																			<li className="list-inline-item">
																				<span>
																					<img src={ parseInt(filterInner.value) >= 4 ? starYellow : starGrey} alt="startYellow" />
																				</span>
																			</li>
																			<li className="list-inline-item">
																				<span>
																					<img src={ parseInt(filterInner.value) === 5 ? starYellow : starGrey} alt="startGrey" />
																				</span>
																			</li>
																		</ul>
																	</label>
																</div>}
																</>
															)}
														</div>
													)
												})}
										</ul>
									</div>
								)}
								{this.state.pageOn === 3 && (
									<div id="SortBar" class="sort-bar-sticky">
										<ul class="footer_ul_amrc">
											<label class="radio">
												<span>
													<FormattedMessage id="plp.SortByFeatured" />
												</span>
												<input
													type="radio"
													value="1"
													name="radio"
													checked={this.state.sortSelected === 1}
													onChange={(e) => {
														this.setState({sortSelected : 1})
														this.props.onSort(e)
														this.onPressCloseIcon()
													}}
												/>
												<span class="checkmark"></span>
											</label>
											<label class="radio">
												<span>
													<FormattedMessage id="plp.PriceLowToHigh" />
												</span>
												<input
													type="radio"
													value="3"
													name="radio"
													checked={this.state.sortSelected === 3}
													onChange={(e) => {
														this.setState({sortSelected : 3})
														this.props.onSort(e)
														this.onPressCloseIcon()
													}}
												/>
												<span class="checkmark"></span>
											</label>
											<label class="radio">
												<span>
													<FormattedMessage id="plp.PriceHighToLow" />
												</span>
												<input
													type="radio"
													value="2"
													name="radio"
													checked={this.state.sortSelected === 2}
													onChange={(e) => {
														this.setState({sortSelected : 2})
														this.props.onSort(e)
														this.onPressCloseIcon()
													}}
												/>
												<span class="checkmark"></span>
											</label>
											{showRating && <label class="radio">
												<span>
													<FormattedMessage id="plp.Rating" />
												</span>
												<input
													type="radio"
													value="4"
													name="radio"
													checked={this.state.sortSelected === 4}
													onChange={(e) => {
														this.setState({sortSelected : 4})
														this.props.onSort(e)
														this.onPressCloseIcon()
													}}
												/>
												<span class="checkmark"></span>
											</label>}
										</ul>
									</div>
								)}
								<div className="bottomButton">
									<p className="ItemCount">
										<span>{this.props.count}</span>
										<span>
											&nbsp;
											<span>
												<FormattedMessage id="plp.Items" />
											</span>
										</span>
									</p>
									{this.state.filters.length > 0 && <div className="buttonSection">
										<button type="button" className="clearFilter" onClick={() => this.resetFIlter()}>
											<span>
												<FormattedMessage id="plp.ClearFilter" />
											</span>
										</button>
										<button type="button" className="applyFilter" onClick={() => this.onPressCloseIcon()}>
											<span>
												<FormattedMessage id="plp.ApplyFilter" />
											</span>
										</button>
									</div>}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		globals: state.global,
		plpData: state.plp.PlpData,
		product: state.plp.product, 
		PlpNextLoader: state.plp.PlpNextLoader,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StickyFilter))
