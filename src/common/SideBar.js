import React, { Component } from 'react';
import $ from 'jquery';
import closeIcon from '../assets/images/icons/close.png';
import m_Right from '../assets/images/icons/rightArrow.png';
import A_left from '../assets/images/icons/leftArrow.png';
import aboutIcon from '../assets/images/icons/aboutus.png';
import accountIcon from '../assets/images/icons/account.png';
import wishIcon from '../assets/images/icons/wishlist.png';
import bagIcon from '../assets/images/icons/bag.png';
import storIcon from '../assets/images/icons/store-face.png';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Search from './header/Search';
import { FormattedMessage} from 'react-intl';

let shopByChilds = [];
let shopByOption = {};
class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedMenu: '',
            selectedMenuChildren: [],
            isShopBy: false,
            shopByChildren: []
        }
        
    }
 
    SideBarClose = () =>{       
        // document.getElementById("mText").style.cssText = "font-size:9px; bottom:-14px";
         $("#SideBar").removeClass("leftZero");
         $("#sideBarOverlay").removeClass("sidebar-overlay");
         document.body.style.overflowY = "auto";
        $("#mText").removeClass("mLeft25");
        $("#mTex1").removeClass("mLeft25");
        this.backArrow()
      }
 
    openSubMenu = (option) => {
        if (option && option.url_key !== "shop-by") {
            let selectedMenuChildren = [];
            option.children[0].forEach(data => {
                let copy = [...selectedMenuChildren,...data];
                selectedMenuChildren = copy;
            });

            this.setState({openSub: true, selectedMenu: option, selectedMenuChildren});
        } else if (option && option.url_key === "shop-by") {
            shopByChilds = option.children;
            shopByOption = option;
            this.setState({ isShopBy: true, selectedMenu: option, selectedMenuChildren: option.children });
        }

        // document.getElementById("searchSideM").style.display = "none";
        document.getElementById('MenuDiv').style.display = "none";       
        document.getElementById('backArrowBtn').style.display = "block";        
    }

    backArrow = () =>{
        this.setState({openSub: false});
        $("#mText1").removeClass("mLeft25");
        // document.getElementById("searchSideM").style.display = "block";
        document.getElementById('MenuDiv').style.display = "block";      
        document.getElementById('backArrowBtn').style.display = "none";  
        this.setState({ isShopBy: false, openSub: false, selectedMenu: {}, shopByChildren: [], selectedMenuChildren: [] });    
    }
    componentDidUpdate(){
        if(this.state.openSub || this.state.isShopBy || (this.state.shopByChildren && this.state.shopByChildren.length > 0)){
            $("#mText1").addClass("mLeft25");
        } else{          
            $("#mText1").removeClass("mLeft25");
        }
    }

    backArrowToShopBy = () => {
        // document.getElementById("searchSideM").style.display = "none";
        document.getElementById('MenuDiv').style.display = "none";       
        document.getElementById('backArrowBtn').style.display = "block";
        this.setState({openSub: false, isShopBy: true, selectedMenu: shopByOption, selectedMenuChildren: shopByChilds, shopByChildren: []})
    }

    openSubMenuOfShopBy = (child) => {
        // document.getElementById("searchSideM").style.display = "none";
        document.getElementById('MenuDiv').style.display = "none";       
        document.getElementById('backArrowBtn').style.display = "block";
        this.setState({openSub: false, isShopBy: false, selectedMenu: child, selectedMenuChildren: [], shopByChildren: child.children})
    }

    render() {
        const { store_locale, menus } = this.props;
        const {user} = this.props.account

        return (
            <div>                
                 <div className="searchDiv">
                     <div className="MenuName">
                        { this.props.user_details.isUserLoggedIn ? 
                        <span className="MenuLebal" id="mText1"> 
                            <i class="fa fa-user-o" aria-hidden="true"></i>&nbsp;
                            {/* <FormattedMessage id="myAccountInfo.hi" defaultMessage="Hi" />&nbsp; */}
                            {user ? `${user.firstname} ${user.lastname}` : this.props.user_details.customer_details.firstname+' '+this.props.user_details.customer_details.lastname }
                        </span>:
                        <span className="MenuLebal" id="mText1"> 
                        <FormattedMessage id="header.MenuLael" defaultMessage="MENU" />
                        </span>}
                      <span className="LineDivide"></span>
                      <img onClick={() => this.backArrow()} src={A_left} alt="m_Right" id="backArrowBtn" className="backArrowBtn"/>
                     <img src={closeIcon} alt="closeIcon" onClick={() => this.SideBarClose()}/>
                     </div>
                     {/* <div className="m_searchSide" id="searchSideM">
                        <div id="auto_SuggestionSideBar"> <Search /></div>
                    </div> */}
                 </div>
                 <div className="MenuDiv" id="MenuDiv">
                <Link to={`/${store_locale}`}>               
                 <div className="m_Menu" onClick={() => this.SideBarClose()}>
                    <span className="M_Lebal">
                    <FormattedMessage id="home" defaultMessage="Home" />
                    </span>
                 </div>
                 </Link>
                 {menus && menus.map((option) => {
                    if (Array.isArray(option.children[0]) && option.children[0].length  < 1 ){
                        return (
                            <>
                            <Link to={`/${store_locale}/productlisting/${option.url_path}`}>
                                <div className="m_Menu" onClick={() => this.SideBarClose()}>
                                <span className="M_Lebal">{option.name}</span>
                                </div>
                            </Link>
                            </>
                        )
                    }
                    return (
                    <>
                        <div className="m_Menu" onClick={() => {
                            this.openSubMenu(option)}}>
                        <span className="M_Lebal">{option.name}</span>
                            <img src={m_Right} alt="m_Right" />
                        </div>
                    </>
                )})}
                 {this.props.user_details.isUserLoggedIn===true &&
                  <Link to={`/${store_locale}/profile`}>
                 <div className="m_MenuIcon" onClick={() => this.SideBarClose()}>
                 <img src={accountIcon} alt="m_Right" />
                <span className="M_Lebal">
                     <FormattedMessage id= "myAccountInfo.Account" defaultMessage="My Account" />
                 {/* {this.props.user_details.isUserLoggedIn ? this.props.user_details.customer_details.firstname+' '+this.props.user_details.customer_details.lastname :"My Account"} */}
                 </span>
                 </div>
                 </Link>}
                 {this.props.user_details.isUserLoggedIn===true  ?
                 <Link to={`/${store_locale}/wishlist`} className="M_Lebal">
                     <div className="m_MenuIcon" onClick={() => this.SideBarClose()}>
                     <img src={wishIcon} alt="m_Right" />
                    <FormattedMessage id="header.wishList" defaultMessage="Wish List" />
                 </div>
                 </Link>:
                 <Link to={`/${store_locale}/login`} className="M_Lebal"> 
                 <div className="m_MenuIcon" onClick={() => this.SideBarClose()}>
                 <img src={wishIcon} alt="m_Right" />
                 <FormattedMessage id="header.wishList" defaultMessage="Wish List" />
                 </div>
                 </Link>}
                 <Link to={`/${store_locale}/cart`} className="M_Lebal">
                 <div className="m_MenuIcon" onClick={() => this.SideBarClose()}>
                 <img src={bagIcon} alt="m_Right" />
                  <FormattedMessage id="header.myBag" defaultMessage="My Bag" />
                 </div>
                 </Link>
                 <Link to={`/${store_locale}/aboutus`} className="M_Lebal">
                 <div className="m_MenuIcon" onClick={() => this.SideBarClose()}>
                 <img src={aboutIcon} alt="m_Right" />
                  <FormattedMessage id="AboutUs.Text" defaultMessage="About us" />
                 </div>
                 </Link>
                 <Link to={`/${store_locale}/storelocator`} className="M_Lebal">
                 <div className="m_MenuIcon" onClick={() => this.SideBarClose()}>
                 <img src={storIcon} alt="m_Right" />
                 <FormattedMessage id="header.Store" defaultMessage="Store" />
                 </div>
                 </Link>
                 </div> 
                 {this.state.openSub &&  
                         <div className="insideDiv" id="insideDiv">
                         <Link to={`/${store_locale}/productlisting/${this.state.selectedMenu.url_path}`}>
                         <div className="MainTitle" onClick={() => this.SideBarClose()}>
                             <span>{this.state.selectedMenu.name}</span>
                         </div>
                         </Link>
                         <div className="subCategoryDiv" >
                            {this.state.selectedMenu && this.state.selectedMenuChildren && 
                            this.state.selectedMenuChildren.map((child) => {
                                return (
                                <>
                                <Link to={`/${store_locale}/productlisting/${child.url_path}`}>
                                    <div className="insideSub" onClick={() => this.SideBarClose()}>
                                        <span>{child.name}</span>
                                    </div>
                                </Link>
                                </>
                            )})}
                            {/* {this.state.selectedMenuChildren.length > 0 &&
                             <Link to={`/${store_locale}/productlisting/${this.state.selectedMenu.url_path}`} onClick={() => this.SideBarClose()}>
                            <div className="LearnTheme">
                                   <Link to={`/${store_locale}/productlisting/${this.state.selectedMenu.url_path}`}>
                                    {'Learn about all '+this.state.selectedMenu.name} 
                                <span className="MoreThemeUrl"><svg width="6" height="9" className="Chevron__ChevronIcon-sc-1q2x5f4-0 bgViWV" viewBox="0 0 18 28" aria-hidden="true" data-di-rand="1590040132033"><path d="M1.825 28L18 14 1.825 0 0 1.715 14.196 14 0 26.285z" fill="currentColor"></path></svg></span>
                                </Link>
                                </div>
                            </Link>} */}
                        </div>
                     </div>}
                  {this.state.isShopBy && this.state.selectedMenuChildren &&
                    <div className="MenuDiv" id="ShopBy">
                        <Link to={`/${store_locale}/productlisting/${this.state.selectedMenu.url_path}`}>
                        <div className="titleMain" onClick={() => this.SideBarClose()}>
                            <Link >{this.state.selectedMenu.name}</Link>
                            {/* <img onClick={() => this.backArrowToShopBy()} src={A_left} alt="m_Right" id="backArrowBtn" className="backArrowBtn"/> */}
                        </div>
                        </Link>
                        {this.state.selectedMenuChildren.map((child) => {
                        return (
                            <>
                                {child.info.children && <div className="m_Menu" onClick={() => this.openSubMenuOfShopBy(child.info)} >
                                <span className="M_Lebal">{child.info.name}</span>
                                    <img src={m_Right} alt="m_Right" />
                                </div>}
                                {!child.info.children &&  <Link  to={`/${store_locale}/productlisting/${child.info.url_path}`}>
                                <div className="m_Menu" onClick={() => this.SideBarClose()} >
                               <span className="M_Lebal">{child.info.name}</span>
                                    {/* <img src={m_Right} alt="m_Right" /> */}
                                </div>
                                </Link>}
                            </>)})}
                    </div>
                  }
                  {this.state.shopByChildren && this.state.shopByChildren.length > 0 &&
                    <>
                         <div className="insideDiv" id="shopByInside">
                         <div className="topSub " onClick={() => this.backArrowToShopBy()}>
                            <span >SHOP BY</span>
                             <img src={A_left} alt="m_Right" id="backArrowBtn" className="backArrowBtn"/>
                         </div>
                         <Link to={this.state.selectedMenu.url_path ? `/${store_locale}/productlisting/${this.state.selectedMenu.url_path}`:'#'} onClick={() => {this.state.selectedMenu.url_path && this.SideBarClose()}}>
                         <div className="topSubChild" >
                            <span>{this.state.selectedMenu.name}</span>
                         </div>
                         </Link>
                         <div className="subCategoryDiv" >
                            {this.state.selectedMenu && this.state.shopByChildren && 
                            this.state.shopByChildren.map((child) => {
                                return (
                                <><Link to={('url_path' in child) ? 
                                `/${store_locale}/productlisting/${child.url_path}`:
                                `/${store_locale}/productdetails/${child.url_key}` 
                            }>
                                    <div className="insideSub" onClick={() => this.SideBarClose()}>
                                        <span>{child.name} </span>
                                    </div>
                                </Link>
                                </>
                            )})}
                            {(this.state.selectedMenu.name == "Popular Product" || this.state.selectedMenu.name == "New Product") && <div className="insideSub">
                                <Link to={`/${store_locale}/productlisting/${this.state.selectedMenu.url_path}`}>
                                {'See all '+this.state.selectedMenu.name} </Link>
                            </div>}
                        </div>
                     </div>
                    </>}
                </div>
        )
    }
}


const mapStateToProps = state => {
    return {
       globals:state.global,
       user_details:state.login,
       account: state.account,

    };
 }
 const mapDispatchToProps = dispatch => {
 return {
 }
 }
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SideBar));
