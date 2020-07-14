import React, { Component } from "react"
import ProductDetails from "../pdp/productDetails"
import CountDetails from "../pdp/countDetails"
import PdpAccordion from "../pdp/pdpAccordion"
import LogoSlider from "../../components/HomeComponent/logoSlider"
import Breadcrumb from "../../common/breadcrumbNew"
import RecommandedForYou from "../../components/HomeComponent/recommandedForYou"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import * as actions from "../../redux/actions/index"
import Spinner2 from "../Spinner/Spinner2"
import { FormattedMessage } from "../../../node_modules/react-intl"
import AlertBox from '../../common/AlertBox/QTYAlert';
import AddBagAlert from '../../common/AlertBox/addToBagAlert';
import cookie from "react-cookies"
import { visited } from "glamor"
import { initializeGTMWithEvent, productDetailsEvent } from '../utility/googleTagManager';
import { createMetaTags } from '../utility/meta'


let isGTMcalled = false;
let wishlistClick = false;
let removeWishlistClick = false;
class PdpMain extends Component {
	constructor(props) {
		super(props)
		this.state = {
			quantity: 1,
			alertModalFlag: false,
			message: '',
			addMessagePopup: false,
			addMessage: '',
			notifiedProduct :null,
		}

		this.updateQuantity = this.updateQuantity.bind(this)
		// this.addToCard = this.addToCard.bind(this);
	}
	componentWillMount() {
		const payload = {
			store: this.props.globals.currentStore,
			categories : cookie.load('visitedProducts') ? cookie.load('visitedProducts').toString(',') : '',
			cid: this.props.user_details.isUserLoggedIn ? this.props.user_details.customer_details.customer_id : ''
		 }
		this.props.onGetRecommendedData(payload)
		const data = {
			store_id: this.props.globals.currentStore,
			url_key: this.props.match.params.url_path,
			cid: this.props.user_details.isUserLoggedIn ? this.props.user_details.customer_details.customer_id : "",
		}

		this.props.getProductDetails(data)
	}
	
	
	componentDidUpdate(prevProps, prevState) {
		if (this.props.location.key !== prevProps.location.key) {
			const data = {
				store_id: this.props.globals.currentStore,
				url_key: this.props.match.params.url_path,
				cid: this.props.user_details.isUserLoggedIn ? this.props.user_details.customer_details.customer_id : "",
			}
			this.props.getProductDetails(data)
			window.scrollTo(0,0)
		}
	}
	componentDidMount() {
		window.scrollTo(0,0)
	}
	
	updateQuantity = (quantity) => {
		this.setState({
			quantity,
		})
	}

	addToCard = (item) => {
		let eventObj = {
            currency: item.currency,
            product: [{
                name: item.name,
                id: item.sku,
                price: item.offers ? (item.offers.data && item.offers.data['1'] ? item.offers.data && item.offers.data['1'] : item.price) : item.price,
                brand: 'Google',
                category: item.category_names,
                quantity: this.state.quantity,
                // size : this.state.size_state.text
            }]
		};
		
		if (this.props.user_details.isUserLoggedIn) {
			let cart_item = {
				cart_item: {
					quote_id: this.props.user_details.customer_details.quote_id,
					product_type: "configurable",
					sku: item.sku,
					qty: this.state.quantity,
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
			this.props.onAddToCart(cart_item, myCart, eventObj)
		} else {
			let quote_id = this.props.guest_user.temp_quote_id
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
					qty: this.state.quantity,
				},
			}

			const myCart = {
				quote_id: quote_id,
				store_id: this.props.globals.currentStore,
			}

			this.props.onGuestAddToCart(cart_item, myCart, eventObj)
		}
	}
	componentWillReceiveProps = (nextProps) => {
		if (nextProps.user_details.isUserLoggedIn) {
			if (nextProps.wishList && !nextProps.wishList.wishLoader && nextProps.wishList.addwishlist && !nextProps.wishList.removewishlist &&   nextProps.wishList.productWishDetail && nextProps.wishList.productWishDetail.is_in_wishlist
			   && wishlistClick) {
				wishlistClick = false;
			  this.setState({
				 addMessagePopup: true,
				 addMessage: nextProps.globals.currentStore == 2 ? ' Item has been Added To Wish List ' : 'تم إضافة المنتج إلى قائمة الأمنيات'
			  });
		   } else if ((nextProps.wishList && !nextProps.wishList.wishLoader && !nextProps.wishList.addwishlist && nextProps.wishList.removewishlist &&  nextProps.wishList.productWishDetail && removeWishlistClick &&
			(nextProps.wishList.productWishDetail.is_in_wishlist ==='' || !nextProps.wishList.productWishDetail.is_in_wishlist))) {
				removeWishlistClick = false;
				this.setState({
					is_wishlist: false,
					wishlistId: '',
					Spinner: false,
					addMessagePopup: true,
					addMessage: nextProps.globals.currentStore == 2 ? ' Item has been removed from Wish List ' : 'تم إزالة المنتج من  قائمة الأمنيات'
				});
		   }
		}

		if(nextProps.product && nextProps.product.status && !isGTMcalled){
			let item = nextProps.product;
			let product = item && item.product && item.product[0];
			productDetailsEvent({
				name: product.name,
				id: product.sku,
				price: product.offers ? (product.offers.data && product.offers.data['1'] ? product.offers.data && product.offers.data['1'] : product.price) : product.price,
				brand: 'Google',
				category: product.category_names,
				currency: product.currency
			});

			isGTMcalled = true ;
		}

		if (nextProps.notify.message) {    
            if(this.props.globals.store_locale === 'en') {
                this.setState({
                addMessagePopup: true,
                addMessage: nextProps.notify.notified ? "Notification alert already saved" :  "Notification alert saved"
                })
            } else {
                this.setState({
                addMessagePopup: true,
                addMessage: nextProps.notify.notified ? "تم حفظ التنبيه مسبقا" :  "تم حفظ التنبيه "
                })
            }
        }
	}

	addToWishList = (product) => {
		wishlistClick = true
		const { globals, wishList, user_details } = this.props
		//let wishListProduct = wishList.products;
		let data = {
			customer_id: user_details.customer_details.customer_id,
			product_id: product.id,
			super_attribute: {},
		}
		this.props.onAddToWishList(data);
	}
	removeFromWishlist = (product) => {
		removeWishlistClick = true
		let data = {
			wishilistitemid: product.wishListId,
		}

		this.props.onRemoveWishList(data)
	}
	closeAddBag = () => {
		this.setState({
			addMessagePopup: false,
		})
	}
	setRecommenddedProduct = (category_id) => {
		const days = 1000 * 60 * 60 * 24 * 14
		const expires = new Date()
		expires.setDate(Date.now() + days)
		const visited = cookie.load("visitedProducts") ? cookie.load("visitedProducts") : []
		const lVisited = visited.length
		if (lVisited > 8) {
			visited.shift()
		}
		if (!visited.includes(category_id)) visited.push(category_id)
		cookie.save("visitedProducts", visited, { path: "/", expires, maxAge: days })
	}

	notifyMe = (productId) => {
        if (this.props.user_details.isUserLoggedIn ){
            let payload = {
            product_id: productId,
			customer_id: this.props.user_details.customer_details.customer_id,
			store: this.props.globals.currentStore
        }
		this.props.onNotifyMe(payload)
		this.setState({
			notifiedProduct:productId
		})
        } else {
            const location = {
                pathname: `/${this.props.globals.store_locale}/login`,
                state: { from: this.props.location.pathname }
              }

            this.props.history.push(location);
        }
        
	}

	render() {
		let { product, reviews } = this.props
		const { store_locale } = this.props.globals
		if (this.props.globals.loading || !product) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
		}

		let avgReview = 0
		if (reviews && reviews.total_reviews && reviews.total_reviews !== 0 && reviews.rating_summary) {
			avgReview = parseInt(reviews.rating_summary) / 20
		}
		let breadcrumbData = []
		if (product && product.product && product.product[0]) {
			// this.setRecommenddedProduct(product.product[0].category_id)
			// let url = product.product[0].breadcrumb
			// url = url.split("/")
			// url.push(url.pop().replace(".html", ""))
			// url.push(product.product[0].name)
			// breadcrumbData = url
			breadcrumbData.push({url_key: "themes.html", name: "THEMES"})
			breadcrumbData.push({url_key: product.product[0].breadcrumb, name: product.product[0].breadcrumb_cat_name_format})
			breadcrumbData.push({url_key: "#", name: product.product[0].name})		}

		let alertBox = null;
		if (this.state.alertModalFlag) {
            alertBox = <AlertBox
                message={this.state.message}
                alertBoxStatus={true}
                closeBox={this.closeErrorBox} />
		}
		let alertBoxWIshlist = null;
		if (this.state.addMessagePopup) {
			alertBoxWIshlist = <AddBagAlert
				message={this.state.addMessage}
				alertBoxStatus={true}
				closeBox={this.closeAddBag} />
		}
		if(this.state.notifiedProduct && this.props.notify.message) {
			this.props.notify.message = ''
			product.product[0].notified = true
			this.setState({notifiedProduct : null})
		}
		
		return (
			<div>
				{alertBox}
				{alertBoxWIshlist}
				{product && (
					<div className="PdpMainPage">
						<div id="stickyPdp" class="stickyPdp">
							{product && product.product && product.product[0] && (
								<div class="stickyGrid">
									<div className="row">
										<div className="col-7 textPadd">
										<div class="leftSidetext">
										<span class="centralPeark">{product.product[0].name}</span>
										<div class="PriceLine">
											<span class="DollerPrice">
												<span class="VisuallyHidden-sc-1dwqwvm-0">
													<FormattedMessage id="pdp.Price" defaultMessage="Price" />
												</span>
												{product.product[0].currency + " " + product.product[0].price}
											</span>
										</div>
									</div>
										</div>
										<div className="col-5">
										<div class="alignRtM">
										{product.product[0].additional_attributes[0].quantity_and_stock_status.is_in_stock ? <button
											onClick={(e) => this.addToCard(product.product[0])}
											type="submit"
											class="leftBtn Button__Base-sc-1jdmsyi-0 iuBlFs">
											<FormattedMessage id="add_to_bag" defaultMessage="Add to Bag" />
										</button>:
										product.product[0].notified ||  product.product[0].notification_status === 1?
										<button className="leftBtn Button__Base-sc-1jdmsyi-0 iuBlFs btn-disabled" disabled>
											<FormattedMessage id="Notified" defaultMessage="Notified" />
										</button>:
										<button className="leftBtn Button__Base-sc-1jdmsyi-0 iuBlFs btn-disabled" onClick={() => this.notifyMe(product.product[0].id)}>
											<FormattedMessage id="NotifyMe" defaultMessage="Notify Me" />
											{this.props.notify && this.props.notify.notifyLoader && this.state.notifiedProduct === product.product[0].id && <i class="fa fa-spinner fa-spin ml-1 mr-1" aria-hidden="true"></i>}
										</button> 
										}
									</div>
										</div>
									</div>
								
								
								</div>
							)}
						</div>
						{/* <LogoSlider /> */}
						<Breadcrumb breadcrumbData={breadcrumbData} />
						{product && product.product &&
							createMetaTags(
								product.product[0].meta_title,
								product.product[0].meta_description,
								product.product[0].meta_keywords,
							)
						}
						<ProductDetails
							product={product}
							addToCard={this.addToCard}
							updateQuantity={this.updateQuantity}
							avgReview={avgReview}
							reviews={reviews}
							store_locale={store_locale}
							notifyMe={this.notifyMe}
							notified={product && product.product && product.product[0] ? product.product[0].notified ||  product.product[0].notification_status === 1 :false}
							notifiedLoader={this.props.notify && this.props.notify.notifyLoader && this.state.notifiedProduct === product.product[0].id }
						/>
						<CountDetails product={product} />
						<PdpAccordion
							product={product}
							store_locale={store_locale}
							reviews={reviews}
							avgReview={avgReview}
							isUserLoggedIn={this.props.user_details.isUserLoggedIn}
						/>
						{this.props.recommended_data && (
							<RecommandedForYou
								data={this.props.recommended_data.SECTION6}
								addToWishList={this.addToWishList}
								removeFromWishlist={this.removeFromWishlist}
							/>
						)}
					</div>
				)}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		customer_details: state.login,
		recommended_data: state.global.recommended_data,
		guest_user: state.guest_user,
		product: state.product,
		user_details: state.login,
		myCart: state.myCart,
		reviews: state.product.reviews,
		wishList: state.wishList,
		notify: state.notify,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		// getReviewList: (payload) => dispatch(actions.getReviewList(payload)),
		getProductDetails: (payload) => dispatch(actions.getProductDetails(payload)),
		onGuestAddToCart: (payload, myCart, eventObj) => dispatch(actions.guestAddToCart(payload, myCart, eventObj)),
		onAddToCart: (payload, myCart, eventObj) => dispatch(actions.addToCart(payload, myCart, eventObj)),
		onGetRecommendedData: (payload) => dispatch(actions.getRecommendedData(payload)),
		onAddToWishList: (payload) => dispatch(actions.addToWishlist(payload)),
		onRemoveWishList: (payload) => dispatch(actions.removeWishList(payload)),
		onNotifyMe: (payload) =>dispatch(actions.notifyMe(payload))

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PdpMain))
