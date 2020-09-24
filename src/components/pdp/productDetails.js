import React, { Component } from "react"
import { isMobile } from "react-device-detect"
import { FormattedMessage } from "react-intl"
import { connect } from "react-redux"
import Modal from "react-responsive-modal"
import { withRouter } from "react-router-dom"
import { FacebookShareButton, TwitterShareButton } from "react-share"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from "react-tooltip"
import info from "../../assets/images/icons/info.png"
import starGrey from "../../assets/images/icons/starGrey.png"
import starYellow from "../../assets/images/icons/starYellow.png"
import warning from "../../assets/images/icons/warning.png"
import wishlistCircle from "../../assets/images/icons/wishlistCircle.png"
import minIcon from "../../assets/images/minusIcon.png"
import PluIcon from "../../assets/images/PlusIcon.png"
import AddBagAlert from "../../common/AlertBox/addToBagAlert"
import * as actions from "../../redux/actions/index"
import Pdpview from "../mypdp/mypdp"
import ProductReview from "./ProductReview"

let wishlistProducts = []
let wishlistIds = []
class ProductDetails extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showModal: false,
			showProductReviewModal: false,
			thumbnilViewMobile: "bottom",
			thumbnilViewWeb: "left",
			quantity: 1,
			addMessagePopup: false,
			addMessage: "",
			addCartLoader: false,
			isWishlistClickGuest: false,
			data: {},
		}
	}
	openModal = () => {
		this.setState({ showModal: true })
	}
	closeModal = () => {
		this.setState({ showModal: false })
	}
	openProductReviewModal = () => {
		this.setState({ showProductReviewModal: true })
	}
	closeProductReviewModal = () => {
		this.setState({ showProductReviewModal: false })
	}
	cancelReviewModel = (value) => {
		if (value === "true") {
			this.setState({ showProductReviewModal: false })
		}
	}
	reduceQty = () => {
		if (this.state.quantity > 1) {
			const quantity = this.state.quantity - 1
			this.props.updateQuantity(quantity)
			this.setState({
				quantity,
			})
		}
	}
	addQty = (limit) => {
		if (this.state.quantity < limit) {
			const quantity = this.state.quantity + 1
			this.props.updateQuantity(quantity)
			this.setState({
				quantity,
			})
		}
	}

	addToCardFunc = (item) => {
		this.props.addToCard(item)
	}

	closeAddBag = () => {
		this.setState({
			addMessagePopup: false,
		})
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.user_details.isUserLoggedIn) {
			if (nextProps.wishlistUpdated.wishlistMessage && nextProps.wishlistUpdated.wishlistItemRemoved) {
				this.setState({
					addMessagePopup: true,
					addMessage: nextProps.wishlistUpdated.wishlistMessage,
				})
				nextProps.wishlistUpdated.wishlistMessage = ""
				nextProps.wishlistUpdated.wishlistItemRemoved = false
			}
			if (nextProps.wishlistUpdated.wishlistMessage && nextProps.wishlistUpdated.wishlistItemAdded) {
				this.setState({
					addMessagePopup: true,
					addMessage: nextProps.wishlistUpdated.wishlistMessage,
				})
				nextProps.wishlistUpdated.wishlistMessage = ""
				nextProps.wishlistUpdated.wishlistItemAdded = false
			}
		}
		if (nextProps.myCart.add_cart_open_popUp && !nextProps.myCart.add_cart_error) {
			this.setState({
				Spinner: false,
				addCartLoader: false,
				addToBagFlag: true,
				addMessagePopup: true,
				addMessage:
					nextProps.globals.currentStore == 2 ? " Item has been added to the cart " : "تم إضافة المنتج إلى العربة",
			})
		} else if (nextProps.myCart.add_cart_open_popUp && nextProps.myCart.add_cart_error) {
			this.setState({
				Spinner: false,
				addCartLoader: false,
				addToBagFlag: true,
				addMessagePopup: true,
				addMessage: nextProps.myCart.addToCartMsg,
			})
		}
	}

	componentDidMount() {
		if (isMobile) {
			window.addEventListener("scroll", () => {
				var scroll = window.pageYOffset
				const sticky = document.getElementById("stickyPdp")
				if (scroll > 900 && sticky) {
					sticky.style.visibility = "visible"
				} else if (sticky) {
					sticky.style.visibility = "hidden"
				}
			})
		}
	}
	componentWillUnmount() {
		window.removeEventListener("scroll", () => {})
	}

	clickOnWishlist = (product, isInWishList) => {
		if (this.props.user_details.isUserLoggedIn) {
			if (isInWishList) {
				let data = {
					wishilistitemid: wishlistIds[wishlistProducts.indexOf(product.id)],
					product_id: product.id,
				}

				this.props.onRemoveWishList(data)
			} else {
				let data = {
					customer_id: this.props.user_details.customer_details.customer_id,
					product_id: product.id,
					super_attribute: {},
				}

				this.props.onAddToWishList(data)
			}
		} else {
			let data = {
				product_id: "",
				super_attribute: {},
			}
			if (!isInWishList) {
				data = {
					product_id: product.id,
					super_attribute: {},
				}
			}

			this.setState({
				isWishlistClickGuest: true,
				data,
			})
		}
	}

	openReviewSection = (e, product) => {
		var elmnt = document.getElementById("AccodionReview")
		if (elmnt) {
			elmnt.scrollIntoView()
			elmnt.click()
		}
	}

	closePopupWishList = () => {
		this.setState({
			isWishlistClickGuest: false,
		})
	}
	signOption = () => {
		const location = {
			pathname: `/${this.props.globals.store_locale}/login`,
			state: { from: this.props.location.pathname, data: this.state.data },
		}

		this.props.history.push(location)
	}

	closeShareIcon = () => {
		this.setState({
			isShareIcon: false,
		})
	}

	shareIcons = () => {
		this.setState({
			isShareIcon: true,
		})
	}
	pluck = (array, key) => {
		return array.map((o) => o[key])
	}

	render() {
		let { quantity } = this.state
		const { product, avgReview } = this.props
		const { wishlistUpdated } = this.props
		wishlistProducts = this.pluck(wishlistUpdated.wishlistProducts, "product_id")
		wishlistIds = this.pluck(wishlistUpdated.wishlistProducts, "wishlist_id")
		let isInWishList = false
		let productData = {}
		let additional_attributes = {}
		if (product.product) {
			productData = product.product[0]
			additional_attributes = product.product[0].additional_attributes
				? product.product[0].additional_attributes[0]
				: {}
		}

		let alertBox = null
		if (this.state.addMessagePopup) {
			alertBox = <AddBagAlert message={this.state.addMessage} alertBoxStatus={true} closeBox={this.closeAddBag} />
		}

		let isOffers = false
		if (productData.offers && productData.offers.data) {
			isOffers = true
		}

		let currentUrl = String(window.location)
		//let whatsappUrl = `https://api.whatsapp.com/send?text=${currentUrl}`;
		let appUrl = currentUrl
		let title = "Lego"
		if (wishlistProducts && product && product.product && product.product[0]) {
			if (wishlistProducts.includes(product.product[0].id)) {
				isInWishList = true
			} else {
				isInWishList = false
			}
		}

		return (
			<>
				{product && product.product && product.product[0] && (
					<div>
						<ToastContainer />
						{alertBox}
						<div className="ProductDiv">
							<div className="container">
								<div className="ProductDetails">
									<div className="pdp_Web">
										<div className="row">
											<div className="col-md-9 w_70">
												<Pdpview product={product} thumbnilView={this.state.thumbnilViewWeb} />
											</div>
											<div className="col-md-3 w_30">
												<div className="p_Feature">
													{additional_attributes.labels && (
														<span className="p_new">{additional_attributes.labels}</span>
													)}
													{/* <span className="p_new">Exclusive</span> */}
													<div className="ImageTitle">
														{/* <img id="logo" src={footerLogo} alt="product1" /> */}
														{productData.cat_img_path && <img src={productData.cat_img_path} alt="product1" />}
													</div>
													<p className="p_title">{productData.name}</p>
													<div className="p_rewiew">
														<ul onClick={(e) => this.openReviewSection(e, productData)} className="list-inline main_Ul">
															<li className="list-inline-item">
																<ul className="list-inline starList">
																	<li className="list-inline-item">
																		<span>
																			<img src={avgReview >= 0.5 ? starYellow : starGrey} alt="startYellow" />{" "}
																		</span>
																	</li>
																	<li className="list-inline-item">
																		<span>
																			<img src={avgReview >= 1.5 ? starYellow : starGrey} alt="startYellow" />
																		</span>
																	</li>
																	<li className="list-inline-item">
																		<span>
																			<img src={avgReview >= 2.5 ? starYellow : starGrey} alt="startYellow" />
																		</span>
																	</li>
																	<li className="list-inline-item">
																		<span>
																			<img src={avgReview >= 3.5 ? starYellow : starGrey} alt="startYellow" />
																		</span>
																	</li>
																	<li className="list-inline-item">
																		<span>
																			<img src={avgReview === 4.5 ? starYellow : starGrey} alt="startGrey" />
																		</span>
																	</li>
																</ul>
															</li>
															{this.props.reviews && this.props.reviews.list && (
																<li className="list-inline-item">
																	<span>
																		<span className="r_count">{this.props.reviews.list.length}</span>
																		<span className="r_text">
																			<FormattedMessage id="reviews" defaultMessage="Reviews" />
																		</span>
																	</span>
																</li>
															)}
															{this.state.showProductReviewModal ? (
																<Modal
																	modalId="sumitReviewModel"
																	open={this.state.showProductReviewModal}
																	onClose={this.closeProductReviewModal}>
																	<div>
																		<ProductReview cancelReviewModel={this.cancelReviewModel} />
																	</div>
																</Modal>
															) : (
																""
															)}
															<li className="list-inline-item">
																<span className="r_text pl-2" onClick={(e) => this.openReviewSection(e, productData)}>
																	<FormattedMessage id="pdp.submitReview" defaultMessage="Submit Review" />
																</span>
															</li>
														</ul>
														{additional_attributes.safety_warning && (
															<div className="p_warning">
																<span className="w_img">
																	<img src={warning} alt="product1" />
																</span>
																<span className="w_txt">
																	<p>{additional_attributes.safety_warning}</p>
																</span>
															</div>
														)}
														{isOffers === true && productData.offers.data && productData.offers.data["1"] && (
															<p className="p_price">
																<span>
																	{productData.currency} {productData.offers.data["1"]}
																</span>
																&nbsp;
																<span style={{ textDecoration: "line-through" }}>
																	&nbsp;{productData.currency} {productData.price}
																</span>
															</p>
														)}
														{isOffers === false && (
															<p className="p_price">{productData.currency + " " + productData.price}</p>
														)}
														<div className="p_BuyNow">
															<p
																className={
																	additional_attributes &&
																	additional_attributes.quantity_and_stock_status &&
																	additional_attributes.quantity_and_stock_status.is_in_stock
																		? "p_aviText"
																		: "p_outofstockText"
																}>
																{additional_attributes &&
																additional_attributes.quantity_and_stock_status &&
																additional_attributes.quantity_and_stock_status.is_in_stock ? (
																	<FormattedMessage id="pdp.available_Now" defaultMessage="Available now" />
																) : (
																	<FormattedMessage id="pdp.OutOfStock" defaultMessage="Out of stock" />
																)}
															</p>
															<div className="p_qty">
																<div className="row">
																	{additional_attributes.quantity_and_stock_status.is_in_stock ? (
																		<div className="col-6">
																			<div className="QtyCounter">
																				<span className="minus">
																					<img
																						className={quantity === 1 ? "blur " : ""}
																						onClick={() => this.reduceQty()}
																						src={minIcon}
																						alt="minIcon"
																					/>
																				</span>
																				<input value={quantity} type="text" />
																				<span className="plus">
																					<img
																						className={
																							parseInt(additional_attributes.quantity_and_stock_status.qty) === quantity
																								? "blur "
																								: ""
																						}
																						onClick={(e) =>
																							this.addQty(parseInt(additional_attributes.quantity_and_stock_status.qty))
																						}
																						src={PluIcon}
																						alt="minIcon"></img>
																				</span>
																			</div>
																		</div>
																	) : (
																		<div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
																	)}
																	<div className="col-6 pd-zer0">
																		<div className="limitDiv">
																			<span className="limit">
																				<FormattedMessage id="pdp.Limit" defaultMessage="Limit " />
																				{additional_attributes.quantity_and_stock_status
																					? additional_attributes.quantity_and_stock_status.qty
																					: ""}
																			</span>
																			<img
																				src={info}
																				data-tip={
																					this.props.globals.store_locale === "en"
																						? "We restrict the limit a household can buy in order to <br /> be fair to all of our fans.<br /> If you’ve already reached that limit through previous<br /> orders your order may be cancelled."
																						: " إننا نقيد الحد الذي يمكن لكل أسرة شراءه، وذلك حتى نكون منصفين مع جميع معجبينا. فإذا وصلت لذلك الحد من خلال طلبات سابقة، فمن الممكن أن يلغى طلبك.  "
																				}
																				alt="minIcon"
																			/>
																			<ReactTooltip place="top" html={true} />
																		</div>
																	</div>
																</div>
															</div>
															<div className="addBag">
																{additional_attributes.quantity_and_stock_status.is_in_stock ? (
																	<button className="" onClick={(e) => this.addToCardFunc(productData)}>
																		<FormattedMessage id="add_to_bag" defaultMessage="Add to Bag" />
																	</button>
																) : this.props.notified ? (
																	<button className="btn-disabled" disabled>
																		<FormattedMessage id="Notified" defaultMessage="Notified" />
																	</button>
																) : (
																	<button
																		className="btn-disabled"
																		onClick={() => this.props.notifyMe(product.product[0].id)}>
																		<FormattedMessage id="NotifyMe" defaultMessage="Notify Me" />
																		{this.props.notifiedLoader && (
																			<i class="fa fa-spinner fa-spin ml-1 mr-1" aria-hidden="true"></i>
																		)}
																	</button>
																)}
															</div>
															<div className="Ad-wishList">
																{this.props.wishlistUpdated.wishlistLoader &&
																this.props.wishlistUpdated.wishlistLoadingProductId === productData.id ? (
																	<i class="fa fa-spinner fa-spin wishIcon wishlist-center"></i>
																) : isInWishList ? (
																	<svg
																		onClick={(e) => this.clickOnWishlist(productData, true)}
																		width="100%"
																		height="100%"
																		viewBox="0 0 40 40"
																		alt=""
																		className="WishlistButtonstyles__StyledWishlistIcon-d720r1-1 hFCcpa wishlisted"
																		data-di-res-id="1cea8bce-ab0dac42"
																		data-di-rand="1590672027864">
																		<rect fill="#F8F8F8" width="40" height="40" rx="20"></rect>
																		<path
																			d="M19.986 30l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C30 14.569 27.398 12 24.187 12A5.829 5.829 0 0 0 20 13.762 5.827 5.827 0 0 0 15.815 12C12.604 12 10 14.569 10 17.739a5.68 5.68 0 0 0 1.782 4.126"
																			fill="#006DB7"></path>
																		<path
																			d="M26.84 20.417L20 27.204l-6.84-6.787A3.67 3.67 0 0 1 12 17.739C12 15.677 13.71 14 15.815 14a3.82 3.82 0 0 1 2.754 1.159l1.43 1.467 1.433-1.467A3.818 3.818 0 0 1 24.186 14C26.289 14 28 15.677 28 17.739a3.673 3.673 0 0 1-1.16 2.678M19.986 30l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C30 14.569 27.398 12 24.187 12A5.829 5.829 0 0 0 20 13.762 5.827 5.827 0 0 0 15.815 12C12.604 12 10 14.569 10 17.739a5.68 5.68 0 0 0 1.782 4.126"
																			fill="#006DB7"></path>
																	</svg>
																) : (
																	<img
																		onClick={(e) => this.clickOnWishlist(productData, false)}
																		className="wishIcon"
																		src={wishlistCircle}
																		alt="wishlistCircle"
																	/>
																)}
																{!(
																	this.props.wishlistUpdated.wishlistLoader &&
																	this.props.wishlistUpdated.wishlistLoadingProductId === productData.id
																) && (
																	<span>
																		<FormattedMessage id="Add_to_Wishlist" defaultMessage="Add to Wishlist" />
																	</span>
																)}
																<span onClick={() => this.shareIcons()}>
																	<span className="shareIcon">
																		{/* <img className="shareImage" src={shreIcon}></img> */}
																		<i class="fa fa-share-alt shareImage" aria-hidden="true"></i>
																		&nbsp;
																		<FormattedMessage id="Share" defaultMessage="Share" />
																	</span>
																</span>
															</div>
															{/* <div className="ShopMore">
                                          <p>Shope more like this</p>
                                          <ul className="list-inline">
                                             <li className="list-inline-item"><a href="">Building</a></li>
                                             <li className="list-inline-item"><a href="">Instruction </a></li>
                                             <li className="list-inline-item"><a href="">Export</a></li>
                                          </ul>
                                       </div> */}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="pdp_Mob">
										<div className="row">
											<div className="col-12 col-sm-7 col-md-12 col-xl-7  paddZero">
												<Pdpview product={product} thumbnilView={this.state.thumbnilViewMobile} />
												{/* <div className="thumbSlider">
                                 <ul className="list-inline">
                                    <div className="arrowUp"><img src={arrowDown} alt="product1" /></div>
                                    <li><a href="#"><img src={pdp12} alt="product1" /></a></li>
                                    <li><a href="#"><img src={pdp11} alt="product1" /></a></li>
                                    <li><a href="#"><img src={pdp12} alt="product1" /></a></li>
                                    <div className="arrowDn"><img src={arrowDown} alt="product1" /></div>
                                 </ul>
                              </div> */}
											</div>
											<div className="col-12 col-sm-5 col-md-12 col-xl-5 w_30">
												<div className="p_Feature">
													{additional_attributes.labels && (
														<span className="p_new">{additional_attributes.labels}</span>
													)}
													<div className="ImageTitle">
														{/* <img id="logo" src={footerLogo} alt="product1" /> */}
														{productData.cat_img_path && <img src={productData.cat_img_path} alt="product1" />}
													</div>
													<p className="p_title">{productData.name}</p>
													<div className="p_rewiew">
														<ul className="list-inline main_Ul">
															<li className="list-inline-item">
																<ul className="list-inline starList">
																	<li className="list-inline-item">
																		<span>
																			<img src={avgReview >= 0.5 ? starYellow : starGrey} alt="startYellow" />{" "}
																		</span>
																	</li>
																	<li className="list-inline-item">
																		<span>
																			<img src={avgReview >= 1.5 ? starYellow : starGrey} alt="startYellow" />
																		</span>
																	</li>
																	<li className="list-inline-item">
																		<span>
																			<img src={avgReview >= 2.5 ? starYellow : starGrey} alt="startYellow" />
																		</span>
																	</li>
																	<li className="list-inline-item">
																		<span>
																			<img src={avgReview >= 3.5 ? starYellow : starGrey} alt="startYellow" />
																		</span>
																	</li>
																	<li className="list-inline-item">
																		<span>
																			<img src={avgReview === 4.5 ? starYellow : starGrey} alt="startGrey" />
																		</span>
																	</li>
																</ul>
															</li>
															{this.props.reviews && this.props.reviews.list && (
																<li className="list-inline-item">
																	<span>
																		<span className="r_count">{this.props.reviews.list.length}</span>
																		<span className="r_text">
																			<FormattedMessage id="reviews" defaultMessage="Reviews" />
																		</span>
																	</span>
																</li>
															)}
															<li className="list-inline-item">
																<span className="r_text" onClick={(e) => this.openReviewSection(e, productData)}>
																	<FormattedMessage id="pdp.submitReview" defaultMessage="Submit Review" />
																</span>
															</li>
														</ul>
														{additional_attributes.safety_warning && (
															<div className="p_warning">
																<span className="w_img">
																	<img src={warning} alt="product1" />
																</span>
																<span className="w_txt">
																	<p>{additional_attributes.safety_warning}</p>
																</span>
															</div>
														)}
														<p className="p_price">{productData.currency + " " + productData.price}</p>
														<div className="p_BuyNow">
															<p
																className={
																	additional_attributes &&
																	additional_attributes.quantity_and_stock_status &&
																	additional_attributes.quantity_and_stock_status.is_in_stock
																		? "p_aviText"
																		: "p_outofstockText"
																}>
																{additional_attributes &&
																additional_attributes.quantity_and_stock_status &&
																additional_attributes.quantity_and_stock_status.is_in_stock ? (
																	<FormattedMessage id="pdp.available_Now" defaultMessage="Available now" />
																) : (
																	<FormattedMessage id="pdp.OutOfStock" defaultMessage="Out of stock" />
																)}
															</p>
															<div className="p_qty">
																<ul className="list-inline">
																	{additional_attributes.quantity_and_stock_status.is_in_stock ? (
																		<li className="list-inline-item">
																			<div className="QtyCounter">
																				<span className="minus">
																					<img
																						className={quantity === 1 ? "blur " : ""}
																						onClick={() => this.reduceQty()}
																						src={minIcon}
																						alt="minIcon"
																					/>
																				</span>
																				<input value={quantity} type="text" placeholder="0" />
																				{/* plus and minus onclick add class "btnActive"*/}
																				<span className="plus btnActive">
																					<img
																						className={
																							parseInt(additional_attributes.quantity_and_stock_status.qty) === quantity
																								? "blur "
																								: ""
																						}
																						onClick={(e) =>
																							this.addQty(parseInt(additional_attributes.quantity_and_stock_status.qty))
																						}
																						src={PluIcon}
																						alt="minIcon"
																					/>
																				</span>
																			</div>
																		</li>
																	) : (
																		<></>
																	)}
																	<li className="list-inline-item">
																		<div className="limitDiv">
																			<span className="limit">
																				<FormattedMessage id="pdp.Limit" defaultMessage="Limit" />{" "}
																				{" " + additional_attributes.quantity_and_stock_status.qty}
																			</span>
																			<img
																				src={info}
																				data-tip={
																					this.props.globals.store_locale === "en"
																						? "We restrict the limit a household can buy in order to<br /> be fair to all of our fans.<br /> If you’ve already reached that limit through previous<br /> orders your order may be cancelled."
																						: " إننا نقيد الحد الذي يمكن لكل أسرة شراءه، وذلك حتى نكون منصفين مع جميع معجبينا. فإذا وصلت لذلك الحد من خلال طلبات سابقة، فمن الممكن أن يلغى طلبك.  "
																				}
																				alt="minIcon"
																			/>
																			<ReactTooltip place="top" html={true} />
																		</div>
																	</li>
																</ul>
															</div>
															<div id="mobBtn" className="addBag">
																{additional_attributes.quantity_and_stock_status.is_in_stock ? (
																	<button className="" onClick={(e) => this.addToCardFunc(productData)}>
																		<FormattedMessage id="add_to_bag" defaultMessage="Add to Bag" />
																	</button>
																) : this.props.notified ? (
																	<button className="btn-disabled" disabled>
																		<FormattedMessage id="Notified" defaultMessage="Notified" />
																	</button>
																) : (
																	<button
																		className="btn-disabled"
																		onClick={() => this.props.notifyMe(product.product[0].id)}>
																		<FormattedMessage id="NotifyMe" defaultMessage="Notify Me" />
																		{this.props.notifiedLoader && (
																			<i class="fa fa-spinner fa-spin ml-1 mr-1" aria-hidden="true"></i>
																		)}
																	</button>
																)}
															</div>
															<div className="Ad-wishList">
																{this.props.wishlistUpdated.wishlistLoader &&
																this.props.wishlistUpdated.wishlistLoadingProductId === productData.id ? (
																	<i class="fa fa-spinner fa-spin wishIcon wishlist-center"></i>
																) : isInWishList ? (
																	<svg
																		onClick={(e) => this.clickOnWishlist(productData, true)}
																		width="100%"
																		height="100%"
																		viewBox="0 0 40 40"
																		alt=""
																		class="WishlistButtonstyles__StyledWishlistIcon-d720r1-1 hFCcpa wishlisted"
																		data-di-res-id="1cea8bce-ab0dac42"
																		data-di-rand="1590672027864">
																		<rect fill="#F8F8F8" width="40" height="40" rx="20"></rect>
																		<path
																			d="M19.986 30l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C30 14.569 27.398 12 24.187 12A5.829 5.829 0 0 0 20 13.762 5.827 5.827 0 0 0 15.815 12C12.604 12 10 14.569 10 17.739a5.68 5.68 0 0 0 1.782 4.126"
																			fill="#006DB7"></path>
																		<path
																			d="M26.84 20.417L20 27.204l-6.84-6.787A3.67 3.67 0 0 1 12 17.739C12 15.677 13.71 14 15.815 14a3.82 3.82 0 0 1 2.754 1.159l1.43 1.467 1.433-1.467A3.818 3.818 0 0 1 24.186 14C26.289 14 28 15.677 28 17.739a3.673 3.673 0 0 1-1.16 2.678M19.986 30l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C30 14.569 27.398 12 24.187 12A5.829 5.829 0 0 0 20 13.762 5.827 5.827 0 0 0 15.815 12C12.604 12 10 14.569 10 17.739a5.68 5.68 0 0 0 1.782 4.126"
																			fill="#006DB7"></path>
																	</svg>
																) : (
																	<img
																		onClick={(e) => this.clickOnWishlist(productData, false)}
																		className="wishIcon"
																		src={wishlistCircle}
																		alt="wishlistCircle"
																	/>
																)}
																{!(
																	this.props.wishlistUpdated.wishlistLoader &&
																	this.props.wishlistUpdated.wishlistLoadingProductId === productData.id
																) && (
																	<span>
																		<FormattedMessage id="Add_to_Wishlist" defaultMessage="Add to Wishlist" />
																	</span>
																)}
																<span onClick={() => this.shareIcons()}>
																	<span className="shareIcon">
																		{/* <img className="shareImage" src={shreIcon}></img> */}
																		<i class="fa fa-share-alt shareImage" aria-hidden="true"></i>
																		&nbsp;
																		<FormattedMessage id="Share" defaultMessage="Share" />
																	</span>
																</span>
															</div>
															{/* <div className="ShopMore">
                                          <p>Shope more like this</p>
                                          <ul className="list-inline">
                                             <li className="list-inline-item"><a href="">Building</a></li>
                                             <li className="list-inline-item"><a href="">Instruction </a></li>
                                             <li className="list-inline-item"><a href="">Export</a></li>
                                          </ul>
                                       </div> */}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				{this.state.isWishlistClickGuest && (
					<div>
						<Modal modalId="deleteModel" open={this.state.isWishlistClickGuest} onClose={this.closePopupWishList}>
							<div className="modal-body">
								<div className="container-fluid nopadding">
									<div className="deleteModelpop">
										<p>
											<FormattedMessage
												id="cart.guestWishlistMsg"
												defaultMessage="Please sign-in to save the item to the wishlist"
											/>
										</p>
										<div className="ButtonDiv">
											<button className="cancelbtn" onClick={this.closePopupWishList}>
												<FormattedMessage id="cart.removePopupCancel" defaultMessage="Cancel" />
											</button>
											<button className="okbtn" onClick={this.signOption}>
												<FormattedMessage id="cart.removePopupOk" defaultMessage="OK" />
											</button>
										</div>
									</div>
								</div>
							</div>
						</Modal>
					</div>
				)}
				{this.state.isShareIcon && (
					<div>
						<Modal modalId="deleteModelShareIcon" open={this.state.isShareIcon} onClose={this.closeShareIcon}>
							<div className="modal-body">
								<div className="container-fluid nopadding">
									<div class="sharePopupOuter">
										<div className="row">
											<div className="col-12">
												<ul className="footer_ul_amrc list-inlne">
													<li className="list-inline-item">
														{/* <div aria-label="twitter" role="button" tabindex="0" 
                                                            className="SocialMediaShareButton SocialMediaShareButton--twitter" >
                                                               <a target="blank" href="https://twitter.com/LEGO_Group">
                                                                  <i className="fa fa-twitter tw" aria-hidden="true" style={{fontSize: '50px'}}></i>
                                                                  <p>Twitter</p>
                                                               </a>
                                                            </div> */}
														<TwitterShareButton title={title} url={appUrl}>
															<i className="fa fa-twitter tw" aria-hidden="true"></i>
															<p style={{ fontSize: 12 }}>Twitter</p>
														</TwitterShareButton>
													</li>
													<li className="list-inline-item">
														<a target="blank" href="https://www.instagram.com/lego/">
															<i className="fa fa-instagram inst" aria-hidden="true"></i>
															<p>Instagram</p>
														</a>
													</li>
													<li className="list-inline-item">
														<FacebookShareButton title={title} url={appUrl}>
															<i className="fa fa-facebook fb" aria-hidden="true"></i>
															<p style={{ fontSize: 12 }}>Facebook</p>
														</FacebookShareButton>
													</li>
													<li className="list-inline-item">
														<a target="blank" href="https://www.youtube.com/user/LEGO?app=desktop">
															<i className="fa fa-youtube wp socialLinks" aria-hidden="true"></i>
															<p>Youtube</p>
														</a>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Modal>
					</div>
				)}
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		customer_details: state.login,
		guest_user: state.guest_user,
		product: state.product,
		user_details: state.login,
		myCart: state.myCart,
		wishlistUpdated: state.wishlistUpdated,
		notify: state.notify,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onAddToWishList: (payload) => dispatch(actions.addToWishlistUpdated(payload)),
		onRemoveWishList: (payload) => dispatch(actions.removeWishListUpdated(payload)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductDetails))
