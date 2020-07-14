import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import LogoSlider from '../../components/HomeComponent/logoSlider';
import bagIcon from '../../assets/images/icons/bag.png';


class Wishlist extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const store_locale=this.props.globals.store_locale
        return (
            <div>
                 {/* <LogoSlider /> */}
                <div className="whishlist">
                <div className="cartListView">
                    <div className="cart-grid">
                    <div className="container">
                        
                        <div className="row">
                            <div className="col-md-9">
                                <div className="cart-title-top">
                                    <div className="cart-title">
                                     <span className="cart-title"><FormattedMessage id='checkoutWishlist.WishList' defaultMessage="Wish List" /></span>
                                    </div>
                                    <Link to={`/${store_locale}/cart`}> <span className="view-wishlist"><FormattedMessage id='checkoutWishlist.MyBag' defaultMessage="My Bag" /></span>
                                    </Link>
                                </div>
                                
                                <div className="cart-table">
                                    <ul className="cartlist-block">
                                        <li className="cartlist"><span className="cart-list-title"><FormattedMessage id='checkoutWishlist.Items' defaultMessage="Items" /></span></li>
                                        
                                        <li className="cartlist"><span className="cart-list-title"><FormattedMessage id='checkoutWishlist.Total' defaultMessage="Total" /></span></li>
                                    </ul>
                                </div>
                                <div height="auto" className="product-list-grid">
                                        <div className="grid-spaceing">
                                            <div className="ljELlj">                                                
                                                    <div className="prod-img"><a href=""><img src="https://www.lego.com/cdn/cs/set/assets/bltd140b26a03606a42/40380.jpg" className="ProductRowstyles__Image-cbbmmq-2 jxxiQH"/></a></div>                                                    
                                                <div className="productdesc">
                                                    <a href="">
                                                        <span color="black" className="textUp">
                                                        <FormattedMessage id='checkoutWishlist.Bookshop' defaultMessage="Bookshop" />
                                                        </span>
                                                        </a>
                                                        <span color="grey" className="product-id"><span>10270</span></span>
                                                    <div className="vvv">
                                                        <p color="grey" className="qtylabel"><FormattedMessage id='checkoutWishlist.outofstock' defaultMessage="Temporarily out of stock" /></p>
                                                        {/* <p className="greenColor">Available</p> */}
                                                        <div className="TotalPrice"><p className="PPriceP">$179.99</p>
                                                        <p className="CadText"><FormattedMessage id='checkoutWishlist.cad' defaultMessage="cad" /></p>                                                        
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="quentity-grid">
                                            <div className="col-12">
                                          <div className="row">
                                      
                                             <div className="col-10 col-md-12">
                                             <ul className="list-inline main_Ul">
                                                <li className="list-inline-item">
                                                    <div className="limitDiv">
                                                    <svg width="17px" height="22px" viewBox="0 0 17 22" data-di-rand="1587466544680">
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
                                                    <div className="limitDiv blurIcon bagIcon">
                                                    <img src={bagIcon} alt="minIcon" />
                                                    </div>
                                                </li>
                                                </ul>
                                             </div>
                                        
                                          </div>
                                       </div>
                                            </div>
                                            <div className="TotalPrice"><p className="PPriceP">$179.99</p>
                                            <p className="CadText"><FormattedMessage id='checkoutWishlist.cad' defaultMessage="cad" /></p>
                                            
                                            </div>
                                        </div>
                                       
                                </div>
                                
                            </div>
                            
                            <div className="col-md-3">
                            <div className="discoverLego">
                               <p className="TextOne"><FormattedMessage id='checkoutWishlist.benefitsofLego' defaultMessage="Discover the benefits of creating a LEGO ID" /></p>
                               <p className="TextSecond"><FormattedMessage id='checkoutWishlist.accessWishlist' defaultMessage="Access your Wish List from any computer - even if it's on a space ship orbiting the moon." /></p>

                            </div>
                            </div>

                        </div>
                    </div>
                    </div>
                </div>
              
                </div>
                </div>
        )
    }
}
const mapStateToProps = state => {
    return {
       globals:state.global
    };
 }
 const mapDispatchToProps = dispatch => {
 return {
 }
 }
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Wishlist)));
