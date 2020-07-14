import React, { Component } from 'react';
import Slider from "react-slick";
import Collapsible from 'react-collapsible';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.css';
import applePay from "../../assets/images/Apple_Pay_logo.svg_.png"
import madacards from "../../assets/images/madacards.png"
import PlusIcon from '../../assets/images/icons/arrowDown.png';
import minusIcon from '../../assets/images/icons/arrowDown.png';
import paypalIcon from '../../assets/images/icons/paypal.png';
import backarrow from '../../assets/images/leftArrow1.png';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import * as actions from "../../redux/actions/index";
import { Link } from "react-router-dom"
import CodImage from "../../assets/images/CardDel.png";

let notEdited = true;
class OrderSummary extends Component {
   constructor(props) {
   super(props);
      this.state = {
         voucode: ''
      }
   }
   closeOther = (value) => {
      let collapses = document.getElementsByClassName('open');
      for (let i = 0 ; i < collapses.length ; i++) {
         collapses[i].click();
      }
   }

   openVoucherSection = () => {
      setTimeout(() => {
         let collapses = document.getElementsByClassName('is-closed');
         for (let i = 0 ; i < collapses.length ; i++) {
            collapses[i].click();
         }
      }, 200)
   }

   // applyVoucode = (voucode) => {
   //    if (voucode == '') {
   //       return;
   //    }

   //    notEdited = true;
   //    this.props.onApplyVoucode({
   //       store: this.props.globals.currentStore,
   //       voucode: voucode,
   //       quoteid: this.props.myCart.quote_id,
   //    });
   // }

   // removeVoucode = (voucode) => {
   //    if (voucode == '') {
   //       return;
   //    }

   //    notEdited = false;
   //    this.props.onRemoveVoucode({
   //       store: this.props.globals.currentStore,
   //       voucode: voucode,
   //       quoteid: this.props.myCart.quote_id,
   //    });

   //    this.setVoucher('');
   // }

   // setVoucher = (voucode) => {
   //    this.setState({
   //       voucode
   //    })
   // }

   checkout = () => {
      this.props.checkout();
      // this.props.history.push(`/${this.props.globals.store_locale}/login`);
   }

   render() {
      const { myCart, globals } = this.props;
      // if (myCart.voucher && this.state.voucode === '' && notEdited) {
      //    this.setVoucher(myCart.voucher);
      //    this.openVoucherSection(0);
      // }

      return (
      <div>
         <div className="ordersummary-right">  
            <div className="sidebar-space">
               <div className="OrderSummaryTitle">
               <FormattedMessage id='cart.OrderSummary' defaultMessage="Order Summary" />
               </div>
               <div className="order-collapus">
               {/* <Collapsible trigger={
               <div onClick={() =>
                  this.closeOther(0)} className="Collapsible_text_container">
                  <div className="Collapsible_text footerHeading">
                  <FormattedMessage id='cart.EnterPromoCode' defaultMessage="Enter Promo Code" />
                  </div>
                  <div className="Collapsible_arrow_container">
                     <img className="Icon" src={PlusIcon} alt=""/>
                  </div>
               </div>
               } 
               triggerWhenOpen={
               <div className="Collapsible_text_container open">
                  <div className="Collapsible_text footerHeading">
                  <FormattedMessage id='cart.EnterPromoCode' defaultMessage="Enter Promo Code" />
                  </div>
                  <div className="Collapsible_arrow_container">
                     <img src={minusIcon} alt="" className="Icon" />
                  </div>
               </div>
               }>
               <div>
               <div className="pramocode">
                     <div className="inputBox">
                     <div className="InputText">
                        <div className="InputWrapper">
                           <label type="text" className="MuiGD">
                           <input type="text" className="eJMfcj"
                           onChange={(e) => {
                              notEdited = false;
                               this.setState({ voucode: e.target.value }) }}
                           value={this.state.voucode}/>
                           <span type="text" className="gtvwUj">
                           <FormattedMessage id='cart.EnterCode' defaultMessage="Enter Code" />
                           </span></label>
                        </div>
                     </div>
                     {myCart.discount_amount === 0 && <button kind="secondary" type="submit" className="iJHjNV gcJclK" 
                     onClick={() => this.applyVoucode(this.state.voucode)}>Apply</button>}
                     {myCart.discount_amount !== 0 && <button kind="secondary" type="submit" className="iJHjNV gcJclK" 
                     onClick={() => this.removeVoucode(this.state.voucode)}>Remove</button>}
                  </div>
                  {myCart.voucherSuccess && <div style={{color: 'green'}}>{myCart.voucherSuccess}</div>}
                  {myCart.voucherError && <div style={{color: 'red'}}>{myCart.voucherError}</div>}
               </div>
            </div>
            </Collapsible> */}
            <div className="paymentOption-grid">
                  <div className="MediaQuery__MediaHideable-sc-1poqfy2-0 bMBjWv">
                     <div height="auto" className="order-total-grid">
                        {/* <span className="zip-title">
                        <FormattedMessage id='cart.enterZip' defaultMessage="Enter a ZIP code to estimate tax and delivery" />
                        </span>
                        <div className="pramocode">
                           <div className="inputBox">
                              <div className="InputText">
                                 <div className="InputWrapper">
                                    <label type="text" className="MuiGD">
                                    <input type="text" className="eJMfcj" value=""/><span type="text" className="gtvwUj">Example: 96321</span></label>
                                 </div>
                              </div>
                              <button kind="secondary" type="submit" className="iJHjNV gcJclK">Apply</button>
                           </div>
                        </div>  */}
                        {myCart.discount_amount !== 0 && <div className="iTkIJL">
                           <span className="dlAVSN">
                           <FormattedMessage id='cart.Subtotal' defaultMessage="Subtotal" />
                           ({myCart.cart_count}) <FormattedMessage id='cart.items' defaultMessage="items" /></span>
                           <span className="dlAVSN">
                              <span className="bTYWAd">{`${myCart.currency} ${myCart.subtotal_with_discount}`}</span>
                           </span>
                        </div>}
                        {/* <div className="iTkIJL">
                           <span className="dlAVSN">Express</span>
                           <span data-test="shipping-total-price" className="dlAVSN">
                              <span className="bTYWAd">$32.95</span>
                           </span>
                        </div> */}
                        {/* <div className="iTkIJL">
                           <span className="dlAVSN">TAX</span>
                           <span data-test="shipping-total-price" className="dlAVSN">
                              <span className="bTYWAd">$2.95</span>
                           </span>
                        </div> */}
                        <div className="djiTzW"></div>
                        <div className="jPJTFO">
                           <span className="iSNubF"><FormattedMessage id='cart.orderTotal' defaultMessage="Order total" /></span>
                           <span className="iSNubF">
                           <span className="bTYWAd">{`${myCart.currency} ${myCart.grand_total}`}</span>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="brTnyU d-none d-sm-block">
               <div className="addBag">
                  <button className="addBagbtn mb-3" onClick={() => this.checkout()}>
                  <svg width="16px" height="20px" className="OrderSummarystyles__StyledIconLock-sc-1c05ehf-4 hwQmQm" viewBox="0 0 16 20" data-di-res-id="f1643e64-c82e40c7" data-di-rand="1587611164297">
                  <path d="M14 7h-1V5c0-2.8-2.2-5-5-5S3 2.2 3 5v2H2C.9 7 0 7.9 0 9v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6.929 7.732A1.996 1.996 0 0 1 6.061 13c0-1.105.905-2 2.02-2a2.01 2.01 0 0 1 2.021 2c0 .74-.406 1.387-1.01 1.732V17h-2.02v-2.268zM11.1 7H4.9V5c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" fill="currentColor" fill-rule="evenodd">
                  </path></svg> <FormattedMessage id='cart.CheckoutSecurely' defaultMessage="Checkout Securely" /></button>
                  {/* <button className="paypal mb-4">Pay with <img src={paypalIcon} alt="" className="payIcon" /></button> */}
                  
               </div>
               </div>
               {/* <div className="full-width-div">
                  {myCart.shipping_amount === 0 && <div className="sucess-message"><FormattedMessage id='cart.freeShipping' defaultMessage="Congragulations - you get FREE shipping" /></div>}
                  {myCart.shipping_amount > 0 && <div className="jPJTFO">
                     <span className="iSNubF">
                     <FormattedMessage id="shipping.Standardshipping" defaultMessage="Standard shipping" /></span>
                     <span className="iSNubF">
                     <span className="bTYWAd">{` ${myCart.currency} ${myCart.shipping_amount}`}</span>
                     </span>
                  </div>}
               </div> */}
               <div className="cardList">
                  <div className="iYKNAh"><FormattedMessage id='cart.Paymentmethods' defaultMessage="Payment methods" />
                     <div className="PaymentMethodsstyles__IconWrap-jtzizl-1">
                        <ul className="cardlistimg">
                        <span><img src={madacards} className="MadaCard" alt="apple" /></span>
                           <span><img src={CodImage} className="CodCard" alt="apple" /></span>
                           <svg width="63px" height="60px" className="Footerstyles__StyledIcon-sc-1eplnel-6 jauHmx master" viewBox="0 0 48 30" data-di-res-id="e0b91613-f924f21f" data-di-rand="1588938960139">
                              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g transform="translate(-1183.000000, -950.000000)" fill-rule="nonzero">
                                       <g transform="translate(1183.000000, 950.000000)">
                                          <g>
                                                <path
                                                   d="M46.2182857,29.9396226 L1.61980952,29.9396226 C0.728952381,29.9396226 0,29.2175472 0,28.3350943 L0,1.6045283 C0,0.722075472 0.728952381,0 1.61980952,0 L46.2182857,0 C47.1091429,0 47.8380952,0.722075472 47.8380952,1.6045283 L47.8380952,28.3350943 C47.8380952,29.2175472 47.1091429,29.9396226 46.2182857,29.9396226 Z"
                                                   fill="#010101"
                                                ></path>
                                                <g transform="translate(7.428571, 2.075472)">
                                                   <path
                                                      d="M5.99790476,25.3679245 L5.99790476,23.6750943 C5.99790476,23.0396226 5.61180952,22.6177358 4.95314286,22.6120755 C4.60685714,22.6064151 4.24914286,22.7132075 3.9992381,23.0901887 C3.81180952,22.7920755 3.51657143,22.6120755 3.10209524,22.6120755 C2.81257143,22.6120755 2.50590476,22.6907547 2.28457143,23.0058491 L2.28457143,22.6796226 L1.73942857,22.6796226 L1.73942857,25.3679245 L2.29028571,25.3679245 L2.29028571,23.8267925 C2.29028571,23.36 2.57409524,23.1124528 2.97733333,23.1124528 C3.36914286,23.1124528 3.59047619,23.3654717 3.59047619,23.8211321 L3.59047619,25.3677358 L4.14133333,25.3677358 L4.14133333,23.8266038 C4.14133333,23.3598113 4.43657143,23.1122642 4.82838095,23.1122642 C5.23142857,23.1122642 5.4472381,23.365283 5.4472381,23.8209434 L5.4472381,25.3675472 L5.99790476,25.3675472 L5.99790476,25.3679245 Z M14.8438095,22.679434 L13.8558095,22.679434 L13.8558095,21.8639623 L13.3051429,21.8639623 L13.3051429,22.679434 L12.731619,22.679434 L12.731619,23.1686792 L13.3051429,23.1686792 L13.3051429,24.4398113 C13.3051429,25.0641509 13.5266667,25.435283 14.2249524,25.435283 C14.480381,25.435283 14.7758095,25.3566038 14.9630476,25.2271698 L14.7925714,24.7490566 C14.6165714,24.8503774 14.423619,24.9009434 14.2702857,24.9009434 C13.9750476,24.9009434 13.8558095,24.7209434 13.8558095,24.4509434 L13.8558095,23.1686792 L14.8438095,23.1686792 L14.8438095,22.679434 Z M19.88,22.6120755 C19.5394286,22.6120755 19.2952381,22.7696226 19.1419048,23.0058491 L19.1419048,22.6796226 L18.6024762,22.6796226 L18.6024762,25.3679245 L19.147619,25.3679245 L19.147619,23.8550943 C19.147619,23.4107547 19.3634286,23.1239623 19.7495238,23.1239623 C19.8687619,23.1239623 19.9937143,23.1407547 20.1186667,23.1915094 L20.300381,22.685283 C20.1695238,22.6345283 19.9992381,22.6120755 19.88,22.6120755 L19.88,22.6120755 Z M12.2660952,22.8932075 C11.9822857,22.7075472 11.5904762,22.6120755 11.1588571,22.6120755 C10.4718095,22.6120755 10.051619,22.9326415 10.051619,23.4669811 C10.051619,23.9056604 10.3582857,24.17 10.9657143,24.2543396 L11.244,24.2937736 C11.567619,24.3386792 11.743619,24.4513208 11.743619,24.6030189 C11.743619,24.8111321 11.5051429,24.9460377 11.1020952,24.9460377 C10.676381,24.9460377 10.3980952,24.8166038 10.1994286,24.6649057 L9.92114286,25.0867925 C10.3241905,25.3792453 10.8068571,25.4354717 11.096381,25.4354717 C11.8798095,25.4354717 12.3114286,25.0754717 12.3114286,24.5637736 C12.3114286,24.0913208 11.9820952,23.849434 11.3859048,23.7650943 L11.107619,23.7256604 C10.8521905,23.6918868 10.6249524,23.6132075 10.6249524,23.4332075 C10.6249524,23.2364151 10.8407619,23.1013208 11.164381,23.1013208 C11.5106667,23.1013208 11.8457143,23.2307547 12.0102857,23.3318868 L12.2660952,22.8932075 Z M20.4988571,24.0237736 C20.4988571,24.8392453 21.0495238,25.4354717 21.924,25.4354717 C22.3327619,25.4354717 22.6053333,25.3454717 22.9005714,25.1149057 L22.6167619,24.6930189 C22.3952381,24.850566 22.1624762,24.9349057 21.9070476,24.9349057 C21.4358095,24.9292453 21.0666667,24.5637736 21.0666667,24.0237736 C21.0666667,23.4837736 21.4358095,23.1183019 21.9070476,23.1126415 C22.1626667,23.1126415 22.3954286,23.1969811 22.6167619,23.3545283 L22.9005714,22.9326415 C22.6053333,22.7020755 22.3327619,22.6120755 21.924,22.6120755 C21.0497143,22.6120755 20.4988571,23.2081132 20.4988571,24.0237736 L20.4988571,24.0237736 Z M16.6834286,22.6120755 C15.8885714,22.6120755 15.3434286,23.1801887 15.3434286,24.0181132 C15.3434286,24.8730189 15.9112381,25.4354717 16.7232381,25.4354717 C17.132,25.4354717 17.5066667,25.3341509 17.836,25.0586792 L17.5464762,24.659434 C17.3194286,24.839434 17.0299048,24.940566 16.7573333,24.940566 C16.3769524,24.940566 15.9908571,24.7267925 15.9226667,24.2432075 L17.9497143,24.2432075 C17.9554286,24.1701887 17.9611429,24.0969811 17.9611429,24.0183019 C17.9552381,23.18 17.4441905,22.6120755 16.6834286,22.6120755 L16.6834286,22.6120755 Z M16.672,23.1126415 C17.0750476,23.1126415 17.347619,23.3713208 17.3874286,23.7932075 L15.9224762,23.7932075 C15.9737143,23.399434 16.2348571,23.1126415 16.672,23.1126415 L16.672,23.1126415 Z M9.32495238,24.0237736 L9.32495238,22.6796226 L8.77980952,22.6796226 L8.77980952,23.0058491 C8.59238095,22.7639623 8.28590476,22.6120755 7.89980952,22.6120755 C7.13904762,22.6120755 6.55980952,23.2026415 6.55980952,24.0237736 C6.55980952,24.8449057 7.13904762,25.4354717 7.89980952,25.4354717 C8.28590476,25.4354717 8.59238095,25.2835849 8.77980952,25.0418868 L8.77980952,25.3681132 L9.32495238,25.3681132 L9.32495238,24.0237736 Z M7.12761905,24.0237736 C7.12761905,23.5175472 7.4512381,23.1126415 7.97352381,23.1126415 C8.47314286,23.1126415 8.80247619,23.5007547 8.80247619,24.0237736 C8.80247619,24.5467925 8.47314286,24.9349057 7.97352381,24.9349057 C7.45142857,24.934717 7.12761905,24.5298113 7.12761905,24.0237736 L7.12761905,24.0237736 Z M28.0788571,22.6120755 C27.7382857,22.6120755 27.4940952,22.7696226 27.3407619,23.0058491 L27.3407619,22.6796226 L26.8013333,22.6796226 L26.8013333,25.3679245 L27.3464762,25.3679245 L27.3464762,23.8550943 C27.3464762,23.4107547 27.5622857,23.1239623 27.948381,23.1239623 C28.067619,23.1239623 28.1925714,23.1407547 28.3175238,23.1915094 L28.4992381,22.685283 C28.368381,22.6345283 28.1979048,22.6120755 28.0788571,22.6120755 L28.0788571,22.6120755 Z M32.452,24.9779245 C32.4899048,24.9779245 32.5253333,24.9849057 32.5586667,24.9988679 C32.5918095,25.0128302 32.6209524,25.0318868 32.6459048,25.0560377 C32.6706667,25.0801887 32.6902857,25.1084906 32.7045714,25.1411321 C32.7188571,25.1735849 32.7260952,25.2081132 32.7260952,25.244717 C32.7260952,25.2813208 32.7188571,25.3158491 32.7045714,25.3481132 C32.6902857,25.3803774 32.6706667,25.4086792 32.6459048,25.4328302 C32.6209524,25.4569811 32.592,25.4762264 32.5586667,25.4903774 C32.5253333,25.5045283 32.4899048,25.5116981 32.452,25.5116981 C32.4133333,25.5116981 32.3771429,25.5045283 32.3434286,25.4903774 C32.3097143,25.4762264 32.2805714,25.4569811 32.256,25.4328302 C32.2312381,25.4086792 32.2118095,25.3803774 32.1975238,25.3481132 C32.1832381,25.3158491 32.1761905,25.2813208 32.1761905,25.244717 C32.1761905,25.2081132 32.1832381,25.1735849 32.1975238,25.1411321 C32.2118095,25.1086792 32.2312381,25.0803774 32.256,25.0560377 C32.2805714,25.0316981 32.3097143,25.0126415 32.3434286,24.9988679 C32.3771429,24.9849057 32.4133333,24.9779245 32.452,24.9779245 Z M32.452,25.4528302 C32.4811429,25.4528302 32.5081905,25.4473585 32.5333333,25.4364151 C32.5584762,25.4254717 32.580381,25.410566 32.5992381,25.3918868 C32.6182857,25.3732075 32.6329524,25.3511321 32.6438095,25.3258491 C32.6546667,25.300566 32.66,25.2735849 32.66,25.244717 C32.66,25.2158491 32.6546667,25.1888679 32.6438095,25.1635849 C32.6329524,25.1383019 32.6182857,25.1162264 32.5992381,25.0975472 C32.580381,25.0786792 32.5582857,25.0641509 32.5333333,25.0533962 C32.5081905,25.0426415 32.4811429,25.0373585 32.452,25.0373585 C32.4224762,25.0373585 32.3948571,25.0426415 32.3691429,25.0533962 C32.3434286,25.0641509 32.3209524,25.0786792 32.3020952,25.0975472 C32.2832381,25.1162264 32.2681905,25.1383019 32.2575238,25.1635849 C32.2466667,25.1888679 32.2413333,25.2158491 32.2413333,25.244717 C32.2413333,25.2735849 32.2466667,25.300566 32.2575238,25.3258491 C32.2681905,25.3511321 32.2832381,25.3732075 32.3020952,25.3918868 C32.3209524,25.410566 32.3434286,25.4254717 32.3691429,25.4364151 C32.3948571,25.4473585 32.4224762,25.4528302 32.452,25.4528302 Z M32.4678095,25.12 C32.5,25.12 32.5247619,25.1269811 32.5420952,25.1413208 C32.5594286,25.1554717 32.5681905,25.174717 32.5681905,25.1992453 C32.5681905,25.2198113 32.5613333,25.2366038 32.5474286,25.25 C32.5335238,25.2632075 32.5139048,25.2715094 32.488381,25.2745283 L32.5702857,25.3681132 L32.5062857,25.3681132 L32.4302857,25.275283 L32.4059048,25.275283 L32.4059048,25.3681132 L32.352381,25.3681132 L32.352381,25.1201887 L32.4678095,25.1201887 L32.4678095,25.12 Z M32.4057143,25.1664151 L32.4057143,25.2324528 L32.4670476,25.2324528 C32.4811429,25.2324528 32.492381,25.2298113 32.5007619,25.2243396 C32.5091429,25.2188679 32.5133333,25.210566 32.5133333,25.1992453 C32.5133333,25.1883019 32.5091429,25.1801887 32.5007619,25.174717 C32.492381,25.1692453 32.4811429,25.1666038 32.4670476,25.1666038 L32.4057143,25.1666038 L32.4057143,25.1664151 Z M25.9893333,24.0237736 L25.9893333,22.6796226 L25.4441905,22.6796226 L25.4441905,23.0058491 C25.2567619,22.7639623 24.9502857,22.6120755 24.5641905,22.6120755 C23.8034286,22.6120755 23.2241905,23.2026415 23.2241905,24.0237736 C23.2241905,24.8449057 23.8032381,25.4354717 24.5641905,25.4354717 C24.9502857,25.4354717 25.2569524,25.2835849 25.4441905,25.0418868 L25.4441905,25.3681132 L25.9893333,25.3681132 L25.9893333,24.0237736 Z M23.792,24.0237736 C23.792,23.5175472 24.115619,23.1126415 24.6379048,23.1126415 C25.1375238,23.1126415 25.4668571,23.5007547 25.4668571,24.0237736 C25.4668571,24.5467925 25.1375238,24.9349057 24.6379048,24.9349057 C24.115619,24.934717 23.792,24.5298113 23.792,24.0237736 L23.792,24.0237736 Z M31.468381,24.0237736 L31.468381,21.5998113 L30.9232381,21.5998113 L30.9232381,23.0058491 C30.7358095,22.7639623 30.4293333,22.6120755 30.0430476,22.6120755 C29.2822857,22.6120755 28.7030476,23.2026415 28.7030476,24.0237736 C28.7030476,24.8449057 29.2822857,25.4354717 30.0430476,25.4354717 C30.4291429,25.4354717 30.7358095,25.2835849 30.9232381,25.0418868 L30.9232381,25.3681132 L31.468381,25.3681132 L31.468381,24.0237736 Z M29.2710476,24.0237736 C29.2710476,23.5175472 29.5946667,23.1126415 30.1171429,23.1126415 C30.6167619,23.1126415 30.9460952,23.5007547 30.9460952,24.0237736 C30.9460952,24.5467925 30.6167619,24.9349057 30.1171429,24.9349057 C29.5946667,24.934717 29.2710476,24.5298113 29.2710476,24.0237736 Z"
                                                      fill="#FFFFFF"
                                                   ></path>
                                                   <g>
                                                      <rect fill="#F16122" x="11.632" y="2.22132075" width="9.82647619" height="15.8992453"></rect>
                                                      <path
                                                            d="M12.6464762,10.1709434 C12.6464762,6.9454717 14.1710476,4.07283019 16.5453333,2.22132075 C14.8089524,0.867358491 12.6180952,0.0594339623 10.2369524,0.0594339623 C4.59980952,0.0594339623 0.0299047619,4.58660377 0.0299047619,10.1709434 C0.0299047619,15.755283 4.59980952,20.2824528 10.2369524,20.2824528 C12.6180952,20.2824528 14.8089524,19.474717 16.5453333,18.120566 C14.1710476,16.2692453 12.6464762,13.3966038 12.6464762,10.1709434 Z"
                                                            fill="#E91D25"
                                                      ></path>
                                                      <path
                                                            d="M32.1202215,17.0436704 L32.1202215,16.2152225 L32.2743743,16.2152225 L32.2743743,16.0460731 L31.8819048,16.0460731 L31.8819048,16.2152225 L32.0360576,16.2152225 L32.0360576,17.0441509 L32.1202215,17.0441509 L32.1202215,17.0436704 Z M32.8819048,17.0436704 L32.8819048,16.0441509 L32.761639,16.0441509 L32.6232115,16.7313206 L32.4847841,16.0441509 L32.3645183,16.0441509 L32.3645183,17.0436704 L32.4495681,17.0436704 L32.4495681,16.289706 L32.5793577,16.9398742 L32.6672868,16.9398742 L32.7970764,16.2882644 L32.7970764,17.0436704 L32.8819048,17.0436704 Z"
                                                            fill="#F79E1D"
                                                      ></path>
                                                      <path
                                                            d="M33.0605714,10.1709434 C33.0605714,15.755283 28.4906667,20.2824528 22.8535238,20.2824528 C20.472381,20.2824528 18.2815238,19.474717 16.5451429,18.120566 C18.9194286,16.2690566 20.4438095,13.3964151 20.4438095,10.1709434 C20.4438095,6.9454717 18.9192381,4.07283019 16.5451429,2.22132075 C18.2815238,0.867358491 20.4721905,0.0594339623 22.8535238,0.0594339623 C28.4908571,0.0594339623 33.0605714,4.58660377 33.0605714,10.1709434 Z"
                                                            fill="#F79E1D"
                                                      ></path>
                                                   </g>
                                                </g>
                                          </g>
                                       </g>
                                    </g>
                              </g>
                           </svg>
                           <svg width="63px" height="60px" className="Footerstyles__StyledIcon-sc-1eplnel-6 jauHmx" viewBox="0 0 48 30" data-di-res-id="acbdee86-cf30fe49" data-di-rand="1588938960140">
                              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g transform="translate(-1095.000000, -950.000000)" fill-rule="nonzero">
                                       <g transform="translate(1095.000000, 950.000000)">
                                          <g>
                                                <rect fill="#0E4595" x="0" y="0" width="48" height="30" rx="2.56"></rect>
                                                <polygon fill="#FFFFFF" points="17.804608 21.2884076 19.939648 8.81942675 23.354688 8.81942675 21.218176 21.2884076 17.804608 21.2884076"></polygon>
                                                <path
                                                   d="M33.555712,9.08840764 C32.879104,8.83579618 31.818944,8.56471338 30.49504,8.56471338 C27.12064,8.56471338 24.74368,10.2557962 24.72352,12.6795541 C24.704448,14.4712739 26.420352,15.4706369 27.715712,16.0671338 C29.044992,16.6782166 29.49184,17.0680255 29.485568,17.6138217 C29.47712,18.4494904 28.424,18.8314013 27.442496,18.8314013 C26.075584,18.8314013 25.34944,18.6424841 24.227904,18.176879 L23.787904,17.9787898 L23.308544,20.7700637 C24.10624,21.1181529 25.581184,21.4197452 27.112576,21.4353503 C30.702336,21.4353503 33.032576,19.7635032 33.0592,17.1752866 C33.072128,15.7569427 32.162304,14.6774522 30.192128,13.7875159 C28.998464,13.2107643 28.267392,12.8257325 28.2752,12.2417834 C28.2752,11.7235032 28.893888,11.169172 30.230784,11.169172 C31.347584,11.1519745 32.156544,11.3943949 32.786752,11.646879 L33.092672,11.790828 L33.555712,9.08828025"
                                                   fill="#FFFFFF"
                                                ></path>
                                                <path
                                                   d="M42.34336,8.81942675 L39.70464,8.81942675 C38.887104,8.81942675 38.275392,9.04152866 37.916352,9.85343949 L32.844672,21.2803822 L36.430592,21.2803822 C36.430592,21.2803822 37.017024,19.7438854 37.149632,19.4066242 C37.541504,19.4066242 41.025024,19.4119745 41.523136,19.4119745 C41.625216,19.8484076 41.938496,21.2803185 41.938496,21.2803185 L45.107328,21.2803822 L42.343296,8.81929936 L42.34336,8.81942675 Z M38.156608,16.870828 C38.43904,16.1523567 39.517248,13.3852866 39.517248,13.3852866 C39.497024,13.4184076 39.797568,12.6633121 39.970048,12.1951592 L40.200832,13.2703185 C40.200832,13.2703185 40.85472,16.2465605 40.99136,16.8707643 L38.156608,16.8707643 L38.156608,16.870828 Z"
                                                   fill="#FFFFFF"
                                                ></path>
                                                <path
                                                   d="M14.905792,8.81942675 L11.562432,17.3223567 L11.206144,15.5944586 C10.583744,13.6024841 8.644544,11.4443949 6.476672,10.3638854 L9.533696,21.2685987 L13.14688,21.2644586 L18.523136,8.81955414 L14.905856,8.81955414"
                                                   fill="#FFFFFF"
                                                ></path>
                                                <path
                                                   d="M8.44288,8.81942675 L2.93632,8.81942675 L2.892608,9.0788535 C7.176768,10.1109554 10.011456,12.6051592 11.18816,15.6020382 L9.990848,9.87210191 C9.784128,9.08261146 9.184448,8.84700637 8.442816,8.81949045"
                                                   fill="#F2AE14"
                                                ></path>
                                          </g>
                                       </g>
                                    </g>
                              </g>
                           </svg>
                           
                           {/* <span><img src={applePay} className="applePay" alt="apple" /></span> */}
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
            <div className="mobile-continue d-block d-sm-none">
            <Link to={`/${this.props.globals.store_locale}/`}>
               <img src={backarrow} className="backOption" alt="minIcon" /><span className=""><FormattedMessage id='cart.ContinueShopping' defaultMessage="Continue Shopping" /></span>
            </Link>
            </div>
            </div>
            
            <div className="footer-fix-paypal d-block d-sm-none">    
                  <div className="">            
                     <div className="">
                           <div>
                              <div className="">
                                 <div className="smart-menu">
                                       <div className="mobile-total-grid">
                                          <span className="mob-btn-order"><FormattedMessage id='cart.Ordertotal' defaultMessage="Order total" /></span>
                                          <span className="iSNubF">
                                          <span className="bTYWAd">{`${myCart.currency} ${myCart.grand_total}`}</span>
                                          </span>
                                       </div>
                                 </div>
                              </div>
                           </div>
                     </div>
                  </div>
                  <div className="brTnyU">
               <div className="addBag btn-toolbar">
                  <button className="addBagbtn btn-group" onClick={() => this.checkout()}>
                  <svg width="16px" height="20px" className="OrderSummarystyles__StyledIconLock-sc-1c05ehf-4 hwQmQm" viewBox="0 0 16 20" data-di-res-id="f1643e64-c82e40c7" data-di-rand="1587611164297"><path d="M14 7h-1V5c0-2.8-2.2-5-5-5S3 2.2 3 5v2H2C.9 7 0 7.9 0 9v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6.929 7.732A1.996 1.996 0 0 1 6.061 13c0-1.105.905-2 2.02-2a2.01 2.01 0 0 1 2.021 2c0 .74-.406 1.387-1.01 1.732V17h-2.02v-2.268zM11.1 7H4.9V5c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" fill="currentColor" fill-rule="evenodd">
                  </path></svg> <FormattedMessage id='cart.Checkout' defaultMessage="Checkout" /></button>
                  {/* <button className="paypal btn-group"><img src={paypalIcon} alt="" className="payIcon" /></button> */}
                  
               </div>
               </div>
               </div>
         </div>
      </div>
      )
   }
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		user_details: state.login,
		myCart: state.myCart
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
      onApplyVoucode: (payload) => dispatch(actions.applyVoucode(payload)),
      onRemoveVoucode: (payload) => dispatch(actions.removeVoucode(payload))
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(OrderSummary)));
