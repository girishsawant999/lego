import queryString from 'query-string';
import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import { FormattedMessage } from 'react-intl';
//import LazyLoad from 'react-lazy-load';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import { Link, withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import arrowDown from '../../assets/images/icons/arrowDown.png';
import wishlistCircle from '../../assets/images/icons/wishlistCircle.png';
import placeholderSrc from '../../assets/images/plp/placeholder.png';
import AddBagAlert from '../../common/AlertBox/addToBagAlert';
import Rating from '../../common/rating';
import PlpLoader from '../../components/Spinner/PlpLoader';
import Spinner2 from '../../components/Spinner/Spinner2';
import * as actions from '.././../redux/actions/index';
import { productClickEvent } from '../utility/googleTagManager';
import OnHoverImageChange from './OnHoverImageChange';

let products = [];
let currentsku;
let wishlistProducts = [];
let wishlistIds = [];
class productView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageOnHover: null,
      showOverSlider: false,
      index: 0,
      currentProduct: '',
      productsList: [],
      addMessagePopup: false,
      addMessage: '',
      addCartLoader: false,
      notifiedProduct: null,
      isWishlistClickGuest: false,
      data: {},
      touchedProduct: null,
    };

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  componentDidMount() {}

  showSliderImage = (product) => {
    this.setState({ currentProduct: product.json.sku, showOverSlider: true });
  };

  _onMouserLeave = () => {
    this.setState({
      currentProduct: '',
      showOverSlider: false,
      imageOnHover: null,
    });
  };

  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user_details.isUserLoggedIn) {
      if (
        nextProps.wishlistUpdated.wishlistMessage &&
        nextProps.wishlistUpdated.wishlistItemRemoved
      ) {
        this.setState({
          addMessagePopup: true,
          addMessage: nextProps.wishlistUpdated.wishlistMessage,
        });
        nextProps.wishlistUpdated.wishlistMessage = '';
        nextProps.wishlistUpdated.wishlistItemRemoved = false;
      }
      if (
        nextProps.wishlistUpdated.wishlistMessage &&
        nextProps.wishlistUpdated.wishlistItemAdded
      ) {
        this.setState({
          addMessagePopup: true,
          addMessage: nextProps.wishlistUpdated.wishlistMessage,
        });
        nextProps.wishlistUpdated.wishlistMessage = '';
        nextProps.wishlistUpdated.wishlistItemAdded = false;
      }
    }

    if (
      nextProps.myCart.add_cart_open_popUp &&
      !nextProps.myCart.add_cart_error
    ) {
      this.setState({
        Spinner: false,
        addCartLoader: false,
        addToBagFlag: true,
        addMessagePopup: true,
        addMessage:
          nextProps.globals.currentStore == 2
            ? ' Item has been added to the cart '
            : 'تم إضافة المنتج إلى العربة',
      });
      currentsku = 0;
    } else if (
      nextProps.myCart.add_cart_open_popUp &&
      nextProps.myCart.add_cart_error
    ) {
      this.setState({
        Spinner: false,
        addCartLoader: false,
        addToBagFlag: true,
        addMessagePopup: true,
        addMessage: nextProps.myCart.addToCartMsg,
      });
    }

    if (nextProps.notify.message) {
      if (this.state.notifiedProduct) {
        for (var i in products) {
          if (products[i].json.id === this.state.notifiedProduct) {
            products[i].notified = true;
            break; //Stop this loop, we found it!
          }
        }
      }
      if (this.props.globals.store_locale === 'en') {
        this.setState({
          addMessagePopup: true,
          addMessage: nextProps.notify.notified
            ? 'Notification alert already saved'
            : 'Notification alert saved',
        });
      } else {
        this.setState({
          addMessagePopup: true,
          addMessage: nextProps.notify.notified
            ? 'تم حفظ التنبيه مسبقا'
            : 'تم حفظ التنبيه ',
        });
      }
      nextProps.notify.message = '';
    }
  }

  addToCard = (item, product) => {
    if (currentsku == 0) {
      currentsku = item.sku;
    }
    let eventObj = {
      currency: product.currency,
      product: [
        {
          name: item.name,
          id: item.sku,
          price: item.offers
            ? item.offers.data && item.offers.data['1']
              ? item.offers.data && item.offers.data['1']
              : product.price
            : product.price,
          brand: 'Google',
          category: item.category_names,
          quantity: '1',
          // size : this.state.size_state.text
        },
      ],
    };
    if (this.props.user_details.isUserLoggedIn) {
      let cart_item = {
        cart_item: {
          quote_id: this.props.user_details.customer_details.quote_id,
          product_type: 'configurable',
          sku: item.sku,
          qty: 1,
          product_option: {
            extension_attributes: {
              configurable_item_options: [
                {
                  option_id: '',
                  option_value: '',
                },
              ],
            },
          },
        },
      };
      const myCart = {
        quote_id: this.props.user_details.customer_details.quote_id,
        store_id: this.props.globals.currentStore,
      };

      this.props.onAddToCart(cart_item, myCart, eventObj);
    } else {
      let quote_id = this.props.guest_user.temp_quote_id;
      let cart_item = {
        cart_item: {
          quote_id: quote_id,
          product_type: 'simple',
          sku: item.sku,
          qty: 1,
        },
      };

      const myCart = {
        quote_id: quote_id,
        store_id: this.props.globals.currentStore,
      };
      this.props.onGuestAddToCart(cart_item, myCart, eventObj);
    }
  };

  closeAddBag = () => {
    this.setState({
      addMessagePopup: false,
    });
  };

  pluck = (array, key) => {
    return array.map((o) => o[key]);
  };

  clickOnWishlist = (product, isInWishList) => {
    if (this.props.user_details.isUserLoggedIn) {
      if (isInWishList) {
        let data = {
          wishilistitemid:
            wishlistIds[wishlistProducts.indexOf(product.json.id)],
          product_id: product.json.id,
        };
        this.props.onRemoveWishList(data);
      } else {
        let data = {
          customer_id: this.props.user_details.customer_details.customer_id,
          product_id: product.json.id,
          super_attribute: {},
        };
        this.props.onAddToWishList(data);
      }
    } else {
      this.setState({
        isWishlistClickGuest: true,
      });
    }
  };

  closePopupWishList = () => {
    this.setState({
      isWishlistClickGuest: false,
    });
  };
  signOption = () => {
    const location = {
      pathname: `/${this.props.globals.store_locale}/login`,
      state: { from: this.props.location.pathname, data: this.state.data },
    };

    this.props.history.push(location);
  };

  gotoProductScreen = (data, key) => {
    const values = queryString.parse(this.props.location.search);
    let searchQuery = values.query;

    productClickEvent({
      name: data.json.name,
      id: data.json.sku,
      price: data.json.offers
        ? data.json.offers.data && data.json.offers.data['1']
          ? data.json.offers.data && data.json.offers.data['1']
          : data.price
        : data.price,
      brand: 'Google',
      category: data.json.category_names,
      index: key + 1,
      actionField: searchQuery ? 'Search Results' : 'List Results',
    });
  };

  notifyMe = (productId) => {
    if (this.props.user_details.isUserLoggedIn) {
      let payload = {
        product_id: productId,
        customer_id: this.props.user_details.customer_details.customer_id,
        store: this.props.globals.currentStore,
      };
      this.props.onNotifyMe(payload);
      this.setState({
        notifiedProduct: productId,
      });
    } else {
      const location = {
        pathname: `/${this.props.globals.store_locale}/login`,
        state: { from: this.props.location.pathname },
      };

      this.props.history.push(location);
    }
  };

  render() {
    let { plpData } = this.props;
    const settings3 = {
      autoplay: false,
      lazyLoad: false,
      beforeChange: this.beforeChange,
      autoplaySpeed: 5000,
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      speed: 500,
      vertical: false,
      responsive: [
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
    };

    products = this.props.showProducts;
    let store = this.props.globals.store_locale;
    let alertBox = null;
    if (this.state.addMessagePopup) {
      alertBox = (
        <AddBagAlert
          message={this.state.addMessage}
          alertBoxStatus={true}
          closeBox={this.closeAddBag}
        />
      );
    }

    if (this.props.loading) {
      return <Spinner2 />;
    }
    if (products) {
      products = products.sort((a, b) => {
        return a.json.quantity_and_stock_status.is_in_stock ===
          b.json.quantity_and_stock_status.is_in_stock
          ? 0
          : a.json.quantity_and_stock_status.is_in_stock
          ? -1
          : 1;
      });
    }

    const { wishlistUpdated } = this.props;
    wishlistProducts = this.pluck(
      wishlistUpdated.wishlistProducts,
      'product_id'
    );
    wishlistIds = this.pluck(wishlistUpdated.wishlistProducts, 'wishlist_id');

    if (products && wishlistProducts) {
      products.forEach((product) => {
        if (wishlistProducts.includes(product.json.id)) {
          product.isInWishList = true;
        } else {
          product.isInWishList = false;
        }
      });
    }

    return (
      <div className="ProductListing">
        {alertBox}
        <div id="productsElement">
          <div className="row" id="">
            {products &&
              products.length > 0 &&
              products.map((products, key) => {
                return (
                  <div
                    className={
                      'col-lg-4 col-md-6 col-sm-6 col-6 productItemPLP borderOuter ' +
                      (!isMobile &&
                      this.state.showOverSlider &&
                      this.state.currentProduct === products.json.sku
                        ? 'showSliderOnHoverBorder '
                        : '') +
                      (key % 3 === 2 ||
                      key === this.props.showProducts.length - 1
                        ? ''
                        : ' rightBorderNone')
                    }
                    onMouseLeave={(e) => this._onMouserLeave(products)}
                    onMouseEnter={(e) => this.showSliderImage(products)}>
                    {products.json && products.json.labels ? (
                      <div className="d-block d-sm-none p_new_min">
                        <span className="p_new yellow-tag">
                          {products.json.labels}
                        </span>
                      </div>
                    ) : (
                      <div className="d-block d-sm-none p_new_min"></div>
                    )}

                    {this.props.wishlistUpdated.wishlistLoader &&
                    this.props.wishlistUpdated.wishlistLoadingProductId ===
                      products.json.id ? (
                      <i class="fa fa-spinner fa-spin wishIcon wishlist-center"></i>
                    ) : products.isInWishList ? (
                      <svg
                        onClick={(e) => this.clickOnWishlist(products, true)}
                        width="100%"
                        height="100%"
                        viewBox="0 0 40 40"
                        alt=""
                        className=" wishIcon WishlistButtonstyles__StyledWishlistIcon-d720r1-1 hFCcpa wishlisted"
                        data-di-res-id="1cea8bce-ab0dac42"
                        data-di-rand="1590672027864">
                        <rect
                          fill="#F8F8F8"
                          width="40"
                          height="40"
                          rx="20"></rect>
                        <path
                          d="M19.986 30l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C30 14.569 27.398 12 24.187 12A5.829 5.829 0 0 0 20 13.762 5.827 5.827 0 0 0 15.815 12C12.604 12 10 14.569 10 17.739a5.68 5.68 0 0 0 1.782 4.126"
                          fill="#006DB7"></path>
                        <path
                          d="M26.84 20.417L20 27.204l-6.84-6.787A3.67 3.67 0 0 1 12 17.739C12 15.677 13.71 14 15.815 14a3.82 3.82 0 0 1 2.754 1.159l1.43 1.467 1.433-1.467A3.818 3.818 0 0 1 24.186 14C26.289 14 28 15.677 28 17.739a3.673 3.673 0 0 1-1.16 2.678M19.986 30l.014-.014.014.014 8.223-8.116-.018-.019a5.678 5.678 0 0 0 1.78-4.126C30 14.569 27.398 12 24.187 12A5.829 5.829 0 0 0 20 13.762 5.827 5.827 0 0 0 15.815 12C12.604 12 10 14.569 10 17.739a5.68 5.68 0 0 0 1.782 4.126"
                          fill="#006DB7"></path>
                      </svg>
                    ) : (
                      <img
                        className="wishIcon"
                        src={wishlistCircle}
                        alt="wishlistCircle"
                        onClick={(e) => this.clickOnWishlist(products, false)}
                      />
                    )}
                    {/* <div className="Ad-wishList d-sm-none d-md-none d-lg-none d-xl-none d-block pt-2">
                                        <img className="wishIcon mob-whilist" src={wishlistCircle} alt="wishlistCircle" />
                                        </div> */}
                    <div className="productItem">
                      <Link
                        to={`/${store}/productdetails/${products.json.url_key}`}>
                        <div className="imageDiv" onTouchStart={()=> this.setState({touchedProduct: products.json.id})}>
                          {products.json &&
                            products.json.imageUrl &&
                            products.json.imageUrl.primaryimage && (
                              <OnHoverImageChange
                                images={products.json.imageUrl.primaryimage}
                                productId={products.json.id}
                                touchedProduct={this.state.touchedProduct}
                              />
                            )}
                        </div>
                      </Link>
                    </div>

                    <div className="productdetails">
                      <div className="d-none d-sm-block">
                        {products.json && products.json.labels ? (
                          <span className="p_new yellow-tag">
                            {products.json.labels}
                          </span>
                        ) : (
                          <div className="yellow-tag"></div>
                        )}
                      </div>
                      {products.json && (
                        <p className="productNumber">{products.json.lego_id}</p>
                      )}
                      <Link
                        to={`/${store}/productdetails/${products.json.url_key}`}>
                        {products.json && (
                          <p className="productTitle ellipsis">
                            {products.json.name}
                          </p>
                        )}
                      </Link>
                      {this.props.showRating && (
                        <div className="ratingFix">
                          {products.json.ratingValue != 0 && (
                            <Rating
                              ratingValue={
                                parseInt(products.json.ratingValue) / 20
                              }
                            />
                          )}
                        </div>
                      )}
                      <div className="moboleInline">
                        <p className="productPrice">
                          {products.currency} {products.price}
                        </p>
                        {this.props.globals.loading &&
                        products.json.sku == currentsku ? (
                          <button disabled className="btn-disabled">
                            <FormattedMessage id="plp.PleaseWait" />
                          </button>
                        ) : products.json.quantity_and_stock_status
                            .is_in_stock ? (
                          <button
                            onClick={(e) => {
                              this.addToCard(products.json, products);
                              document.activeElement.blur();
                            }}
                            className="">
                            <FormattedMessage
                              id="AddtoBag"
                              defaultMessage="Add to Bag"
                            />
                          </button>
                        ) : products.notified ||
                          products.notification_status === 1 ? (
                          <button className="btn-disabled" disabled>
                            <FormattedMessage
                              id="Notified"
                              defaultMessage="Notified"
                            />
                          </button>
                        ) : (
                          <button
                            className="btn-disabled"
                            onClick={() => this.notifyMe(products.json.id)}>
                            <FormattedMessage
                              id="NotifyMe"
                              defaultMessage="Notify Me"
                            />
                            {this.props.notify &&
                              this.props.notify.notifyLoader &&
                              this.state.notifiedProduct ===
                                products.json.id && (
                                <i
                                  class="fa fa-spinner fa-spin ml-1 mr-1"
                                  aria-hidden="true"></i>
                              )}
                          </button>
                        )}
                      </div>
                    </div>
                    {!this.state.showOverSlider && (
                      <div className="blankSpace2"></div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        {this.props.PlpNextLoader && <PlpLoader />}
        {this.state.isWishlistClickGuest && (
          <div>
            <Modal
              modalId="deleteModel"
              open={this.state.isWishlistClickGuest}
              onClose={this.closePopupWishList}>
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
                      <button
                        className="cancelbtn"
                        onClick={this.closePopupWishList}>
                        <FormattedMessage
                          id="cart.removePopupCancel"
                          defaultMessage="Cancel"
                        />
                      </button>
                      <button className="okbtn" onClick={this.signOption}>
                        <FormattedMessage
                          id="cart.removePopupOk"
                          defaultMessage="OK"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    globals: state.global,
    plpData: state.plp.PlpData,
    product: state.plp.product,
    PlpNextLoader: state.plp.PlpNextLoader,
    user_details: state.login,
    myCart: state.myCart,
    wishlistUpdated: state.wishlistUpdated,
    customer_details: state.login,
    guest_user: state.guest_user,
    notify: state.notify,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onGuestAddToCart: (payload, myCart, eventObj) =>
      dispatch(actions.guestAddToCart(payload, myCart, eventObj)),
    onAddToCart: (payload, myCart, eventObj) =>
      dispatch(actions.addToCart(payload, myCart, eventObj)),
    onAddToWishList: (payload) =>
      dispatch(actions.addToWishlistUpdated(payload)),
    onRemoveWishList: (payload) =>
      dispatch(actions.removeWishListUpdated(payload)),
    onNotifyMe: (payload) => dispatch(actions.notifyMe(payload)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(productView));
