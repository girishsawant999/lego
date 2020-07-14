import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import storIcon from '../../assets/images/icons/store-face.png';
import aboutIcon from '../../assets/images/icons/aboutus.png';
import accountIcon from '../../assets/images/icons/account.png';
import wishIcon from '../../assets/images/icons/wishlist.png';
import bagIcon from '../../assets/images/icons/bag.png';
import logo from '../../assets/images/icons/Headerlogo.png';
import checkoutLock from '../../assets/images/lock.PNG';
import leftArrow from '../../assets/images/icons/leftArrow1.png';
import truck from '../../assets/images/icons/truck.png';
import vipBadge from '../../assets/images/icons/vipBadge.png';
import downArrow from '../../assets/images/icons/arrowDown.png';
import searchIcon from '../../assets/images/icons/searchIcon.png';
import learnMoreRight from '../../assets/images/icons/rightArrow.png';
import toggleIcon from '../../assets/images/icons/toggleIcon.png';
import SideBar from '../SideBar';
import Modal from 'react-responsive-modal';
import * as actions from '../../redux/actions/index';
import ShopBy from '../header/shopByTabs';
import Search from './Search';
import EditAccount from '../../components/Myaccount/editAccount';
import avtar1 from "../../../src/assets/AvtarImages/avtar1.png"
import avtar2 from "../../../src/assets/AvtarImages/avtar2.png"
import avtar3 from "../../../src/assets/AvtarImages/avtar3.png"
import avtar4 from "../../../src/assets/AvtarImages/avtar4.png"
import avtar5 from "../../../src/assets/AvtarImages/avtar5.png"
import avtar6 from "../../../src/assets/AvtarImages/avtar6.png"
import avtar7 from "../../../src/assets/AvtarImages/avtar7.png"
import avtar8 from "../../../src/assets/AvtarImages/avtar8.png"

let avtarImage;
let setAvtarImageFromAPI;
let avatarName;
let isCheckout = false;
avtarImage = [
	{
		image: avtar1,
		name: "avtar1"

	},
	{
		image: avtar2,
		name: "avtar2"
	},
	{
		image: avtar3,
		name: "avtar3"
	},
	{
		image: avtar4,
		name: "avtar4"
	},
	{
		image: avtar5,
		name: "avtar5"
	},
	{
		image: avtar6,
		name: "avtar6"
	},
	{
		image: avtar7,
		name: "avtar7"
	},
	{
		image: avtar8,
		name: "avtar8"
	},
]
class header extends Component {
   constructor(props) {
      super(props);
      this.state = {
         showModal: false,
         openSub: false,
         infoModel: false,
      }

      isCheckout = false;
   }


   componentWillMount = () => {
      let store = this.props.globals.currentStore;
      if (!this.props.menus || (this.props.menus && this.props.menus.length === 0)) {
         this.props.onGetMenu({ store_id: store })
      }

      const { user_details, guest_user } = this.props;
        // let quote_id;

         if (user_details.isUserLoggedIn) {
            const payload = {
               url_key: user_details.customer_details.customer_id,
            }
            this.props.onGetAccountPageData(payload)
            const payload2 = {
               customerid: user_details.customer_details.customer_id,
            }
            this.props.onGetAddressBook(payload2)
            this.props.onGetWishListItem({ customerid: user_details.customer_details.customer_id, store_id: this.props.globals.currentStore });
         }

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
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.location && nextProps.location.pathname && nextProps.globals
         && nextProps.globals.store_locale) {
            let lang = nextProps.location.pathname.split('/')[1];
            if (lang && lang !== nextProps.globals.store_locale) {
               this.props.handleLanguageSelection(lang);
            }
      }
   }

   translate = (lang, dir) => {
      this.props.handleLanguageSelection(lang);
   }

   openModal = () => {
      this.setState({ showModal: true });
   }
   closeModal = () => {
      this.setState({ showModal: false });
   }

   closeInfoModal = (value) => {
		this.setState({ infoModel: false })
		if (value === "true") {
			this.setState({ infoModel: false })
		}
	}

   SideBarOpen = () => {
      // document.getElementById("mText").style.cssText = "font-size:1rem; bottom:-8px;";
      $("#SideBar").addClass("leftZero");
      $("#sideBarOverlay").addClass("sidebar-overlay");
      document.body.style.overflowY = "hidden";
   }

   componentDidMount() {
      $(function () {
         var _top = $(window).scrollTop();
         var _direction;

         $(window).scroll(function () {
            var scroll = $(window).scrollTop();
            var _cur_top = $(window).scrollTop();
            if (_top < _cur_top && scroll >= 170 && document.getElementById("header")) {
               //   _direction = 'down';
               document.getElementById("header").style.transform = "translateY(-115px)";
               // document.getElementById("webFilter").style.transform = "translateY(0px)";   


            }
            else if (document.getElementById("header")) {
               //   _direction = 'up';
               document.getElementById("header").style.transform = "translateY(0px)";
               //document.getElementById("webFilter").style.transform = "translateY(110px)";  

            }
            _top = _cur_top;

         });
      });

      if (this.props.guest_user.temp_quote_id === null || this.props.guest_user.temp_quote_id === "") {
         this.props.onGetGuestCartId();
      }
   }
   onEditClick=()=>{
      this.setState({ showModal: false, infoModel: true  })
   }
   logout=()=>{
      this.props.onLogoutUser();
      const store_locale=this.props.globals.store_locale;
      this.props.history.push(`/${store_locale}/home`)
     
       this.setState({ showModal: false })
   }

   goToCart=()=>{
      // if (this.props.user_details.isUserLoggedIn) 
      // {
         this.props.history.push(`/${this.props.globals.store_locale}/cart`);
      // }
      // else
      // {
      //    const location = {
      //          pathname: `/${this.props.globals.store_locale}/login`,
      //          state: { from: `/${this.props.globals.store_locale}/cart` }
      //       }

      //    this.props.history.push(location);
      // }
   }

   goToWishList=()=>{
      if (this.props.user_details.isUserLoggedIn) 
      {
         this.props.history.push(`/${this.props.globals.store_locale}/wishlist`);
      }else
      {
         const location = {
               pathname: `/${this.props.globals.store_locale}/login`,
               state: { from: `/${this.props.globals.store_locale}/wishlist` }
            }

         this.props.history.push(location);
      }
   }

   closeMenu = (e) => {
      var x = document.getElementsByClassName("dropdown-menu");
      x.style.display = "none";
   }


   render() {
      const {user} = this.props.account
      avtarImage.map((item,index) => {
			if (this.props.account  && this.props.account.AddressBookData && this.props.account.AddressBookData.avatar  &&  this.props.account.AddressBookData.avatar === item.name) {
				setAvtarImageFromAPI = item.image
				avatarName=item.name
			}
      })
      // avtarImage.map((item, index) => {
			
		// 	if (this.props.account  && this.props.account.AddressBookData && this.props.account.AddressBookData.avatar  &&  this.props.account.AddressBookData.avatar === item.name) {
		// 		setAvtarImageFromAPI = item.image
		// 		avatarName=item.name
		// 	}
		// })
      let cartcount=0;
      let wishListItemsCount = 0;
      if(this.props.myCart && this.props.myCart.my_cart_count){
         cartcount=this.props.myCart.my_cart_count;
      }
      if(this.props.wishListItems && this.props.wishListItems.products) {
         wishListItemsCount = this.props.wishListItems.products.length;
      }
      let isLoginPage = false;
      let { menus, myCart } = this.props;
      if (this.props.location.pathname.includes('/login')
         || this.props.location.pathname.includes('/forgotPassword')
         || this.props.location.pathname.includes('/register')
         || this.props.location.pathname.includes('/forgotUser')
         || this.props.location.pathname.includes('/password-rest')
         || this.props.location.pathname.includes('/comming-soon')
         || this.props.location.pathname.includes('/maintenance')) 
         {
         isLoginPage = true;
         document.body.style.paddingTop = "0px";
         document.body.style.paddingBottom = "0px";
         document.body.classList.add("bodyBgColor");
      } else if (this.props.location.pathname.includes('/checkoutprocess')
         || this.props.location.pathname.includes('/shipping')
         || this.props.location.pathname.includes('/checkoutContactInfo')
         || this.props.location.pathname.includes('/checkoutPaymentMethod')) {
            isCheckout = true;
            document.body.style.paddingTop = "0px";
      }
      else {
         isLoginPage = false;
         isCheckout = false;
         document.body.style.paddingTop = "111px";
         document.body.style.paddingBottom = "265px";
         document.body.classList.remove("bodyBgColor");
      }
      const { store_locale, currentStore } = this.props.globals;

      return (
         <>
            {isLoginPage ? <div id="header">
            </div>
               : <header className="header">
                  <div id="sideBarOverlay">
                     <div id="SideBar" className="SideBar">
                        <SideBar store_locale={store_locale} menus={menus} />
                     </div>
                  </div>
                  {!isCheckout && <div className="web_Header" id="header">
                     <div className="topBar">
                        <div className="row">
                           <div className="col-md-6">
                              <div className="leftSide">
                                 <ul className="list-inline">

                                    <li className="list-inline-item certified">
                                        <FormattedMessage id="header.legoCerfified" defaultMessage="LEGO® Certified Store" />
                           </li>
                                    <li className="list-inline-item">
                                       <Link to={`/${store_locale}/aboutus`}>
                                       <span className="spacingLine"><img src={aboutIcon} alt="aboutUs" /><FormattedMessage id="AboutUs.Text" defaultMessage="About Us" /></span></Link>
                                    </li>
                                    <li className="list-inline-item">
                                       <Link to={`/${store_locale}/storelocator`}>
                                       <span className="spacingLine"><img src={storIcon} alt="store" />  <FormattedMessage id="header.Store" defaultMessage="Store" /></span></Link>
                                    </li>
                                    <li className="list-inline-item">
                                       {currentStore === 1 &&
                                       <span className="spacingLine lang" onClick={(e) => this.translate('en', 'ltr')}>
                                         English
                                       </span>
                                       }
                                       {currentStore === 2 && 
                                       <span className="spacingLine lang" onClick={(e) => this.translate('ar', 'rtl')}>
                                          العربية
                                       </span>
                                       }
                                    </li>
                                 </ul>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="rightSide">
                                 <ul className="list-inline">
                                    <li className="list-inline-item">
                                       {this.props.customer_details.isUserLoggedIn?  
                                       <Link to={`/${store_locale}/profile`}>
                                          <img src={accountIcon} alt="account" />
                                             <span className="title-account"> {user ? `${user.firstname} ${user.lastname}` : this.props.customer_details.customer_details.firstname+' '+this.props.customer_details.customer_details.lastname }
                                             </span>
                                       </Link>
                                       :<span onClick={() => this.setState({ showModal: true })}> 
                                        <img src={accountIcon} alt="account" />
                                         <span className="title-account"><FormattedMessage id="myAccountInfo.Account" defaultMessage="Account" /></span>
                                         </span>
                                        }
                                    </li>

                                    {this.state.infoModel ? (
                                       <div>
                                          <Modal modalId="changeInfoModel" open={this.state.infoModel} onClose={this.closeInfoModal}>
                                             {/* <div className="sInModel ">Account</div> */}
                                             <div className="modal-body">
                                                <div className="container-fluid nopadding">
                                                   <EditAccount setAvtarImageNameAPI={avatarName} setAvtarImageFromAPI={setAvtarImageFromAPI} useredit={this.props.account.user} closeInfoModal={this.closeInfoModal} />
                                                </div>
                                             </div>
                                          </Modal>
                                       </div>
                                    ) :''}   
                                    {this.state.showModal ? <div>
                                       <Modal modalId="signInModel" open={this.state.showModal} onClose={this.closeModal}>
                                          <div className="sInModel "><FormattedMessage id="login.ModelText" defaultMessage="Account" /></div>
                                          <div className="modal-body">
                                             <div className="container-fluid nopadding">
                                                <div className="pt-4 pb-4">
                                                   <div className="row">
                                                      <div className="col-3 col-md-2">
                                                         <Link to={`/${store_locale}/`}>  <img src={logo} alt="logo" /></Link>
                                                      </div>
                                                      <div className="col-9 col-md-10">
                                                         {this.props.customer_details.isUserLoggedIn === false ?
                                                            <p className="model-title"><FormattedMessage id="login.ModelLogoText" defaultMessage="Sign In to your LEGO® Account" /></p> :
                                                            <p className="model-title"><FormattedMessage id="login.ModelLogoTextLog" defaultMessage="your LEGO® Account" /></p>}
                                                      </div>
                                                   </div>
                                                </div>
                                                {this.props.customer_details.isUserLoggedIn === false && <div className="row">
                                                   <div className="col-12"> <Link to={`/${store_locale}/login`}><button type="button" onClick={() => this.setState({ showModal: false })} className="btn filter-model btn-lg btn-block mb-4 buttonSign"><FormattedMessage id="login.ModelBtnText" defaultMessage="Sign In" /></button></Link></div>
                                                </div>}
                                                {this.props.customer_details.isUserLoggedIn === true && <div className="row pb-2 pt-3">

                                                   <div className="col-12 col-md-6">
                                                      <p className="register-strip">{this.props.customer_details.customer_details.email}</p>
                                                   </div>

                                                </div>}
                                                {this.props.customer_details.isUserLoggedIn === false ?
                                                   <div className="row pb-2 pt-3">
                                                      <div className="col-7 col-md-6">
                                                         <p className="register-strip"><FormattedMessage id="login.ModelaccountText" defaultMessage="Don't have an account?" /></p>
                                                      </div>
                                                      <div className="col-5 col-md-6">
                                                         <p onClick={() => this.setState({ showModal: false })} className="register-strip">   <Link to={`/${store_locale}/register`}><FormattedMessage id="login.ModelregisterText" defaultMessage="Register" /></Link></p>
                                                      </div>

                                                   </div> :
                                                   <div className="row pb-2 pt-3">

                                                      <div className="col-12 col-md-6">
                                                         <Link to={`/${store_locale}/profile`}>
                                                         <p  onClick={()=>this.onEditClick()} className="register-strip editLegoAcc">Edit Lego Account</p></Link>
                                                      </div>

                                                   </div>}

                                                <div className="row">
                                                   <div className="col-12">
                                                      <hr />
                                                   </div>
                                                   {this.props.customer_details.isUserLoggedIn===true &&
                                                   <div className="col-md-12 col-12">
                                                      <div style={{textAlign:'center'}} className="LogOutDiv">
                                                         <button onClick={()=>this.logout()
                                                         } className="LogOutSign">
                                                            <FormattedMessage id="myAccountInfo.Logout" defaultMessage="Logout" />
                                                         </button>
                                                      </div>
                                                   </div>}
                                                </div>
                                                {/* <div className="row pb-4 pt-3">
                                                <div className="col-5">
                                                <img src={truck} alt="shipping" />
                                                   </div>
                                                   <div className="col-7">
                                                   <p className="order-status"><Link to={`/${store_locale}/myOrder`}> Check Order Status</Link></p>
                                                   </div>
                                                
                                             </div>
                                             <div className="row">
                                                <div className="col-12">
                                                <hr />
                                                </div>
                                          </div> */}
                                             </div>
                                          </div>
                                       </Modal>
                                    </div> : ''}
                                    <li className="list-inline-item">
                                       {this.props.customer_details.isUserLoggedIn===true ?
                                       <Link to={`/${store_locale}/wishlist`}>
                                          <span>
                                             <img src={wishIcon} alt="store" /> <FormattedMessage id="header.wishList" defaultMessage="Wish List" /><span className="count">{`(${wishListItemsCount})`}</span></span>
                                       </Link>:
                                       // <Link to={`/${store_locale}/login`}>
                                       <span onClick={()=>this.goToWishList()}>
                                          <img src={wishIcon} alt="store" />
                                          <FormattedMessage id="header.wishList" defaultMessage="Wish List" />
                                          {/* <span className="count">{`(${myCart.cart_count})`}</span> */}
                                       </span>
                                    // </Link>
                                    }

                                    </li>
                                    <li className="list-inline-item" onClick={()=>this.goToCart()}>
                                       {/* <Link to={`/${store_locale}/cart`}> */}
                                          <span>
                                             <img src={bagIcon} alt="store" />
                                             <FormattedMessage id="header.myBag" defaultMessage="My Bag" />
                                             <span className="count">{`(${cartcount})`}</span>
                                          </span>
                                       {/* </Link> */}
                                    </li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="navBarHeader">
                        <div className="row">
                           <div className="col-md-1">
                              <Link to={`/`}>
                                 <div className="mainLogo">
                                    <img src={logo} alt="logo" />
                                 </div>
                              </Link>
                           </div>
                           <div className="col-md-8 pd_0 pos_nor">
                              <div className="menuItem">
                                 <ul className="list-inline">
                                    {menus && menus.map((option) => {
                                       return (
                                          <>
                                             {option.url_key && option.url_key !== "sale"  && option.url_key !== "shop-by"  &&
                                                <li className="nav-item dropdown list-inline-item">
                                                   <Link className="nav-link dropdown-toggle" to={`/${store_locale}/productlisting/${option.url_path}`}   id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                      {option.name} <img src={downArrow} alt="downArrow" />
                                                   </Link>
                                                   <div id={option.url_key} className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                      <div className="row">
                                                         <div className="col">
                                                            <ul className="list-inline">
                                                               {option.children && option.children[0] && option.children[0][0] &&
                                                                  option.children[0][0].map((data,index) => {
                                                                     return (
                                                                        <li key ={index} className="list-inline-item dropdown-item">
                                                                           <Link to={`/${store_locale}/productlisting/${data.url_path}`}>{data.name}</Link>
                                                                        </li>
                                                                     )
                                                                  })}
                                                            </ul>
                                                         </div>
                                                         <div className="col">
                                                            <ul className="list-inline">
                                                               {option.children && option.children[0] && option.children[0][1] &&
                                                                  option.children[0][1].map((data,index) => {
                                                                     return (
                                                                        <li key ={index} className="list-inline-item dropdown-item">
                                                                           <Link to={`/${store_locale}/productlisting/${data.url_path}`} >
                                                                              {data.name}
                                                                           </Link>
                                                                        </li>
                                                                     )
                                                                  })}
                                                            </ul>
                                                         </div>
                                                         <div className="col">
                                                            <ul className="list-inline">
                                                               {option.children && option.children[0] && option.children[0][2] &&
                                                                  option.children[0][2].map((data,index) => {
                                                                     return (
                                                                        <li key={index} className="list-inline-item dropdown-item">
                                                                           <Link to={`/${store_locale}/productlisting/${data.url_path}`}   >
                                                                              {data.name}
                                                                           </Link>
                                                                        </li>
                                                                     )
                                                                  })}
                                                            </ul>
                                                         </div>
                                                         <div className="col">
                                                            <ul className="list-inline">
                                                               {option.children && option.children[0] && option.children[0][3] &&
                                                                  option.children[0][3].map((data,index) => {
                                                                     return (
                                                                        <li key={index} className="list-inline-item dropdown-item">
                                                                           <Link to={`/${store_locale}/productlisting/${data.url_path}`}   >
                                                                              {data.name}
                                                                           </Link>
                                                                        </li>
                                                                     )
                                                                  })}
                                                            </ul>
                                                         </div>
                                                         {/* <div className="col colBorderRight">
                                                            <div className="MoreThemes">
                                                               <div className="circleDiv">
                                                                  <Link to={`/${store_locale}/productlisting/${option.url_path}`} className="circle">
                                                                     <img className="arrow" src={learnMoreRight} alt="learnMoreRight" />
                                                                  </Link>
                                                                  {option.name && <p className="titleMore">Learn about all {option.name.toLowerCase()}</p>}
                                                               </div>

                                                            </div>
                                                         </div> */}
                                                      </div>
                                                   </div>
                                                </li>}
                                             {option.url_key && option.url_key === "shop-by" &&
                                                <li className="nav-item dropdown list-inline-item">
                                                   <Link className="nav-link dropdown-toggle"
                                                      to={`/${store_locale}/productlisting/${option.url_path}`}  
                                                      id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                      {option.name} <img src={downArrow} alt="downArrow" />
                                                   </Link>
                                                   <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                      <ShopBy options={option.children} store_locale={store_locale} />
                                                   </div>
                                                </li>}

                                                {option.url_key && option.url_key === "sale" &&
                                                   <li className="nav-item dropdown list-inline-item">
                                                      <Link className="nav-link dropdown-toggle"
                                                         to={`/${store_locale}/productlisting/${option.url_path}`}  
                                                         id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                         {option.name}  { parseInt(option.children_count) > 0 && <img src={downArrow} alt="downArrow" /> }
                                                      </Link>
                                                     { parseInt(option.children_count) > 0 &&
                                                      <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                          Sale data to Show
                                                      </div>}
                                                   </li>
                                                }
                                                
                                          </>
                                       )
                                    })}

                                    {/* <li className="nav-item dropdown list-inline-item">
                              <Link className="nav-link dropdown-toggle" to="" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              Sale {/*<img src={downArrow} alt="downArrow" />
                              </Link>
                              {/* <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                              <ShopBy />
                              </div> 
                           </li>
                           <li className="nav-item dropdown list-inline-item">
                              <Link className="nav-link dropdown-toggle" to="" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              new in <img src={downArrow} alt="downArrow" />
                              </Link>
                              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                              <ul className="list-inline">
                                       <li className="list-inline-item dropdown-item">
                                          <Link to={`/`}>
                                       Account</Link>
                                       </li>
                                       <li className="list-inline-item  dropdown-item">
                                          <Link to={`/`}>
                                       Wish List<span className="count">(0)</span></Link>
                                       </li>
                                       <li className="list-inline-item dropdown-item">
                                          <Link to={`/`}>
                                          My Bag<span className="count">(0)</span></Link>
                                       </li>
                                    </ul>
                              </div>
                           </li>
                           <li className="nav-item dropdown list-inline-item">
                              <Link className="nav-link dropdown-toggle" to="" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              exclusives
                              </Link>
                              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                              <ul className="list-inline">
                                       <li className="list-inline-item dropdown-item">
                                          <Link to={`/`}>
                                       Account</Link>
                                       </li>
                                       <li className="list-inline-item  dropdown-item">
                                          <Link to={`/`}>
                                       Wish List<span className="count">(0)</span></Link>
                                       </li>
                                       <li className="list-inline-item dropdown-item">
                                          <Link to={`/`}>
                                          My Bag<span className="count">(0)</span></Link>
                                       </li>
                                    </ul>
                              </div>
                           </li> */}
                                 </ul>
                              </div>
                           </div>
                           <div className="col-md-3 searchMain">
                              <Search />
                           </div>
                        </div>
                     </div>
                     
                  </div>}
                  {/* CheckOut Page Navigation */}
                  {isCheckout && <div class="smallNavigation">
                        <div class="navGrid">
                           <div class="backToBag">
                           <Link to={`/${store_locale}/cart`} class="ljDNej d-flex">
                                 <div class="leftArrow">
                                 <img src={leftArrow} alt="logo" />
                                 </div>
                                 <div class="myBagText">
                                    <span class="myBagText">{ this.props.globals.store_locale === "en" ? "Back": "رجوع" } <span class="d-none d-sm-block">&nbsp;{ this.props.globals.store_locale === "en" ? "to My Bag": "إلى عربة التسوق الخاصة بي" } </span></span>
                                 </div>
                                 </Link>
                           </div>
                           <div class="Headerstyles__LogoContainer-gtyp30-3 EHyLC">
                           <Link to={`/${store_locale}/`}>  <img src={logo} alt="logo" /></Link>
                           </div>
                           <div class="rightCheckOut">
                                 <div class="kGufrb">
                                 <img src={checkoutLock} alt="logo" />
                                 </div>
                                 <div class="myBagText"><span class="dlAVSN"><FormattedMessage id="header.SecureCheckout" defaultMessage="Secure Checkout" /></span></div>
                           </div>
                        </div>
                     </div>}
                     {!isCheckout && <div className="mob_Header">
                     <div className="topMobile">
                        <div className="row">
                           <div className="col-6 m_pd toggleWidth">
                              <div className="leftSide">
                                 <ul className="list-inline">
                                    <li className="list-inline-item mrRight" id="toggle" onClick={() => this.SideBarOpen()}>
                                       <span className=" toggle" >
                                          <img src={toggleIcon} alt="toggleIcon" />
                                          <span className="menuText">  <FormattedMessage id="header.MenuLael" defaultMessage="MENU" /></span>
                                       </span>
                                       {/* id="mText" */}
                                    </li>
                                    <li className="list-inline-item certifiedLabel">
                                    <FormattedMessage id="header.legoCerfified" defaultMessage="LEGO® Certified Store" />
                  </li>

                                 </ul>
                              </div>
                           </div>
                           {/* <div className="col-2">
                        <Link to={`/`}>
                           <div className="mainLogoMobile">
                              <img src={logo} alt="logo" />
                           </div>
                        </Link>
         </div> */}
                           <div className="col-6 p0S">
                              <div className="rightSide">
                                 <ul className="list-inline">
                                    <li className="list-inline-item vAlignMiddle">
													{this.props.globals.store_locale === "ar" ? (
                                         <span className="english-langchange-padding lang" onClick={(e) => this.translate('en', 'ltr')}>Eng</span>
													) : (
                                          <span className="english-langchange-padding lang" onClick={(e) => this.translate('ar', 'rtl')}> العربية</span>
													)}
                                    </li>
                                    <li className="list-inline-item">
                                    {this.props.customer_details.isUserLoggedIn===true ?
                                    <Link to={`/${store_locale}/profile`}>
                                       <img src={accountIcon} alt="account" />
                                    </Link>:
                                       <img onClick={()=>this.setState({showModal:true})} src={accountIcon} alt="account" />
                                    }
                                    </li>
                                    {this.props.customer_details.isUserLoggedIn===true ?
                                    <li className="list-inline-item">
                                       <Link to={`/${store_locale}/wishlist`}>
                                          <img src={wishIcon} alt="store" /><span className="count">{wishListItemsCount}</span>
                                             </Link>
                                    </li>:
                                    <li className="list-inline-item" onClick={()=>this.goToWishList()}>
                                    {/* <Link to={`/${store_locale}/login`}> */}
                                       <img src={wishIcon} alt="store" /><span className="count">{wishListItemsCount}</span>
                                    {/* </Link> */}
                                 </li>}
                                 {this.props.customer_details.isUserLoggedIn===true ?
                                    <li className="list-inline-item" onClick={()=>this.goToCart()}>
                                       {/* <Link to={`/${store_locale}/cart`}> */}
                                          <img src={bagIcon} alt="store" /><span className="count">{cartcount}</span> 
                                       {/* </Link> */}
                                    </li>
                                    :
                                    <li className="list-inline-item" onClick={()=>this.goToCart()}>
                                       {/* <Link to={`/${store_locale}/cart`}> */}
                                          <img src={bagIcon} alt="store" /><span className="count">{cartcount}</span>
                                       {/* </Link> */}
                                    </li>
                                    }
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="m_searchMain">
                        <div className="row">
                           <div className="col-2">
                              <Link to={`/`}>
                                 <div className="mainLogoMobile">
                                    <img src={logo} alt="logo" />
                                 </div>
                              </Link>
                           </div>
                           <div className="col-10">
                              <Search />
                           </div>
                        </div>

                     </div>
                  </div>}
               </header>}
         </>
      );
   }
}
const mapStateToProps = state => {
   return {
      globals: state.global,
      menus: state.menu.menus,
      customer_details: state.login,
      guest_user: state.guest_user,
      user_details:state.login,
      myCart:state.myCart,
      wishListItems: state.wishList,
      account: state.account,
   };
}
const mapDispatchToProps = dispatch => {
   return {
      onGetMenu: (payload) => dispatch(actions.getMenu(payload)),
      onGetGuestCartId: () => dispatch(actions.getGuestCartId()),
      onLogoutUser:()=>dispatch(actions.logoutUser()),
      onGetMyCartList:(payload)=>dispatch(actions.getMyCart(payload)),
      onGetCartCount:(payload)=>dispatch(actions.getCartCount(payload)),
      onSearchProduct: (payload) =>dispatch(actions.getSearchData(payload)),
      onGetWishListItem: (payload) => dispatch(actions.getWishlist(payload)),
      onGetAccountPageData: (payload) => dispatch(actions.getAccountPageData(payload)),
		onGetAddressBook: (payload) => dispatch(actions.getAddressBook(payload)),
      
   }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(header));