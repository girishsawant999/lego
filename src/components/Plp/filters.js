import React, { Component } from "react";
import * as actions from ".././../redux/actions/index";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PlusIcon from "../../assets/images/icons/arrowDown.png";
import minusIcon from "../../assets/images/icons/droparrowbold.png";
import Collapsible from "react-collapsible";
import { isMobile } from "react-device-detect";
import { FormattedMessage } from "react-intl";
import starYellow from '../../assets/images/icons/starYellow.png';
import starGrey from '../../assets/images/icons/starGrey.png';

class Filters extends Component {
	constructor(props) {
		super(props)
		this.state = {
			filters: [],
			priceFilter: [],
		}
	}

	componentDidMount() {}

	closeOtherSide = (value) => {
		let collapses = document.getElementsByClassName("open")
		for (let i = 0; i < collapses.length; i++) {
			collapses[i].click()
		}
	}

	filterClose = () => {
		document.getElementById("FilterModel").style.display = "none"
		document.body.style.overflowY = "auto"
	}

	applyfilter = (filter) => {
		let { filters } = this.state
		if (filters.includes(filter.name)) {
			var index = filters.indexOf(filter.name)
			filters.splice(index, 1)
		} else {
			filters.push(filter.name)
		}
		this.props.filterProducts(filter)

		this.setState({ filters: filters })
	}

	filterOpen = () => {
		document.getElementById("FilterModel").style.display = "block"
		document.body.style.overflowY = "hidden"
	}

	filterClose = () => {
		document.getElementById("FilterModel").style.display = "none"
		document.body.style.overflowY = "auto"
	}

	resetFIlter = () => {
		this.setState({ filters: [] })
		this.props.resetFilter()
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
		let filterTitle = this.props.filterCopy && Object.keys(this.props.filterCopy);
		let filters = {};
		filterTitle.sort();
		filterTitle.forEach(key => {
			filters[key] = this.props.filterCopy[key];
		});
		// let filterTitle = filters && Object.keys(filters);
		let customStyle = {};
		filters &&
		Object.keys(filters).map((filter, index) => {
				filters &&
					filters[filter].map((filterInner, index) => {
						if (this.state.filters.includes(filterInner.name))
						customStyle = {
							cursor: "pointer",
							color: "rgb(0,0,255)",
							backgroundColor: "white",
							border: "none",
							borderBottom: "1px solid #e0e0e0",
							borderRadius: "0",
						}
					})
			})

		return (
			<div
				id="webFilter"
				className="positionStickey topPSticky control-box sidebar-right d-none d-md-block d-lg-block d-xl-block"
				style={{ overflowY: "auto", maxHeight: "85vh" }}>
				<div className="container">
					<div className="row" onClick={() => this.resetFIlter()}>
						<span className="iwt " style={customStyle}>
							<FormattedMessage id="plp.ResetAll" />
						</span>
					</div>
				</div>

				<div className="sidebar-filter">
					{filters &&
						Object.keys(filters).map((filter, index) => {
							return (
								<Collapsible
								    open ={true}
									trigger={
										<div onClick={() => this.closeOtherSide(0)} className="Collapsible_text_container">
											<div className="Collapsible_text footerHeading">{filter}</div>
											<div className="Collapsible_arrow_container">
												<img className="Icon" src={PlusIcon} alt="" />
											</div>
										</div>
									}
									key={index}
									triggerWhenOpen={
										<div className="Collapsible_text_container open">
											<div className="Collapsible_text footerHeading">{filter}</div>
											<div className="Collapsible_arrow_container">
												<img src={minusIcon} alt="" className="Icon" />
											</div>
										</div>
									}>
									<div style={{ textAlign: "start" }}>
										<ul className="list-group list-group-flush contentwrapper">
											{filters &&
												filters[filter].map((filterInner, index) => {
													return (
														<li className="list-group-item">
															{filter !== 'rating' && filter !== 'التقييم' && 
															<div className="custom-control custom-checkbox"
															onClick={(e) => this.applyfilter(filterInner)}>
																<input
																	checked={this.state.filters.includes(filterInner.name)}
																	type="checkbox"
																	className="custom-control-input"
																	id={`${filterInner}${index}`}
																	
																	value={filterInner.name}
																/>
																{filterInner.code !== 'price' && <label
																	className="custom-control-label pl-3"
																	for="p-type1"
																	>
																	{filterInner.name}
																</label>}
																{filterInner.code === 'price' && <label
																	className="custom-control-label pl-3"
																	for="p-type1"
																	>
																	{this.getCurrencyAddedName(filterInner.name)}
																</label>}
															</div>}
															{(filter === 'rating' || filter === 'التقييم') && 
															<div className="custom-control custom-checkbox"
															onClick={(e) => this.applyfilter(filterInner)}>
																<input
																	checked={this.state.filters.includes(filterInner.name)}
																	type="checkbox"
																	className="custom-control-input"
																	id={`${filterInner}${index}`}
																	
																	value={filterInner.name}
																/>
																<label
																	className="custom-control-label pl-3"
																	for="p-type1"
																	>
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
														</li>
													)
												})}
										</ul>
									</div>
								</Collapsible>
							)
						})}
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Filters))
