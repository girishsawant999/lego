import React, { Component } from "react"
import Slider from "react-slick"
// import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"
// import "bootstrap/dist/css/bootstrap.css"
import wishlistCircle from "../../assets/images/icons/wishlistCircle.png"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import * as actions from '../../redux/actions/index';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';

let wishlistProducts = []
let wishlistIds = []
class FeatureSlider extends Component {
	constructor(props) {
		super(props)
		// this.data = this.props.data.product_data
		this.state = {
			activeSlide2: 0,
			totalFeatureCount: Object.keys(this.props.data.product_data).length,
			GrayWidth: 0,
			WhiteWidth: 0,
			nextProps: [],
			notifiedProduct: null,
			isWishlistClickGuest: false,
		}
	}
	componentDidMount() {
		const GreyStripe = document.querySelector(".GreyStripe")
		const WhiteStripe = document.querySelector(".WhiteStripe")
		GreyStripe.style.width = WhiteStripe.offsetWidth / this.state.totalFeatureCount
		this.setState({
			GrayWidth: WhiteStripe.offsetWidth / this.state.totalFeatureCount,
			WhiteWidth: WhiteStripe.offsetWidth,
		})
	}
	addToWishList = (product) => {
		if (this.props.user_details.isUserLoggedIn) {
			product.id = product.product_id
			this.props.addToWishList(product)
		} else {
			this.setState({
				isWishlistClickGuest: true,
			})
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
			state: { from: this.props.location.pathname },
		}

		this.props.history.push(location)
	}

	closeAddBag = () => {
		this.setState({
			addMessagePopup: false,
		})
	}

	removeFromWishlist = (product) => {
		product.wishListId = wishlistIds[wishlistProducts.indexOf(product.product_id)]
		this.props.removeFromWishlist(product)
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.myCart.add_cart_open_popUp && !nextProps.myCart.add_cart_error) {
			this.setState({
				// Spinner: false,
				addCartLoader: false,
				addToBagFlag: true,
				addMessagePopup: true,
				addMessage:
					nextProps.globals.currentStore == 2 ? " Item has been added to the cart " : "تم إضافة المنتج إلى العربة",
			})
		} else if (nextProps.myCart.add_cart_open_popUp && nextProps.myCart.add_cart_error) {
			this.setState({
				// Spinner: false,
				addCartLoader: false,
				addToBagFlag: true,
				addMessagePopup: true,
				addMessage: nextProps.myCart.addToCartMsg,
			})
		}
		this.setState({ nextProps })
	}

	addToCard = (item) => {
		const { user_details, globals, guest_user } = this.props
		let eventObj = {
			currency: item.currency,
			product: [
				{
					name: item.name,
					id: item.sku,
					price: item.offers
						? item.offers.data && item.offers.data["1"]
							? item.offers.data && item.offers.data["1"]
							: item.product_price
						: item.product_price,
					brand: "Google",
					category: item.category_names,
					quantity: "1",
					// size : this.state.size_state.text
				},
			],
		}
		if (user_details.isUserLoggedIn) {
			let cart_item = {
				cart_item: {
					quote_id: user_details.customer_details.quote_id,
					product_type: "configurable",
					sku: item.sku,
					qty: 1,
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
				quote_id: user_details.customer_details.quote_id,
				store_id: globals.currentStore,
			}

			this.props.onAddToCart(cart_item, myCart, eventObj)
		} else {
			let quote_id = guest_user.temp_quote_id
			// if (this.props.guest_user && this.props.guest_user.new_quote_id) {
			// quote_id = this.props.guest_user.new_quote_id;
			// } else if (this.props.guest_user && !this.props.guest_user.new_quote_id) {
			//    quote_id = this.props.guest_user.temp_quote_id
			// }
			let cart_item = {
				cart_item: {
					quote_id: quote_id,
					product_type: "simple",
					sku: item.sku,
					qty: 1,
				},
			}

			const myCart = {
				quote_id: quote_id,
				store_id: globals.currentStore,
			}

			this.props.onGuestAddToCart(cart_item, myCart, eventObj)
		}
	}

	notifyMe = (productId) => {
		if (this.props.user_details.isUserLoggedIn) {
			let payload = {
				product_id: productId,
				customer_id: this.props.user_details.customer_details.customer_id,
				store: this.props.globals.currentStore,
			}
			this.props.onNotifyMe(payload)
			this.setState({
				notifiedProduct: productId,
			})
		} else {
			const location = {
				pathname: `/${this.props.globals.store_locale}/login`,
				state: { from: this.props.location.pathname },
			}

			this.props.history.push(location)
		}
	}
	pluck = (array, key) => {
		return array.map((o) => o[key])
	}
	render() {
		const { store_locale } = this.props.globals
		const { product_data } = this.props.data
		const { wishlistUpdated } = this.props
		wishlistProducts = this.pluck(wishlistUpdated.wishlistProducts, "product_id")
		wishlistIds = this.pluck(wishlistUpdated.wishlistProducts, "wishlist_id")
		var settings4 = {
			dots: false,
			arrows: true,
			infinite: Object.keys(this.props.data.product_data).length > 3,
			speed: 800,
			slidesToShow: 4,
			slidesToScroll: 1,
			centerMode: false,
			autoplay: false,
			centerPadding: "0",
			autoplaySpeed: 50000,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
			],
			afterChange: (current) => this.setState({ activeSlide2: current }),
		}

		let products = product_data ? Object.values(product_data) : []

		if (products && wishlistProducts) {
			products.forEach((product) => {
				if (wishlistProducts.includes(product.product_id)) {
					product.isInWishList = true
				} else {
					product.isInWishList = false
				}
			})
		}

		let alertBox = null
		if (this.state.notifiedProduct && this.props.notify.message) {
			this.props.notify.message = ""
			products.map((product) => {
				if (product.product_id === this.state.notifiedProduct) {
					product["notified"] = true
					return null
				}
			})
		}
		return (
			<div>
				{alertBox}
				<div className="featureSet">
					<div className="container">
						<p className="headTitle">
							{" "}
							<FormattedMessage id="Featured.sets" defaultMessage="Featured sets" />
						</p>
						<div className="featureSetSlider" id="">
							<Slider {...settings4} className="sliderMain">
								{products &&
									products.map((product, index) => {
										return (
											<div key={index}>
												<div className="productItem">
													<Link to={`/${store_locale}/productdetails/${product.url_key}`}>
														<div className="imageDiv">
															<img src={product.imageUrl} alt="logoSlider2" />
														</div>
													</Link>
													{this.props.wishlistUpdated.wishlistLoader &&
													this.props.wishlistUpdated.wishlistLoadingProductId === product.product_id ? (
														<i class="fa fa-spinner fa-spin wishIcon wishlist-center"></i>
													) : product.isInWishList ? (
														<svg
															onClick={() => this.removeFromWishlist(product)}
															width="32"
															height="32"
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
															onClick={() => this.addToWishList(product)}
															className="wishIcon"
															src={wishlistCircle}
															alt="wishlistCircle"
														/>
													)}
												</div>
												<div className="productdetails">
													<Link to={`/${store_locale}/productdetails/${product.url_key}`}>
														<p className="productTitle featured_ellipsis">{product.name}</p>
													</Link>
													{/* <ul className="list-inline">
											<li className="list-inline-item">
												<Link to="">
													<img src={starYellow} alt="startYellow" />{" "}
												</Link>
											</li>
											<li className="list-inline-item">
												<Link to="">
													<img src={starYellow} alt="startYellow" />
												</Link>
											</li>
											<li className="list-inline-item">
												<Link to="">
													<img src={starYellow} alt="startYellow" />
												</Link>
											</li>
											<li className="list-inline-item">
												<Link to="">
													<img src={starYellow} alt="startYellow" />
												</Link>
											</li>
											<li className="list-inline-item">
												<Link to="">
													<img src={starGrey} alt="startGrey" />
												</Link>
											</li>
										</ul>*/}
													<p className="productNumber mb-1">{product.lego_id}</p>
													<p className="productPrice">
														{product.currency} {product.product_price}
													</p>
													{product.quantity_and_stock_status.is_in_stock ? (
														<button onClick={() => this.addToCard(product)} className="">
															<FormattedMessage id="AddtoBag" defaultMessage="Add to Bag" />
														</button>
													) : product.notified || product.notification_status ? (
														<button className="btn-disabled" disabled>
															<FormattedMessage id="Notified" defaultMessage="Notified" />
														</button>
													) : (
														<button className="btn-disabled" onClick={() => this.notifyMe(product.product_id)}>
															<FormattedMessage id="NotifyMe" defaultMessage="Notify Me" />
															{this.props.notify &&
																this.props.notify.notifyLoader &&
																this.state.notifiedProduct === product.product_id && (
																	<i class="fa fa-spinner fa-spin ml-1 mr-1" aria-hidden="true"></i>
																)}
														</button>
													)}
												</div>
											</div>
										)
									})}
							</Slider>
						</div>
						<div className="WhiteStripe" style={{ direction: "ltr" }}>
							<div
								className="GreyStripe"
								style={{
									width: this.state.GrayWidth,
									transform: `translateX(${this.state.GrayWidth * this.state.activeSlide2}px)`,
								}}></div>
						</div>
					</div>
				</div>
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
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		wishlistUpdated: state.wishlistUpdated,
		user_details: state.login,
		myCart: state.myCart,
		guest_user: state.guest_user,
		notify: state.notify,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGuestAddToCart: (payload, myCart, eventObj) => dispatch(actions.guestAddToCart(payload, myCart, eventObj)),
		onAddToCart: (payload, myCart, eventObj) => dispatch(actions.addToCart(payload, myCart, eventObj)),
		onNotifyMe: (payload) => dispatch(actions.notifyMe(payload)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeatureSlider))
