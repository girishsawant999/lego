import React, { Component } from "react"

import { Link } from "react-router-dom"
import { connect } from 'react-redux';
import HomeBannerEn from '../../assets/images/HomeBannerEn.jpg';
import HomeBannerAr from '../../assets/images/HomeBannerAr.jpg';
import HomeBannerMAr from '../../assets/images/HomeBannerMAn.jpg';
import HomeBannerMEn from '../../assets/images/HomeBannerMEn.jpg';

import referbannerWen from '../../assets/images/referbannerWen.jpg';
import referbannerWar from '../../assets/images/referbannerWen.jpg';
import referbannerMen from '../../assets/images/referbannerMen.jpg';
import referbannerMar from '../../assets/images/referbannerMar.jpg';

import hold2 from '../../assets/images/hold2.jpg';
import TwContact from '../../assets/images/icons/twContactUs.png';
import YtContact from '../../assets/images/icons/ytContactUs.png';
import fbLogo from '../../assets/images/icons/facebook.png';
import instaLogo from '../../assets/images/icons/instagram.png';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import storIcon from '../../assets/images/icons/store-face.png';
import aboutIcon from '../../assets/images/icons/aboutus.png';
import logo from '../../assets/images/icons/Headerlogo.png';
import Spinner2 from "../Spinner/Spinner2"
import { store } from '../../redux/store/store'
import { setChangeStore } from '../../redux/actions/globals'
import Axios from 'axios';
import { CLONE_BASE_URL, API_TOKEN } from '../../api/globalApi';
import * as actions from "../../redux/actions/index"
import AddBagAlert from '../../common/AlertBox/addToBagAlert';

let langLoader = null;
class LogoSlider extends Component {
	constructor(props) {
    super(props);
    this.state = {
        language: 'ar',
        dir: 'rtl',
        changeData: false,
        store_id: '',
        selectedStore: '',

        isDisabled: true,
        email: '',
        friend1: '',
        friend2: '',
        friend3: '',
        friend4: '',
        friend5: '',

        addMessagePopup: false,
			  addMessage: "",
    }
    this.store_locale = this.props.globals.store_locale

  }
  
  translate = (lang, dir) => {
    this.handleLanguageSelection(lang, dir);
  }
  handleLanguageSelection = (language, dir) => {
    langLoader = (<div >
        <Spinner2/>
    </div>);
    let country="KSA"
    //country = (cookie.load('country') === null) ? 'KSA' : cookie.load('country');

    // if (cookie.load('country') === undefined) {
    //     country = 'KSA';
    // } else {
    //     country = cookie.load('country');
    // }
    this.getStoreId(country, language);
    this.handleDir(language);
    //this.handleLangChangeByWithoutAPI(language)
  }
  getStoreId = (country, lang) => {
     
    if (country === '' && country === null) {
        country = 'KSA';
        lang = 'ar'
    }
    let store_locale;
    if(lang==='ar'){
        store_locale='ar'
    }else{
        store_locale='en'
    }
    
    let store_data = country === 'KSA' ? country + "_" + lang : lang;
    // const API = Axios.create({
    //     baseURL: CLONE_BASE_URL,
    //     headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" }
    // });

    // const reqdata = {
    //     store_data: store_data
    // };
    
    // API.get('/storeinfo', {
    //     params: {
    //         ...reqdata
    //     }
    // }).then(res => {
       
        let storeId ;
        if (!storeId) {
            if (lang === 'en') {
                storeId = 2;
            } else if (lang === 'ar') {
                storeId = 1;
            }
        }
        // localStorage.setItem('tempstoreid', storeId);
        // localStorage.setItem('templang', lang);

        // const days = 1000 * 60 * 60 * 24 * 14;
        // const expires = new Date()
        // expires.setDate(Date.now() + days)
        // const country_name = this.getCountryName(country);
        // const store_locale = lang;

        // cookie.save('storeid', storeId, { path: '/', expires, maxAge: days });
        // cookie.save('language', lang, { path: '/', expires, maxAge: days });
        // cookie.save('country', country, { path: '/', expires, maxAge: days });
        // cookie.save('country_name', country_name, { path: '/', expires, maxAge: days });
        // cookie.save('store_locale', store_locale, { path: '/', expires, maxAge: days });

        // localStorage.setItem('storeid', storeId);
        // localStorage.setItem('store_locale', store_locale);

        this.setState({ selectedStore: store_data, store_id: storeId, language: lang, changeData: true });
        store.dispatch(setChangeStore({ store_id: storeId, language: lang }));

     let { guest_user, login } = store.getState();
        let quote_id="guest123"

         if (login.customer_details.quote_id) {
             quote_id = login.customer_details.quote_id;
         } else {
             quote_id = (guest_user.new_quote_id) ? guest_user.new_quote_id : guest_user.temp_quote_id;
         }

        // quote_id = (guest_user.new_quote_id) ? guest_user.new_quote_id : guest_user.temp_quote_id;
        setTimeout(() => {
        this._changeStoreId(storeId, quote_id, store_locale);
            
        }, 1000);
  }
  handleDir = (language) => {
    // cookie.save('langChange', language)
    if (language === 'ar') {
        document.getElementById("dir").classList.add("u-RTL");
        document.getElementById("dir").lang = 'ar';
        document.getElementById("dir").dir = 'rtl';
    } else {
        document.getElementById("dir").lang = 'en';
        document.getElementById("dir").classList.remove("u-RTL");
        document.getElementById("dir").removeAttribute('dir');
    }
  }
  _changeStoreId = (store_id, quote_id, store_locale) => {
    const API = Axios.create({
        baseURL: CLONE_BASE_URL,
        headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" }
    });
    const reqdata = {
        store_id: store_id,
        quote_id: quote_id
    };

    API.post('/Storechange', reqdata).then(res => {
        this._redirectWithLocale(store_locale);   // Change URL Location based on new Locale
    })
  // this._redirectWithLocale(store_locale);
    // const API = Axios.create({
    //     baseURL: CLONE_BASE_URL,
    //     headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" }
    // });

    // const reqdata = {
    //     store_id: store_id,
    //     quote_id: quote_id
    // };

    // API.post('/Storechange', reqdata).then(res => {

    //     this._redirectWithLocale(store_locale);   //Change URL Location based on new Locale
    // })

}
_redirectWithLocale = (newLocale) => {
        
  const curr_pathname = window.location.pathname;
  let new_path = curr_pathname.split('/');
  let new_pathname;
  if (new_path.length > 0) {
      new_path[1] = newLocale;
      new_pathname = new_path.join('/');
      window.location.pathname = new_pathname;
  }

}


submitBtn = (e) => {
  if(this.validateEmail()) {
    const payload = {
      supplier_id: this.state.email,
      friend1: this.state.friend1 ? this.state.friend1: "",
      friend2: this.state.friend2 ? this.state.friend2: "",
      friend3: this.state.friend3 ? this.state.friend3: "",
      friend4: this.state.friend4 ? this.state.friend4: "",
      friend5: this.state.friend5 ? this.state.friend5: "" 
    }
    this.props.onAddreferFriend(payload);
    this.setState({
      email: "",
      friend1: "",
      friend2: "",
      friend3: "",
      friend4: "",
      friend5: "",
    })
    e.preventDefault()

  }
  else {
  e.preventDefault()
  }
}

keyupChangeHandler = (event) => {
  this.setState({
    [event.target.name] : event.target.value
  })

  if(event.target.name === "email") {
    let result = this.checkValid(event.target.value)
    if (!result) {
      // $('#submitBtn').addClass('disableButton');
      this.setState({
        isDisabled: true,
      })
    } else {
      // $('#submitBtn').removeClass('disableButton');
      this.setState({
        isDisabled: false,
      })
    }
  }
}
validateEmail = (e) => {
  var email = e ? e.target.value : this.state.email
  if (email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)) {
    this.setState({ emailErr: "" })
    return true
  } else {
    email.length > 0
      ? this.setState({ emailErr: this.store_locale === 'en' ?  "Email is invalid!": "البريد الإلكتروني غير صالح!" })
      : this.setState({ emailErr: this.store_locale === 'en' ? "Email should not be empty!" : "يجب ألا يكون البريد الإلكتروني فارغًا!"})
    return false
  }
}
validateFriendEmail = (e) => {
  var email = e.target.value
  if (email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)) {
    if(e.target.name === "friend1") {
      this.setState({ friend1Err: "" })
      return true
    }
    if(e.target.name === "friend2") {
      this.setState({ friend2Err: "" })
      return true
    }
    if(e.target.name === "friend3") {
      this.setState({ friend3Err: "" })
      return true
    }
    if(e.target.name === "friend4") {
      this.setState({ friend4Err: "" })
      return true
    }
    if(e.target.name === "friend5") {
      this.setState({ friend5Err: "" })
      return true
    }
    
  } else {
    if(e.target.name === "friend1") {
      this.setState({ friend1Err: this.store_locale === 'en' ?  "Email is invalid!": "البريد الإلكتروني غير صالح!" })
      return false
    }
    if(e.target.name === "friend2") {
      this.setState({ friend2Err: this.store_locale === 'en' ?  "Email is invalid!": "البريد الإلكتروني غير صالح!"  })
      return false
    }
    if(e.target.name === "friend3") {
      this.setState({ friend3Err: this.store_locale === 'en' ?  "Email is invalid!": "البريد الإلكتروني غير صالح!"  })
      return false
    }
    if(e.target.name === "friend4") {
      this.setState({ friend4Err: this.store_locale === 'en' ?  "Email is invalid!": "البريد الإلكتروني غير صالح!"  })
      return false
    }
    if(e.target.name === "friend5") {
      this.setState({ friend5Err: this.store_locale === 'en' ?  "Email is invalid!": "البريد الإلكتروني غير صالح!"  })
      return false
    }
    
  }
}

checkValid = (email) => {
  const mailformat = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
  if (!email.match(mailformat)) {
    // $('#submitBtn').addClass('disableButton');
    return false
  } else {
    // $('#submitBtn').removeClass('disableButton');
    return true
  }
}

componentWillReceiveProps(nextProps) {
  if(nextProps.referfriend) {
    if(nextProps.referfriend.referfriend && !nextProps.referfriend.loading && !nextProps.referfriend.referfriendLoader) {
      if(nextProps.referfriend.referfriend.message) {
        this.setState({
					addMessagePopup: true,
					addMessage: nextProps.referfriend.referfriend.message
        })
        
        nextProps.referfriend.referfriend = {}
      }
    }
  }
}
closeAddBag = () => {
  this.setState({
      addMessagePopup: false
  })
}

	render() {

	
		const { store_locale, currentStore } =this.props.globals
    const { referfriend } = this.props
    if(langLoader) {
      return (langLoader);
    }
    if (referfriend.loading || referfriend.referfriendLoader) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
    }
    
    let alertBox = null;
		if (this.state.addMessagePopup) {
            alertBox = <AddBagAlert
                message={this.state.addMessage}
                alertBoxStatus={true}
                closeBox={this.closeAddBag} />
		}
		return (
			<div>
				<div className="Holding">
          {/* <div className="topBarHold">
            <div className="row">
              <div className="col-md-12">
              <div className="row">
              <div className="col-4 col-md-4">

              </div>
              <div className="col-4 col-md-4">
              <div className="text-center">
                        <Link to={`#`}>
                            <div className="mainLogo">
                              <img src={logo} alt="logo" />
                            </div>
                        </Link>
                  </div>
                </div>
                <div className="col-4 col-md-4 alignRight">
                {currentStore === 1 &&
                          <Link>
                          <span class="spacingLine" onClick={(e) => this.translate('en', 'ltr')}>
                            English
                          </span>
                          </Link>
                          }
                          {currentStore === 2 && 
                          <Link>
                          <span class="spacingLine" onClick={(e) => this.translate('ar', 'rtl')}>
                            العربية
                          </span>
                          </Link>
                          }
            
                </div>             
              
            </div>
              </div>
            </div>
          </div> */}
					<div className="topBanner">
                        <a href="#" className="web_div"> 
                        {currentStore === 1 &&
                          <img src={HomeBannerAr} alt="comingsoon"  />                                                 
                          }
                          {currentStore === 2 && 
                            <img src={HomeBannerEn} alt="comingsoon" />                           
                            
                          }                          
                                                 
                        </a>
                        <a href="#" className="mob_div"> 
                        {currentStore === 1 &&
                           <img src={HomeBannerMAr} alt="comingsoon"  /> 
                                                
                          }
                          {currentStore === 2 &&                           
                        <img src={HomeBannerMEn} alt="comingsoon"  />                           
                            
                          }                          
                                                 
                        </a>
                      
                    </div> 
									{alertBox}

                    <div className="secondSection">
                      <div className="container">
                      {/* <p className="mainHeading webHeading"><FormattedMessage id="ComingSoon.ComingSoonTitle" defaultMessage="Refer your friends and follow us on our social platforms for a chance to win amazing LEGO products" /></p> */}
                       <div className="row columnReverse">
                        <div className="col-md-12 col-lg-4">
                          <div className="row">
                          <div className="col-md-12">
                          {/* <p className="mainHeading mobHeading"><FormattedMessage id="ComingSoon.ComingSoonTitle" defaultMessage="Refer your friends and follow us on our social platforms for a chance to win amazing LEGO products" /></p> */}
                             <div className="emailInputs">                             
                                <form>
                                <div class="form-group">
                                <label for="mail" className="emailLabel"> <FormattedMessage id="ComingSoon.ComingSoon" defaultMessage="Your email address:" /></label>
                                <input 
                                  type="email" 
                                  value={this.state.email} 
                                  class="form-control" 
                                  id="mail" 
                                  name= "email"
                                  placeholder={store_locale==='en' ?  "Please enter email address." : "الرجاء إدخال عنوان البريد الإلكتروني." }
                                  onInput={this.keyupChangeHandler}
          												onChange={(e) => this.validateEmail(e)}
                                  />
          											{this.state.emailErr && <span className="error">{this.state.emailErr}</span>}

                                </div>
                                <div class="form-group">
                                <label for="mail1"><FormattedMessage id="ComingSoon.friend1" defaultMessage="Friend 1" /></label>
                                <input 
                                  type="email" 
                                  class="form-control" 
                                  id="mail1" 
                                  name="friend1"
                                  onInput={this.keyupChangeHandler}
          												onChange={(e) => this.validateFriendEmail(e)}
                                  value={this.state.friend1}
                                  placeholder={store_locale==='en' ?  "Please enter email address." : "الرجاء إدخال عنوان البريد الإلكتروني." }/>
                                {this.state.friend1Err && <span className="error">{this.state.friend1Err}</span>}

                                </div>
                                <div class="form-group">
                                <label for="mail2"><FormattedMessage id="ComingSoon.friend2" defaultMessage="Friend 2" /></label>
                                <input 
                                  type="email" 
                                  class="form-control" 
                                  id="mail2" 
                                  name="friend2"
                                  onInput={this.keyupChangeHandler}
          												onChange={(e) => this.validateFriendEmail(e)}
                                  value={this.state.friend2}
                                  placeholder={store_locale==='en' ?  "Please enter email address." : "الرجاء إدخال عنوان البريد الإلكتروني." }/>
                                {this.state.friend2Err && <span className="error">{this.state.friend2Err}</span>}

                                </div>
                                <div class="form-group">
                                <label for="mail3"><FormattedMessage id="ComingSoon.friend3" defaultMessage="Friend 3" /></label>
                                <input 
                                  type="email" 
                                  class="form-control" 
                                  id="mail3" 
                                  name="friend3"
                                  onInput={this.keyupChangeHandler}
          												onChange={(e) => this.validateFriendEmail(e)}
                                  value={this.state.friend3}
                                  placeholder={store_locale==='en' ?  "Please enter email address." : "الرجاء إدخال عنوان البريد الإلكتروني." }/>
                                {this.state.friend3Err && <span className="error">{this.state.friend3Err}</span>}

                                </div>
                                <div class="form-group">
                                <label for="mail4"><FormattedMessage id="ComingSoon.friend4" defaultMessage="Friend 4" /></label>
                                <input
                                  type="email" 
                                  class="form-control" 
                                  id="mail4" 
                                  name="friend4"
                                  onInput={this.keyupChangeHandler}
          												onChange={(e) => this.validateFriendEmail(e)}
                                  value={this.state.friend4}
                                  placeholder={store_locale==='en' ?  "Please enter email address." : "الرجاء إدخال عنوان البريد الإلكتروني." }/>
                                {this.state.friend4Err && <span className="error">{this.state.friend4Err}</span>}

                                </div>
                                <div class="form-group">
                                <label for="mail5"><FormattedMessage id="ComingSoon.friend5" defaultMessage="Friend 5" /></label>
                                <input 
                                  type="email" 
                                  class="form-control" 
                                  id="mail5" 
                                  name="friend5"
                                  onInput={this.keyupChangeHandler}
          												onChange={(e) => this.validateFriendEmail(e)}
                                  value={this.state.friend5}
                                  placeholder={store_locale==='en' ?  "Please enter email address." : "الرجاء إدخال عنوان البريد الإلكتروني." }/>
                                {this.state.friend5Err && <span className="error">{this.state.friend5Err}</span>}

                                </div>
                                {/*<div className="ThanksMessage">
                                 <p className="alert alert-success">Thank you for participating</p>
                               </div>*/}
                                <button className="buttonSubmit" /*disabled={this.state.isDisabled}*/ onClick={(e)=>{this.submitBtn(e)}}><FormattedMessage id="ComingSoon.submit" defaultMessage="Submit" /></button>
                                </form>
                             </div>
                            </div>  
                         
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-8">
                            <div className="rightImage">
                              {/* <a href="#">
                                <img src={hold2} alt="hold"/>
                            </a> */}
                                 <a href="#" className="web_div"> 
                        {currentStore === 1 &&
                          <img src={referbannerWar} alt="comingsoon"  />                                                 
                          }
                          {currentStore === 2 && 
                            <img src={referbannerWen} alt="comingsoon" />                         
                            
                          }                          
                                                 
                        </a>
                        <a href="#" className="mob_div"> 
                        {currentStore === 1 &&
                           <img src={referbannerMar} alt="comingsoon"  /> 
                                                
                          }
                          {currentStore === 2 &&                           
                        <img src={referbannerMen} alt="comingsoon"  />                          
                            
                          }                         
                                                 
                        </a>

                            </div>
                        </div>
                       </div>
                       </div>
                    </div>
                    <div className="socialDiv">
                    <div className="container">
                             <p><FormattedMessage id="ComingSoon.follow" defaultMessage="Follow Us" /></p>
                             <div className="followUs">
                                 <ul className="list-inline">
                                    <li className="list-inline-item"><a href="https://www.facebook.com/LEGO/"> <img src={fbLogo} alt="footerLogo" /> </a></li>
                                    <li className="list-inline-item"><a href="https://twitter.com/LEGO_Group"> <img src={TwContact} alt="footerLogo" /> </a></li>
                                    <li className="list-inline-item"><a href="https://www.instagram.com/lego/"> <img src={instaLogo} alt="footerLogo" /> </a></li>
                                    <li className="list-inline-item"><a href="https://www.youtube.com/user/LEGO?app=desktop"> <img src={YtContact} alt="footerLogo" /> </a></li>
                                 </ul>
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
		globals: state.global,
		referfriend: state.referfriend
	};
}
const mapDispatchToProps = dispatch => {
	return {
    onAddreferFriend: payload => dispatch(actions.referFriend(payload)),

	}
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LogoSlider);
