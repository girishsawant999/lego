import React, { Component, Suspense } from "react"
import Storefilter from "../storeLocator/storeFilter.js"
import StoreListView from "../checkOut/cartListView.js"
import { FormattedMessage, injectIntl } from "../../../node_modules/react-intl"
import $ from "jquery"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import cartSticyRight from "../../assets/images/chattingSticky.png"
import "bootstrap/dist/css/bootstrap.css"
import LogoSlider from "../../components/HomeComponent/logoSlider"
import * as actions from "../../redux/actions/index"
//import Breadcrumb from '../../common/breadcrumb';
import checkOutorderSummary from "../../components/checkOut/checkOutorderSummary"
import Spinner2 from "../Spinner/Spinner2";
import AlertBox from '../../common/AlertBox/QTYAlert';
import AddBagAlert from '../../common/AlertBox/addToBagAlert';
import { cartPageEvent } from '../utility/googleTagManager';
import Modal from "react-responsive-modal"
import { createMetaTags } from "../utility/meta"
const RecommandedForYou = React.lazy(() => import('../../components/HomeComponent/recommandedForYou'))
const CartList = React.lazy(() => import('../checkOut/cartListView'))
const Beforelogin = React.lazy(() => import('../../components/checkOut/beforelogin'))


let wishlistClick = false;
let removeWishlistClick = false;
let isOutOfStock = false;
let isGTMcalled = false;
class Cart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alertModalFlag: false,
			message: '',
			addMessagePopup: false,
			addMessage: '',
			removeApi: false,
			// isOutOfStock: false
		}
	}

	componentWillMount() {
		// remove
		localStorage.removeItem('merchant_reference');
		const { user_details, guest_user, globals } = this.props;
		let store = globals.currentStore;
		const payload = { 
			store: this.props.globals.currentStore,
			categories : globals.recommendedCategories.toString(',') ,
			cid: this.props.user_details.isUserLoggedIn ? this.props.user_details.customer_details.customer_id : ''
		}
		this.props.onGetRecommendedData(payload);
		if (user_details.customer_details.quote_id) {
            // quote_id = user_details.customer_details.quote_id;
            this.props.onGetMyCartList({
                quote_id: user_details.customer_details.quote_id,
                store_id: store
            });
        } else if (guest_user.new_quote_id) {
            // quote_id = guestUser.new_quote_id;
            this.props.onGetMyCartList({
                quote_id: guest_user.new_quote_id,
                store_id: store
            });
		}
		
		this.props.clearShippingReducer();
		this.props.clearProps({
			isPayfortFailed: false,
			is_payment_details_rec: false,
			shippingSuccess: false,
		});
	}

	componentDidMount = () => {
		this.checkOutOfStock()
		window.scrollTo(0,0)
	}
	checkOutOfStock = () =>{
		let products = this.props.myCart.products;
		for (var i = 0; i < products.length; i++) {
			if (products[i].is_in_stock.status === 0) {
				this.setState({ alertModalFlag: true })
				return true
			}
		}
		return false
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.myCart.placeOrderFailed) {
			nextProps.myCart.placeOrderMessage &&
			 this.setState({
				addMessagePopup: true,
				addMessage: nextProps.myCart.placeOrderMessage,
			 })
			nextProps.myCart.placeOrderFailed = false;
			nextProps.myCart.placeOrderMessage = null;
		  }

		if (nextProps.myCart.setPaymentFailed) {
			nextProps.myCart.setPaymentFailedMsg &&
			 this.setState({
				addMessagePopup: true,
				addMessage: nextProps.myCart.setPaymentFailedMsg,
			 })
			nextProps.myCart.setPaymentFailed = false;
			nextProps.myCart.setPaymentFailedMsg = null;
		  }
		if(nextProps.myCart.payfortFailedMessage) {
			this.setState({
				addMessagePopup: true,
				addMessage: nextProps.myCart.payfortFailedMessage,
			 });
			nextProps.myCart.payfortFailedMessage = null;
		}
		if (nextProps.user_details.isUserLoggedIn) {
			if (nextProps.wishlistUpdated.wishlistMessage && nextProps.wishlistUpdated.wishlistItemRemoved ) {
				this.setState({
				   addMessagePopup: true,
				   addMessage: nextProps.wishlistUpdated.wishlistMessage,
				})
				nextProps.wishlistUpdated.wishlistMessage = ""
				nextProps.wishlistUpdated.wishlistItemRemoved =false
			 }
			 if (nextProps.wishlistUpdated.wishlistMessage && nextProps.wishlistUpdated.wishlistItemAdded ) {
				this.setState({
				   addMessagePopup: true,
				   addMessage: nextProps.wishlistUpdated.wishlistMessage,
				})
				nextProps.wishlistUpdated.wishlistMessage = ""
				nextProps.wishlistUpdated.wishlistItemAdded =false
			 }

			if(nextProps.myCart && nextProps.myCart.removeloader === false) {
				if(nextProps.myCart.itemremoved && this.state.removeApi) {
					this.setState({
						removeApi: false,
						addMessagePopup: true,
						addMessage: nextProps.globals.currentStore == 2 ? ' Product Deleted Successfully ' : ' تم حذف المنتج بنجاح '
					});
				}
			}
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

		if(nextProps.myCart && nextProps.myCart.products && nextProps.myCart.is_cart_details_rec && !isGTMcalled){
			let product = ''
			let qty = ''
			for(var i = 0 ; i<nextProps.myCart.products.length ; i++){
				if(i === 0){
					product = nextProps.myCart.products[i].sku
					qty = nextProps.myCart.products[i].qty
				}
				else{
					product = product + ',' +  nextProps.myCart.products[i].sku
					qty = qty + ',' +  nextProps.myCart.products[i].qty
				}
			}
			let GTMdata = product + ' | ' + qty + ' | ' + nextProps.myCart.grand_total
			cartPageEvent(GTMdata);
			isGTMcalled = true ;
		}
    
    // let isOutOfStock = false;
		// for (var i = 0; i < nextProps.myCart.products.length; i++) {
		// 	if (nextProps.myCart.products[i].is_in_stock.status === 0) {
		// 		isOutOfStock = true;
		// 	}
		// }

		// this.setState({
		// 	isOutOfStock
		// });
	}

	closeErrorBox = () => {
        this.setState({
            alertModalFlag: false
        });

        window.scrollTo({ top: window.innerHeight, left: 0, behavior: 'smooth' });
	}

	displayLimitMsg = (stock) => {
		var storeId = this.props.globals.currentStore;
            if (storeId === 1) {
                this.setState({
					addMessagePopup: true,
                    addMessage: `الحد الأقصى لكمية الطلب من هذا المنتج هي ${parseInt(stock)} يرجى تغيير الكمية المحددة لتكون ضمن هذا العدد. لطلب كمية أكثر من ${parseInt(stock)} يرجى اللاتصال بنا.`
                })

            } else {
                this.setState({
					addMessagePopup: true,
                    addMessage: `This product has a maximum orderable quantity of ${parseInt(stock)} Please update your selected quantity to be within this limit.To order quantity more than ${parseInt(stock)} please contact us.`
                })
			}

	}

	addToWishList = (product) => {
		wishlistClick = true;
		const { globals, wishList, user_details } = this.props;
		//let wishListProduct = wishList.products;
		let data = {
			"customer_id": user_details.customer_details.customer_id,
			"product_id": product.id,
			"super_attribute":{
				 
			}
	 }

	 this.props.onAddToWishList(data);
	}

	callRemove = (state) => {
		this.setState({
			removeApi: state
		})
	}

	removeFromWishlist = (product) => {
		removeWishlistClick = true;
		let data = {
			"wishilistitemid": product.wishListId,
			product_id: product.id,
		 }
		 
	 this.props.onRemoveWishList(data);
	}

	closeAddBag = () => {
      this.setState({
          addMessagePopup: false
      })
	}
	  
	checkout = () => {
		if (!this.checkOutOfStock()) {
			if(this.props.user_details && this.props.user_details.isUserLoggedIn ){
				this.props.history.push(`/${this.props.globals.store_locale}/shipping`);
			} else {
				this.props.history.push(`/${this.props.globals.store_locale}/checkoutprocess`);
			}
		}
	}

	render() {
		let { user_details, myCart, globals } = this.props;
		if (globals.loading) {
            return (
                <div className="mobMinHeight">
                    <Spinner2 />
					{createMetaTags(
					this.props.globals.store_locale === "en"
						? "My Cart"
						: "سلتي | متجر ليغو أونلاين الرسمي بالسعودية ",
					this.props.globals.store_locale === "en"
						? "Explore the world of LEGO® through games, videos, products and more! Shop awesome LEGO® building toys and brick sets and find the perfect gift for your kid"
						: "اكتشف عالم ليغو LEGO من خلال الألعاب، والفيديوهات، والمنتجات وأكثر! تسوق مجموعات ألعاب البناء و المكعبات المدهشة من ليغو LEGO واعثر على الهدية المثالية لطفلك",
					this.props.globals.store_locale === "en"
						? "LEGO, Online Store, Saudi Arabia, Bricks, Building Blocks, Construction Toys, Gifts"
						: "ليغو LEGO، تسوق اونلاين، السعودية، مكعبات، مكعبات بناء، العاب تركيب، هدايا"
				)}
                </div>
            )
		}

		isOutOfStock = false;
        let outOfStockProduct = [];
        let inStockProduct = [];
        myCart.products.forEach(data => {
            if (data.is_in_stock.status === 0) {
                isOutOfStock = true;
                outOfStockProduct.push(data);
            } else {
                inStockProduct.push(data);
            }
		});

		let alertBoxWIshlist = null;
		if (this.state.addMessagePopup) {
			alertBoxWIshlist = <AddBagAlert
				message={this.state.addMessage}
				alertBoxStatus={true}
				closeBox={this.closeAddBag} />
		}

		return (
			<Suspense fallback={<div ></div>}>
			<div>
				{alertBoxWIshlist}
				<div className="cartPage">
					{/* <LogoSlider /> */}
					
					<Beforelogin 
						myCart={myCart}
						globals={globals}
						user_details={user_details} />
					<orderSummary />
					{myCart.cart_count > 0 && 
					<CartList displayLimitMsg={this.displayLimitMsg}
						addToWishList={this.addToWishList}
						removeFromWishlist={this.removeFromWishlist} 
						checkout={this.checkout}
						callRemove={this.callRemove}/>}
					{this.props.recommended_data && 
					<RecommandedForYou data={this.props.recommended_data.SECTION6}
						addToWishList={this.addToWishList}
						removeFromWishlist={this.removeFromWishlist} />}
					{/* <span>
						<img src={cartSticyRight} className="cartSticyRight" alt="apple" />
					</span> */}
				</div>


				{this.state.alertModalFlag? (
						<div>
							<Modal
							modalId="deleteModel"
							open={this.state.alertModalFlag}
							onClose={() => this.setState({alertModalFlag:false})}>
							{/* <div className="sInModel ">Account</div> */}
							<div className="modal-body">
								<div className="container-fluid nopadding">
									<div className="deleteModelpop">
										<p>
										{this.props.globals.store_locale === "en" ?
											"Some products you have added to shopping bag are currently out of stock.":
											`بعض المنتجات التي أضفتها إلى حقيبة التسوق غير متوفرة حاليًا.`
										}	
										</p>
										<div className="ButtonDiv">
											<button className="cancelbtn" onClick={() => this.setState({alertModalFlag:false})}>
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
			</Suspense>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		recommended_data: state.global.recommended_data,
		globals: state.global,
		user_details: state.login,
		myCart:state.myCart,
		wishlistUpdated: state.wishlistUpdated,
		guest_user: state.guest_user,
		notify:state.notify,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGetRecommendedData: (payload) => dispatch(actions.getRecommendedData(payload)),
		onAddToWishList: payload => dispatch(actions.addToWishlistUpdated(payload)),
		onRemoveWishList: (payload) => dispatch(actions.removeWishListUpdated(payload)),
		onGetMyCartList:(payload)=>dispatch(actions.getMyCart(payload)),
		clearShippingReducer: () => dispatch(actions.clearShippingReducer()),
		clearProps: (data) => dispatch(actions.callActionForPayfortFailed(data)),

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Cart)))
