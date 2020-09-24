import "bootstrap/dist/css/bootstrap.css"
import $ from "jquery"
import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-responsive-modal"
import { Link, withRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ReactTooltip from "react-tooltip"
import { FormattedMessage, injectIntl } from "../../../node_modules/react-intl"
import BagIcon from "../../assets/images/icons/bag.png"
import AddBagAlert from "../../common/AlertBox/addToBagAlert"
import * as actions from "../../redux/actions/index"
import MyAccSideBar from "../Myaccount/MyAccSideBar"
import Spinner2 from "../Spinner/Spinner"
import { createMetaTags } from "../utility/meta"


let addTocartClick = false
class Wishlist extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isActive: true,
			products: [],
			wishListFlag: true,
			showPopup: false,
			item: null,
			addMessagePopup: false,
			addMessage: "",
		}
	}

	componentWillMount() {
		if (!this.props.user_details.customer_details.customer_id) {
			this.props.history.push(`/${this.props.globals.store_locale}/login`)
			return
		} else {
			this.props.onGetWishListItemUpdated({
				customerid: this.props.user_details.customer_details.customer_id,
				store_id: this.props.globals.currentStore,
			})
		}
		window.scrollTo(0,0);
	}

	componentDidMount() {
		$("#MyWishlist").addClass("ActiveClass")
	}

	componentDidUpdate(prevProps) {
		if (this.props.myCart.item_added === true) {
			this.props.onClearWishListCartMessageState()
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user_details.isUserLoggedIn) {
			if (
				nextProps.wishlistUpdated.wishlistMessage &&
				nextProps.wishlistUpdated.wishlistItemRemoved &&
				!addTocartClick
			) {
				this.setState({
					addMessagePopup: true,
					addMessage: nextProps.wishlistUpdated.wishlistMessage,
				})
				nextProps.wishlistUpdated.wishlistMessage = ""
				nextProps.wishlistUpdated.wishlistItemRemoved = false
			}

			if (nextProps.myCart.addToCardLoding === false) {
				if (!nextProps.wishlistUpdated.wishlistLoader) {
					if (!nextProps.myCart.add_cart_error && nextProps.myCart.item_added && addTocartClick) {
						this.setState({
							addMessagePopup: true,
							addMessage:
								nextProps.globals.currentStore === 2
									? " Item has been added to Cart "
									: " تم إضافة المنتج إلى سلة التسوق ",
						})
						nextProps.myCart.item_added = false
						addTocartClick = false
					} else if (nextProps.myCart.add_cart_open_popUp && nextProps.myCart.add_cart_error) {
						this.setState({
							addMessagePopup: true,
							addMessage: nextProps.myCart.addToCartMsg,
						})
					}

				}
			}
		}
	}
	logout = () => {
		this.props.onLogoutUser()
		this.props.history.push(`/${this.props.globals.store_locale}/home`)
	}

	onWishListClick = (item) => {
		this.setState({
			wishListFlag: true,
			products: [],
		})
		const data = {
			wishilistitemid: parseInt(item.wishlist_id),
			product_id: item.product_id,
		}
		this.props.onRemoveWishListUpdated(data)
	}
	onPressAddToCart = (item, index) => {
		if (this.props.user_details.isUserLoggedIn === true) {
			let eventObj = {
				currency: item.currency,
				product: [
					{
						name: item.name,
						id: item.sku,
						price: item.offers
							? item.offers.data && item.offers.data["1"]
								? item.offers.data && item.offers.data["1"]
								: item.price
							: item.price,
						brand: "Google",
						category: item.category_names,
						quantity: "1",
						// size : this.state.size_state.text
					},
				],
			}
			let cart_item = {
				cart_item: {
					quote_id: this.props.user_details.customer_details.quote_id,
					product_type: "simple",
					sku: item.sku,
					qty: item.qty,
					product_option: {
						extension_attributes: {
							configurable_item_options: [
								{
									option_id: "",
									option_value: "",
								},
							],
						},
					},
				},
			}
			const myCart = {
				quote_id: this.props.user_details.customer_details.quote_id,
				store_id: this.props.globals.currentStore,
			}
			const removeFromWishlist = {
				wishilistitemid: item.wishlist_id,
				product_id: item.product_id,
			}
			this.props.onAddToCart(cart_item, myCart, eventObj,removeFromWishlist)
			addTocartClick = true
		}
	}

	onClickRemoveIcon = (item) => {
		this.setState({ item: item, showPopup: true })
	}
	closePopup = () => {
		this.setState({ item: null, showPopup: false })
	}
	onRemoveClick = () => {
		if (this.state.item) {
			this.onWishListClick(this.state.item)
			this.closePopup()
		}
	}
	closeAddBag = () => {
		this.setState({
			addMessagePopup: false,
		})
	}
	render() {
		const wishLoader = this.props.wishlistUpdated.wishlistLoader
		const store_locale = this.props.globals.store_locale
		let alertBox = null

		let alertBoxWIshlist = null
		if (this.state.addMessagePopup) {
			alertBoxWIshlist = (
				<AddBagAlert message={this.state.addMessage} alertBoxStatus={true} closeBox={this.closeAddBag} />
			)
		}
		return (
			<div>
				{createMetaTags(
					this.props.globals.store_locale === "en"
						? "Your wishlist | Official LEGO® Online Wishl Saudi Arabia"
						: "قائمة الرغبات | متجر ليغو أونلاين الرسمي بالسعودية",
					this.props.globals.store_locale === "en"
						? "Explore the world of LEGO® through games, videos, products and more! Shop awesome LEGO® building toys and brick sets and find the perfect gift for your kid"
						: "اكتشف عالم ليغو LEGO من خلال الألعاب، والفيديوهات، والمنتجات وأكثر! تسوق مجموعات ألعاب البناء و المكعبات المدهشة من ليغو LEGO واعثر على الهدية المثالية لطفلك",
					this.props.globals.store_locale === "en"
						? "LEGO, Online Store, Saudi Arabia, Bricks, Building Blocks, Construction Toys, Gifts"
						: "ليغو LEGO، تسوق اونلاين، السعودية، مكعبات، مكعبات بناء، العاب تركيب، هدايا"
				)}
				{alertBoxWIshlist}
				<div className="whishlist">
					<ToastContainer />
					<div className="row">
						<div className="col-md-3 sideBarContent">
							<MyAccSideBar />
						</div>
						<div className="col-md-9 pd-0">
							<div>
								<div className="rightSideContent">
									<div className="row">
										<div className="col-md-6 col-6">
											<p className="accountTitle">
												<FormattedMessage id="wishlist.Wishlist" defaultMessage="Wishlist" />
											</p>
										</div>
										<div className="col-md-6 col-6">
											<div className="LogOutDiv">
												<button onClick={() => this.logout()} className="">
													<FormattedMessage id="profile.Logout.Title" defaultMessage="Logout" />
												</button>
											</div>
										</div>
									</div>
									<div className="col-12 pdL">
										{this.props.globals.loading || (wishLoader && !this.props.wishlistUpdated.wishlistLoadingProductId )? (
											<div className="mobMinHeight">
												<Spinner2 />
											</div>
										) : this.props.products.length > 0 ? (
											<div className="wishlistCard">
												<div className="mybagLabel">
													<Link to={`/${store_locale}/cart`}>
														<FormattedMessage id="wishlist.Mybag" defaultMessage="My bag" />
													</Link>
												</div>
												<div className="row headingBack">
													<div className="col-12">
														<div className="ItemLabel">
															<p>
																<FormattedMessage id="wishlist.Items" defaultMessage="Items" />
															</p>
														</div>
													</div>
													{/* <div className="col-6">
                                       <div className="ItemLabelTotal">
                                          <p>Total</p>
                                       </div>
                                    </div> */}
												</div>
												{this.props.products.map((item, index) => (
													<>
														{item.quantity_and_stock_status && !item.quantity_and_stock_status.is_in_stock && (
															<div className="col-md-12 pd-0">
																<div className="whisListAlertBag">
																	<FormattedMessage id="outOfStock" defaultMessage="Out of stock" />
																</div>
															</div>
														)}
														<div className="row brBtm">
															<div className="col-md-7">
																<div className="row">
																	<div className="col-3">
																		<div className="Wimges">
																			<Link to={`/${store_locale}/productdetails/${item.url_key}`}>
																				<img src={item.image[0]} alt="product" />
																			</Link>
																		</div>
																	</div>
																	<div className="col-9">
																		<div className="W-head">
																			<Link to={`/${store_locale}/productdetails/${item.url_key}`}>
																				<p className="W-title">{item.name}</p>
																			</Link>
																			<p className="W-id">{item.product_id}</p>
																		</div>
																		{/*<div className="W-Available">
                                                <p className="green wAvail">Backorders accepted, will ship in 60 days</p>
                                             </div>*/}
																		<div className="W-Toatl">
																			<p className="totalAmt">
																				<FormattedMessage id="wishlist.SAR" defaultMessage="SAR" /> {item.price}
																			</p>
																		</div>
																	</div>
																</div>
															</div>
															<div className="col-md-5">
																<div className="TotalSection">
																	<ul className="list-inline">
																		{this.props.wishlistUpdated.wishlistLoader &&
																		this.props.wishlistUpdated.wishlistLoadingProductId === item.product_id ? (
																			<li className="list-inline-item">
																				<span className="wishlistExc">
																					<i class="fa fa-spinner fa-spin "></i>
																				</span>
																			</li>
																		) : (
																			<li className="list-inline-item" onClick={() => this.onClickRemoveIcon(item)}>
																				<svg
																					width="17px"
																					height="20px"
																					viewBox="0 0 17 22"
																					data-di-rand="1588848718890"
																					data-tip={
																						this.props.globals.store_locale === "en"
																							? "Click to remove item from wishlist"
																							: " انقر لإزالة المنتج من قائمة الأمنيات "
																					}>
																					<g fill="#006DB7" fill-rule="evenodd">
																						<path d="M.773 5.5h15.454A.762.762 0 0 0 17 4.75a.762.762 0 0 0-.773-.75H.773A.762.762 0 0 0 0 4.75c0 .414.346.75.773.75z"></path>
																						<path d="M5.744 4l.378-1.43c.08-.307.448-.607.742-.607h3.272c.294 0 .661.3.742.606L11.256 4 13 4.46l-.378-1.43C12.32 1.88 11.24.673 10.136.673H6.864C5.76.673 4.681 1.881 4.378 3.03L4 4.46 5.744 4z"></path>
																						<path d="M14.47 4.734l-.567 15.257a.515.515 0 0 1-.505.484H3.602a.516.516 0 0 1-.505-.484L2.53 4.734a.764.764 0 0 0-.793-.733.764.764 0 0 0-.736.79l.567 15.256A2.044 2.044 0 0 0 3.602 22h9.796c1.086 0 1.994-.87 2.034-1.953L16 4.791a.764.764 0 0 0-.736-.79.764.764 0 0 0-.793.733z"></path>
																						<path d="M8 8.532v8.945c0 .29.224.526.5.526s.5-.235.5-.526V8.532a.514.514 0 0 0-.5-.526c-.276 0-.5.236-.5.526zm3-.006v8.948c0 .29.224.526.5.526s.5-.236.5-.526V8.526A.514.514 0 0 0 11.5 8c-.276 0-.5.236-.5.526zm-6 0v8.948c0 .29.224.526.5.526s.5-.236.5-.526V8.526A.514.514 0 0 0 5.5 8c-.276 0-.5.236-.5.526z"></path>
																					</g>
																				</svg>
																			</li>
																		)}
																		{item.quantity_and_stock_status && !item.quantity_and_stock_status.is_in_stock ? (
																			<li className="list-inline-item">
																				<span className="wishlistExc">
																					<i
																						class="fa fa-exclamation-circle"
																						data-tip={
																							this.props.globals.store_locale === "en"
																								? "Item is out of stock"
																								: " المنتج غير متوفر "
																						}
																						aria-hidden="true"></i>
																				</span>
																			</li>
																		) : (
																			<li
																				onClick={() => this.onPressAddToCart(item, index)}
																				className="list-inline-item">
																				<img
																					src={BagIcon}
																					alt="image_cart"
																					data-tip={
																						this.props.globals.store_locale === "en"
																							? "Click to add item in cart"
																							: "انقر لإضافة المنتج إلى سلة التسوق"
																					}
																				/>
																			</li>
																		)}
																		<ReactTooltip place="bottom" html={true} />
																		{/* <li className="list-inline-item">
                                                <p className="totalAmt">SAR {item.price}</p>
                                             </li> */}
																	</ul>
																</div>
																<div className="clearfix"></div>
															</div>
														</div>
													</>
												))}
											</div>
										) : (
											<div className="WarnDiv">
												<p className="WarnMessage">
													<FormattedMessage id="PageTitle.Wishlist.Empty" defaultMessage="Wishlist is empty" />
												</p>{" "}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{this.state.showPopup ? (
					<div>
						<Modal modalId="deleteModel" open={this.state.showPopup} onClose={this.closePopup}>
							<div className="modal-body">
								<div className="container-fluid nopadding">
									<div className="deleteModelpop">
										<p>
											<FormattedMessage
												id="wishlist.removePopup"
												defaultMessage="Are you sure to remove item from wishlist?"
											/>
										</p>
										<div className="ButtonDiv">
											<button className="cancelbtn" onClick={this.closePopup}>
												<FormattedMessage id="cart.removePopupCancel" defaultMessage="Cancel" />
											</button>
											<button className="okbtn" onClick={this.onRemoveClick}>
												<FormattedMessage id="cart.removePopupOk" defaultMessage="OK" />
											</button>
										</div>
									</div>
								</div>
							</div>
						</Modal>
					</div>
				) : (
					""
				)}
			</div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		globals: state.global,
		user_details: state.login,
		item_added: state.myCart.item_added,
		guest_user: state.guest_user,
		myCart: state.myCart,
		wishlistUpdated: state.wishlistUpdated,
		products: state.wishlistUpdated.wishlistProducts,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onAddToCart: (payload, myCart, eventObj,removeFromWishlist) => dispatch(actions.addToCart(payload, myCart, eventObj,removeFromWishlist)),
		onLogoutUser: (payload) => dispatch(actions.logoutUser()),
		onClearWishListCartMessageState: () => dispatch(actions.clearWishListCartMessageState()),
		onGetMyCartList: (payload) => dispatch(actions.getMyCart(payload)),
		onGetWishListItemUpdated: (payload) => dispatch(actions.getWishlistUpdated(payload)),
		onRemoveWishListUpdated: (payload) => dispatch(actions.removeWishListUpdated(payload)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Wishlist)))
