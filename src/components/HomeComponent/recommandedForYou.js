import React, { Component } from "react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "bootstrap/dist/css/bootstrap.css"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import Slider from "react-slick"
import wishlistCircle from "../../assets/images/icons/wishlistCircle.png";
import AddBagAlert from '../../common/AlertBox/addToBagAlert';
import * as actions from '../../redux/actions/index';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';

class Recommanded extends Component {
	constructor(props) {
		super(props)
		this.state = {
			addMessagePopup: false,
			addMessage: '',
			addCartLoader: false,
			notifiedProduct :null,
			isWishlistClickGuest: false,
			data: {}
		}
	}

	addToWishList = (product) => {
		if (this.props.user_details.isUserLoggedIn) {
			product.id = product.product_id;
			this.props.addToWishList(product);
		} else {
			let data = {
                "product_id": product.product_id,
                "super_attribute":{}
			}

			this.setState({
                isWishlistClickGuest: true,
                data
             });
            // const location = {
            //     pathname: `/${this.props.globals.store_locale}/login`,
            //     state: { from: this.props.location.pathname, data: data  }
            //   }

            // this.props.history.push(location);
		}
	}

	closePopupWishList = () => {
      this.setState({
         isWishlistClickGuest: false
      })
    }
    signOption = () => {
      	const location = {
            pathname: `/${this.props.globals.store_locale}/login`,
            state: { from: this.props.location.pathname, data: this.state.data  }
          }

        this.props.history.push(location);
    }

	closeAddBag = () => {
		this.setState({
			addMessagePopup: false
		})
	}

	removeFromWishlist = (product) => {
		this.props.removeFromWishlist(product);
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.myCart.add_cart_open_popUp && !nextProps.myCart.add_cart_error) {
			this.setState({
			   // Spinner: false,
			   addCartLoader: false,
			   addToBagFlag: true,
			   addMessagePopup: true,
			   addMessage: nextProps.globals.currentStore == 2 ? ' Item has been added to the cart ' : 'تم إضافة المنتج إلى العربة'
			})
		 } else if (nextProps.myCart.add_cart_open_popUp && nextProps.myCart.add_cart_error) {
			   this.setState({
				 // Spinner: false,
				  addCartLoader: false,
				  addToBagFlag: true,  
				  addMessagePopup: true,
				  addMessage: nextProps.myCart.addToCartMsg
			   })
		 }
	}

	addToCard = (item) => {
		const { user_details, globals, guest_user } = this.props;
		let eventObj = {
            currency: item.currency,
            product: [{
                name: item.name,
                id: item.sku,
                price: item.offers ? (item.offers.data && item.offers.data['1'] ? item.offers.data && item.offers.data['1'] : item.product_price) : item.product_price,
                brand: 'Google',
                category: item.category_names,
                quantity: '1',
                // size : this.state.size_state.text
            }]
        };
        if (user_details.isUserLoggedIn) {
           let cart_item=   {
                 "cart_item": {
                 "quote_id": user_details.customer_details.quote_id,
                 "product_type" : "configurable",
                 "sku": item.sku,
                 "qty": 1,
                 "product_option": {
                    "extension_attributes": {
                       "configurable_item_options" : [
                          {
                             "option_id": "", 
                             "option_value":""
                          }
                    ]
                    }
                    }
                 }
           }
           const myCart = {
              quote_id: user_details.customer_details.quote_id,
              store_id: globals.currentStore,
		   };

           this.props.onAddToCart(cart_item, myCart ,eventObj) 
        } else {
           let quote_id = guest_user.temp_quote_id;
           // if (this.props.guest_user && this.props.guest_user.new_quote_id) {
             // quote_id = this.props.guest_user.new_quote_id;
           // } else if (this.props.guest_user && !this.props.guest_user.new_quote_id) {
           //    quote_id = this.props.guest_user.temp_quote_id
           // }
           let cart_item=   {
              "cart_item": {
                 "quote_id": quote_id,
                 "product_type": "simple",
                 "sku": item.sku,
                 "qty": 1,
               }
           }
  
           const myCart = {
              quote_id: quote_id,
              store_id: globals.currentStore,
           };

           this.props.onGuestAddToCart(cart_item, myCart ,eventObj);
        }
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
			notifiedProduct : productId
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
		const {store_locale} = this.props.globals;
		const { wishList, data } = this.props;
		let alertBox = null;
		if (this.state.addMessagePopup) {
		   alertBox = <AddBagAlert
			   message={this.state.addMessage}
			   alertBoxStatus={true}
			   closeBox={this.closeAddBag} />
		}

		let products = data.recommended_data  ? 
			data.recommended_data : [];
		if(products && wishList.products) {
			Object.values(products).map((prod) => {
				let isWishlist = wishList.products.find(wishProd => {
					return wishProd.product_id === prod.product_id;
				})

				if (isWishlist) {
					prod.isInWishList = true;
					prod.wishListId = isWishlist.wishlist_id;
				} else {
					prod.isInWishList = false;
				}
			});

		}
		var settings5 = {
			dots: false,
			arrows: true,
			infinite: Object.values(products).length > 3,
			speed: 800,
			slidesToShow: 4,
			slidesToScroll: this.props.globals.currentStore === 2 ? 1:-1,
			centerMode: false,
			autoplay: false,
			centerPadding: "0",
			autoplaySpeed: 50000,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 4,
					},
				},
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3,
					},
				},
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 2,
					},
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
					},
				},
			], 
		}

		if(this.state.notifiedProduct && this.props.notify.message) {
			this.props.notify.message = ''
			Object.values(products).map((item, index) => {
				if(item.product_id === this.state.notifiedProduct) {
					item['notified'] = true
					return null;
				}
			});
			this.setState({notifiedProduct:null})
		}
		return (
			<div>
				{alertBox}
				<div className="RecommendedPage">
					<div className="container">
						<p className="headTitle"><FormattedMessage id="RecommendedForYou" defaultMessage="Recommended For You" /></p>
						<div  id="homeSlider" className="Logo-Slider">
						<Slider {...settings5} className="sliderMain">
							{this.props.data &&
								Object.values(products).map((item, index) => (
									<div key={index} className="borderOuter productItemHome">
										
										<div className="productItem">
											<Link to={`/${store_locale}/productdetails/${item.url_key}`}>
												<div className="imageDiv">
													<img src={item.imageUrl} alt="logoSlider2" />
												</div>
											</Link>
											{item.isInWishList ? <svg onClick={() => this.removeFromWishlist(item)} 
												width="32" height="32" 
												viewBox="0 0 40 40" alt="" 
												className="WishlistButtonstyles__StyledWishlistIcon-d720r1-1 hFCcpa wishlisted" 
												data-di-res-id="1cea8bce-ab0dac42" data-di-rand="1590672027864">
												<rect fill="#F8F8F8" width="40" height="40" rx="20"></rect>
												<path d="M19.986 30l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C30 14.569 27.398 12 24.187 12A5.829 5.829 0 0 0 20 13.762 5.827 5.827 0 0 0 15.815 12C12.604 12 10 14.569 10 17.739a5.68 5.68 0 0 0 1.782 4.126" fill="#006DB7"></path><path d="M26.84 20.417L20 27.204l-6.84-6.787A3.67 3.67 0 0 1 12 17.739C12 15.677 13.71 14 15.815 14a3.82 3.82 0 0 1 2.754 1.159l1.43 1.467 1.433-1.467A3.818 3.818 0 0 1 24.186 14C26.289 14 28 15.677 28 17.739a3.673 3.673 0 0 1-1.16 2.678M19.986 30l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C30 14.569 27.398 12 24.187 12A5.829 5.829 0 0 0 20 13.762 5.827 5.827 0 0 0 15.815 12C12.604 12 10 14.569 10 17.739a5.68 5.68 0 0 0 1.782 4.126" fill="#006DB7"></path></svg>
											:
											<img onClick={() => this.addToWishList(item)} 
											className="wishIcon" src={wishlistCircle} alt="wishlistCircle" />}
										</div>
										<div className="productdetails">
											<span className="p_new service-tag"> <FormattedMessage id="Newtext" defaultMessage="New" /></span>
											<div className="bottomAdjust row-eq-height">
											<Link to={`/${store_locale}/productdetails/${item.url_key}`}>
											<p className="productTitle reco_ellipsis">
												{item.name}
											</p>
											</Link>
											</div>
											
											<p className="productNumber">{item.lego_id}</p>
											<p className="productPrice">{item.currency} {item.product_price}</p>
											{item.quantity_and_stock_status.is_in_stock ? 
											<button onClick={() => this.addToCard(item)} className="">
												<FormattedMessage id="AddtoBag" defaultMessage="Add to Bag" />
											</button> :
											 item.notified || item.notification_status === 1?
											 <button className="btn-disabled" disabled>
												 <FormattedMessage id="Notified" defaultMessage="Notified" />
											 </button>:
											 <button className="btn-disabled" onClick={() => this.notifyMe(item.product_id)}>
												 <FormattedMessage id="NotifyMe" defaultMessage="Notify Me" />
												 {this.props.notify && this.props.notify.notifyLoader && this.state.notifiedProduct === item.product_id && <i class="fa fa-spinner fa-spin ml-1 mr-1" aria-hidden="true"></i>}
											 </button> 
											}
											{/* <div className="Ad-wishList">
										<img className="wishIcon" src={wishlistCircle} alt="wishlistCircle" /> <span>Add to Wishlist</span>
									</div> */}
										</div>
									</div>
								))}
								</Slider>
						</div>
					</div>
				</div>
				{this.state.isWishlistClickGuest && 
                 <div>
                    <Modal
                       modalId="deleteModel"
                       open={this.state.isWishlistClickGuest}
                             onClose={this.closePopupWishList}>
                       <div className="modal-body">
                          <div className="container-fluid nopadding">
                          <div className="deleteModelpop">
                             <p><FormattedMessage id='cart.guestWishlistMsg' 
                             defaultMessage="Please sign-in to save the item to the wishlist" /></p>
                             <div className="ButtonDiv">
                                <button className="cancelbtn" onClick={this.closePopupWishList}>
                                   <FormattedMessage id='cart.removePopupCancel' defaultMessage="Cancel" />
                                </button>
                                <button className="okbtn" onClick={this.signOption}>
                                   <FormattedMessage id='cart.removePopupOk' defaultMessage="OK" />
                                </button>
                             </div>
                          </div>
                          </div>
                       </div>
                    </Modal>
                 </div>}
			</div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		globals: state.global,
		wishList: state.wishList,
		user_details: state.login,
		myCart: state.myCart,
		guest_user: state.guest_user,
		notify: state.notify,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGuestAddToCart: (payload, myCart ,eventObj) => dispatch(actions.guestAddToCart(payload, myCart ,eventObj)),
        onAddToCart: (payload, myCart ,eventObj) => dispatch(actions.addToCart(payload, myCart ,eventObj)),
		onNotifyMe: (payload) =>dispatch(actions.notifyMe(payload))

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Recommanded))
