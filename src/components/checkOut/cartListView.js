import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import minIcon from '../../assets/images/minusIcon.png';
import PluIcon from '../../assets/images/PlusIcon.png';
import backarrow from '../../assets/images/leftArrow1.png';
import 'bootstrap/dist/css/bootstrap.css';
import Ordersummary from './checkOutorderSummary';
import * as actions from "../../redux/actions/index";
import ReactTooltip from "react-tooltip";
import Modal from "react-responsive-modal"
import AddBagAlert from '../../common/AlertBox/addToBagAlert';


let updateItemQty = false;
class CartListView extends Component {
    constructor(props) {
		super(props)
		this.state = {
			showPopup : false,
			item: null,
			item_index: null,
			isWishlistClickGuest: false,

			addMessage:"",
			addMessagePopup: false,
		}
	}
	
	componentWillReceiveProps = (nextProps) => {
		if (nextProps.user_details.isUserLoggedIn) {
			if(nextProps.myCart && nextProps.globals.loading === false ) {
				if(nextProps.myCart.update_qty_response && nextProps.myCart.update_qty_response.message && updateItemQty) {
					updateItemQty = false;

					this.setState({
						addMessagePopup: true,
						addMessage: nextProps.globals.currentStore == 2 ? ' Cart updated Successfully ' : 'تم تحديث عربة التسوق بنجاح '
					})
					nextProps.myCart.update_qty_response = "";
				}
				
			}
		}
		
	}

	updateQty = (product, value) => {
			if (parseInt(product.is_in_stock.stock) >= value) {
					updateItemQty = true;
					this.props.onQuantityChange({ product: product, quantity: value });
			} else {
				this.props.displayLimitMsg(product.is_in_stock.stock);
			}
	}

	removeFromBag = (product, index) => {
		product.index = index;
		this.props.callRemove(true)
    this.props.onRemoveProductFromCart({ product: product });
	}

	addToWishList = (product) => {
		if (this.props.user_details.isUserLoggedIn) {

			this.props.addToWishList(product);
		} else {
			this.setState({
				isWishlistClickGuest: true
			})
			// const location = {
			// 	pathname: `/${this.props.globals.store_locale}/login`,
			// 	state: { from: this.props.location.pathname }
			// }

			// this.props.history.push(location);
		}
	}

	removeFromWishlist = (product) => {
		this.props.removeFromWishlist(product);
	}

	onClickRemoveIcon =(item,item_index)=>{
		this.setState({item:item,item_index:item_index, showPopup:true})
	 }
	 closePopup =() =>{
		this.setState({item:null,item_index:null, showPopup:false})
	 }
	 closePopupWishList = () => {
	 	this.setState({
			isWishlistClickGuest: false
		})
	 }
	 signOption = () => {
	 	const location = {
			pathname: `/${this.props.globals.store_locale}/login`,
			state: { from: this.props.location.pathname }
		}

		this.props.history.push(location);
	 }
	 onRemoveClick = () => {
		if (this.state.item && this.state.item_index != null) {
		   this.removeFromBag(this.state.item,this.state.item_index)
		   this.closePopup()
		}
	 }

	closeAddBag = () => {
		this.setState({
			addMessagePopup: false
		})
	}
	 
	render() {
		const { myCart, globals, wishList, user_details } = this.props;
		let products = myCart.products;
		if(myCart.products && wishList.products && myCart.products.length > 0) {
			products.forEach(prod => {
				let isWishlist = wishList.products.find(wishProd => {
					return wishProd.product_id === prod.id;
				})

				if (isWishlist) {
					prod.isInWishList = true;
					prod.wishListId = isWishlist.wishlist_id;
				} else {
					prod.isInWishList = false;
				}
			});
		}

		let alertBoxWIshlist = null;
		if (this.state.addMessagePopup) {
			alertBoxWIshlist = <AddBagAlert
				message={this.state.addMessage}
				alertBoxStatus={true}
				closeBox={this.closeAddBag} />
		}

		return (
			<div>
				{alertBoxWIshlist}
				<div className="cartListView">
					<div className="cart-grid">
						<div className="container">
							<div className="row">
								<div className="col-md-8">
									<div className="cart-title-top">
										<div className="cart-title">
											<span className="cart-title">
											<FormattedMessage id='myCart' defaultMessage="My Cart" />
											</span>
										</div>
										{user_details.isUserLoggedIn && <Link to={`/${globals.store_locale}/wishlist`}>
											<span className="view-wishlist">
												<FormattedMessage id='cart.viewWishList' defaultMessage="View Wish List" /> {`(${wishList.products.length})`}</span>
										</Link>}
									</div>
									{/* <div className="top-message">
										<p className="message-text">
											<FormattedMessage id='cart.info' defaultMessage="As we’re receiving more orders than we expected and we’re following additional safety measures at our warehouse, deliveries are currently taking 10-15 days to arrive after the order date." />
											
										</p>
									</div> */}
									<div className="cart-table d-none d-sm-block">
										<ul className="cartlist-block">
											<li className="cartlist">
												<span className="cart-list-title">
												<FormattedMessage id='cart.Details' defaultMessage="Details" />
												</span>
											</li>
											<li className="cartlist">
												<span className="cart-list-title">
												<FormattedMessage id='cart.Quantity' defaultMessage="Quantity" /></span>
											</li>
											<li className="cartlist">
												<span className="cart-list-title">
												<FormattedMessage id='cart.Total' defaultMessage="Total" /></span>
											</li>
										</ul>
									</div>
									<div height="auto" className="product-list-grid">
									{myCart.products && myCart.products.length > 0 &&
										products.map((product, index) => {
											return (
										<>
										{product.price === 0 && <div className="productDescLine">
											<div className="row">
												<div className="descBackgroudPro">
													<img
														className="img-left"
														src={product.image[0]}
													/>
													<p className="productDes">
													<FormattedMessage id='cart.freeDots' defaultMessage="You've qualified for a FREE " />
													{`${product.name} (${product.sku})`}
													</p>
												</div>
											</div>
										</div>}
										</>)})}
										{myCart.products && myCart.products.length > 0 &&
										products.map((product, index) => {
											return (
										<>
										{product.price !== 0 && <div className="grid-spaceing" key={index}>
											<div className="ljELlj">
												<div className="prod-img">
												<Link to={`/${globals.store_locale}/productdetails/${product.url_key}`}>
														<img
															src={product.image[0]}
															className="ProductRowstyles__Image-cbbmmq-2 jxxiQH"
															alt="product"
														/>
												</Link>
												</div>
												<div className="productdesc">
													<Link to={`/${globals.store_locale}/productdetails/${product.url_key}`}>
														<span color="black" className="textUp">
															{product.name}
														</span>
													</Link>
													<span color="grey" className="product-id">
														<span>{product.sku}</span>
													</span>
													<div className="vvv">
													{product.is_in_stock.status === 1 ?<p color="green" className="available-option">
															<span className="available-label">
															
															<FormattedMessage id='pdp.available_Now' defaultMessage='Available now' />
															</span>
														</p> :
														<p style={{color: "red"}} className="available-option">
															<span style={{color: "red"}} className="available-label">
															<FormattedMessage id='pdp.OutOfStock' defaultMessage='Out of stock' />
															</span>
														</p>}
														<p color="grey" className="qtylabel">
														<FormattedMessage id='cart.Qty' defaultMessage="Qty" />
														 {product.qty}
														</p>
																	{product.special_price && parseInt(product.special_price) !== 0 ?
																		<div className="price">
																			<span className="price-label">
																				<span className="zzz">
																					<FormattedMessage id='pdp.Price' defaultMessage="Price" />
																				</span>
																			</span>
																			<div className="price-label">
																				<div style={{ textDecoration: 'line-through' }}>{`${product.currency} ${product.price}`}</div>
																				<div> {' '} {`  ${product.currency} ${product.special_price}`}</div>
																			</div>
																		</div>
																		: <div className="price">
																			<span className="price-label">
																				<span className="zzz">
																					<FormattedMessage id='pdp.Price' defaultMessage="Price" />
																				</span>{`${product.currency} ${product.price}`}
																			</span>
																		</div>}
													</div>
												</div>
											</div>
											<div className="quentity-grid">
												<div className="col-12">
													<div className="row">
														<div className="col-5 d-none d-sm-block">
														{product.is_in_stock.status === 1 && <div className="QtyCounter">
																{parseInt(product.qty) === 1 &&
																<span
																	className=" blur minus" style={{cursor: 'unset'}}>
																	<img src={minIcon} alt="minIcon" />
																</span>}
																{parseInt(product.qty) > 1 &&
																<span onClick={() => this.updateQty(product, product.qty - 1)}
																	className="minus">
																	<img src={minIcon} alt="minIcon" />
																</span>}
																<input 
																value={product.qty}
																 type="text" 
																 placeholder="0" />
																{/* plus and minus onclick add class "btnActive"*/}{" "}
																{parseInt(product.qty) !== parseInt(product.is_in_stock.stock) &&
																<span onClick={() => this.updateQty(product, product.qty + 1)}
																className="plus">
																	<img src={PluIcon} alt="minIcon" />
																</span>}
																{parseInt(product.qty) === parseInt(product.is_in_stock.stock) &&
																<span onClick={() => this.updateQty(product, product.qty + 1)}
																className="plus blur" style={{cursor: 'unset'}}>
																	<img src={PluIcon} alt="minIcon" />
																</span>}
															</div>}
														</div>
														<div className="col-5 col-md-7">
															<ul className="list-inline main_Ul">
																<li className="list-inline-item" onClick={() => this.onClickRemoveIcon(product,index)} >
																	<div className="limitDiv cursor-pointer">
																		<svg width="17px" height="22px" viewBox="0 0 17 22" data-di-rand="1587466544680" data-tip={ globals.store_locale==='en' ? `Click to remove item from cart`: " انقر لإزالة المنتج إلى سلة التسوق "}>
																			<g fill="#006DB7" fill-rule="evenodd">
																				<path d="M.773 5.5h15.454A.762.762 0 0 0 17 4.75a.762.762 0 0 0-.773-.75H.773A.762.762 0 0 0 0 4.75c0 .414.346.75.773.75z"></path>
																				<path d="M5.744 4l.378-1.43c.08-.307.448-.607.742-.607h3.272c.294 0 .661.3.742.606L11.256 4 13 4.46l-.378-1.43C12.32 1.88 11.24.673 10.136.673H6.864C5.76.673 4.681 1.881 4.378 3.03L4 4.46 5.744 4z"></path>
																				<path d="M14.47 4.734l-.567 15.257a.515.515 0 0 1-.505.484H3.602a.516.516 0 0 1-.505-.484L2.53 4.734a.764.764 0 0 0-.793-.733.764.764 0 0 0-.736.79l.567 15.256A2.044 2.044 0 0 0 3.602 22h9.796c1.086 0 1.994-.87 2.034-1.953L16 4.791a.764.764 0 0 0-.736-.79.764.764 0 0 0-.793.733z"></path>
																				<path d="M8 8.532v8.945c0 .29.224.526.5.526s.5-.235.5-.526V8.532a.514.514 0 0 0-.5-.526c-.276 0-.5.236-.5.526zm3-.006v8.948c0 .29.224.526.5.526s.5-.236.5-.526V8.526A.514.514 0 0 0 11.5 8c-.276 0-.5.236-.5.526zm-6 0v8.948c0 .29.224.526.5.526s.5-.236.5-.526V8.526A.514.514 0 0 0 5.5 8c-.276 0-.5.236-.5.526z"></path>
																			</g>
																		</svg>
																	</div>
																</li>
																<li className="list-inline-item">
																	<div className="limitDiv cursor-pointer">
																		{product.isInWishList ? <svg onClick={() => this.removeFromWishlist(product)} 
																			width="20px" height="18px" 
																			viewBox="0 0 40 40" alt="" 
																			className="WishlistButtonstyles__StyledWishlistIcon-d720r1-1 hFCcpa wishlisted" 
																			data-di-res-id="1cea8bce-ab0dac42" data-di-rand="1590672027864">
																			<rect fill="#F8F8F8" width="40" height="40" rx="20"></rect>
																			<path d="M19.986 30l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C30 14.569 27.398 12 24.187 12A5.829 5.829 0 0 0 20 13.762 5.827 5.827 0 0 0 15.815 12C12.604 12 10 14.569 10 17.739a5.68 5.68 0 0 0 1.782 4.126" fill="#006DB7"></path><path d="M26.84 20.417L20 27.204l-6.84-6.787A3.67 3.67 0 0 1 12 17.739C12 15.677 13.71 14 15.815 14a3.82 3.82 0 0 1 2.754 1.159l1.43 1.467 1.433-1.467A3.818 3.818 0 0 1 24.186 14C26.289 14 28 15.677 28 17.739a3.673 3.673 0 0 1-1.16 2.678M19.986 30l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C30 14.569 27.398 12 24.187 12A5.829 5.829 0 0 0 20 13.762 5.827 5.827 0 0 0 15.815 12C12.604 12 10 14.569 10 17.739a5.68 5.68 0 0 0 1.782 4.126" fill="#006DB7"></path></svg>
																			: 
																			<svg onClick={() => this.addToWishList(product)} 
																			width="20px" height="18px" viewBox="0 0 20 18" data-di-rand="1587466544680">
																			<path
																				d="M16.84 8.417L10 15.204 3.16 8.417A3.67 3.67 0 0 1 2 5.739C2 3.677 3.71 2 5.815 2a3.82 3.82 0 0 1 2.754 1.159l1.43 1.467 1.433-1.467A3.818 3.818 0 0 1 14.186 2C16.289 2 18 3.677 18 5.739a3.673 3.673 0 0 1-1.16 2.678M9.986 18l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C20 2.569 17.398 0 14.187 0A5.829 5.829 0 0 0 10 1.762 5.827 5.827 0 0 0 5.815 0C2.604 0 0 2.569 0 5.739a5.68 5.68 0 0 0 1.782 4.126"
																				fill="#006DB7"
																				fill-rule="evenodd"></path>
																		</svg>}
																	</div>
																</li>
															</ul>
														</div>
														<ReactTooltip place="bottom" html={true}/>
														<div className="col-7 col-md-5 d-block d-sm-none">
															{/* <div className="QtyCounter">
																<span className="minus">
																	<img src={minIcon} alt="minIcon" />
																</span>
																<input type="text" placeholder="0" />
																<span className="plus btnActive">
																	<img src={PluIcon} alt="minIcon" />
																</span>
															</div> */}
															<div className="QtyCounter">
																{parseInt(product.qty) === 1 &&
																<span
																	className=" blur minus" style={{cursor: 'unset'}}>
																	<img src={minIcon} alt="minIcon" />
																</span>}
																{parseInt(product.qty) > 1 &&
																<span onClick={() => this.updateQty(product, product.qty - 1)}
																	className="minus">
																	<img src={minIcon} alt="minIcon" />
																</span>}
																<input 
																value={product.qty}
																 type="text" 
																 placeholder="0" />
																{/* plus and minus onclick add class "btnActive"*/}{" "}
																{parseInt(product.qty) !== parseInt(product.is_in_stock.stock) &&
																<span onClick={() => this.updateQty(product, product.qty + 1)}
																className="plus">
																	<img src={PluIcon} alt="minIcon" />
																</span>}
																{parseInt(product.qty) === parseInt(product.is_in_stock.stock) &&
																<span onClick={() => this.updateQty(product, product.qty + 1)}
																className="plus blur" style={{cursor: 'unset'}}>
																	<img src={PluIcon} alt="minIcon" />
																</span>}
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="total-price d-none d-sm-block cartAmunt">
												<div className="iVILsS">
													<span color="black" className="Text__BaseText-aa2o0i-0 caAtUp">
														<span className="sarAmt">
														{`${product.currency} ${product.price * product.qty}`}
														</span>
													</span>
												</div>
											</div>
										</div>}
										</>
										)})}
									</div>
									<div className="last-link">
										<div className="d-none d-sm-block">
											<Link to={`/${globals.store_locale}`}>
												<img src={backarrow} className="backOption" alt="minIcon" />
												<span className="">
												<FormattedMessage id='cart.ContinueShopping' defaultMessage="Continue Shopping" />
												</span>
											</Link>
										</div>
										{/* <div className="right-link">
											<span className="jZvBVu ctvIrY">Help with your order:</span>
											<a className="doSIWo" href="">
												<span className="ctvIrY">Shipping &amp; Handling</span>
											</a>
											<a className="doSIWo" href="">
												<span className="ctvIrY">Returns</span>
											</a>
										</div> */}
									</div>
								</div>

								<div className="col-md-4">
									<Ordersummary checkout={this.props.checkout} />
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* <div>
                    withOut login div
                </div>
                <div>
                   After Login div show
                </div> */}

                      {this.state.showPopup ? (
						<div>
							<Modal
								modalId="deleteModel"
								open={this.state.showPopup}
                        		onClose={this.closePopup}>
								<div className="modal-body">
									<div className="container-fluid nopadding">
                           <div className="deleteModelpop">
					               <p><FormattedMessage id='cart.removePopup' defaultMessage="Are you sure to remove item from cart?" /></p>
                              <div className="ButtonDiv">
                                 <button className="cancelbtn" onClick={this.closePopup}>
                                    <FormattedMessage id='cart.removePopupCancel' defaultMessage="Cancel" />
                                 </button>
                                 <button className="okbtn" onClick={this.onRemoveClick}>
                                    <FormattedMessage id='cart.removePopupOk' defaultMessage="OK" />
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
		user_details: state.login,
		myCart: state.myCart,
		wishList: state.wishList
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onQuantityChange: (payload) => dispatch(actions.changeQty(payload)),
		onRemoveProductFromCart: (payload) => dispatch(actions.removeProduct(payload)),

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CartListView)));
