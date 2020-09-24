import React, { Suspense, Component } from 'react';
import Breadcrumb from '../../common/breadcrumb';
// import LogoSlider from '../../components/HomeComponent/logoSlider';
import topImg from '../../assets/images/icons/needHelpOne.png';
// import Needhelp  from '../Myaccount/NeedHelp';
import logocheck from '../../assets/images/icons/LEGO.gif';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Spinner2 from "../Spinner/Spinner";
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
const Needhelp = React.lazy(() => import('../Myaccount/NeedHelp'));

class OrderDetails extends Component {
constructor(props) {
super(props);
}
render() {
   const store_locale=this.props.globals.store_locale
return (
<div>
<Suspense fallback={<div></div>}>
   <div className="OrderDetails">
      {/* <LogoSlider /> */}
      <div className="container">
         <div className="row borderottom">
            <div className="col-md-9 col-9">
               <Breadcrumb />
               <p className="orderhistroyTitle"> Order Status
               </p>
            </div>
            <div className="col-md-3 col-3 p-0">
               <div className="topImage">
                  <img src={topImg} />
               </div>
            </div>
         </div>
         <div className="row">
            <div className="col-md-8">
               {/* 
               <p className="orderSubtitle"> Order History
               </p>
               */}
               <p className="backorder">Back to all Orders 
               </p>
               <div className="orderInfo">
                  <div className="OrderDetailsDiv">
                     <div className="row">
                        <div className="col-md-6">
                           <div className="logoDiv">
                              <ul className="list-inline">
                                 <li className="list-inline-item">  
                                    <img src={logocheck} alt="logo" />
                                 </li>
                                 <li className="list-inline-item">
                                    <p className="detailsTitle">Order Details</p>
                                 </li>
                              </ul>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="OrderDateNumber">
                              <ul className="list-inline">
                                 <li className="list-inline-item">
                                    <p className="mainTitle">Order Date</p>
                                    <p className="dataTitle">18 March 2020</p>
                                 </li>
                                 <li className="list-inline-item">
                                    <p className="mainTitle">Order Number</p>
                                    <p className="dataTitle">T25487</p>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="orderStatus">
                     <div className="row">
                        <div className="col-md-6">
                           <div className="statusShiped">
                              <ul className="list-inline">
                                 <li className="list-inline-item">
                                    <p className="mainTitle">Status</p>
                                    <p className="dataTitle">Shipped</p>
                                 </li>
                              </ul>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="tracking">
                              <ul className="list-inline">
                                 <li className="list-inline-item">
                                    <p className="mainTitle">Tracking</p>
                                    <p className="dataTitle">182020254</p>
                                 </li>
                                 <li className="list-inline-item">   
                                 <Link to={`/${store_locale}/order-tracking`}>  <button className="trackPkg">Track Package</button></Link>
                                   
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="blankSpace">
                  </div>
               </div>
               <div className="oderSummaryTitle">
                  <p>Order Summary</p>
               </div>

               <table className="table table-striped SummaryTable">
                  <thead>
                     <tr>
                        <th>Item</th>
                        <th>Name</th>
                        <th>Ship Date</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td>25487</td>
                        <td className="orderNum">Bookshope</td>
                        <td>2020-03-20</td>
                        <td>Shipped</td>
                        <td>24.99</td>
                        <td>2</td>
                        <td>12.50</td>
                     </tr>
                     <tr>
                        <td>25487</td>
                        <td className="orderNum">Bookshope</td>
                        <td>2020-03-20</td>
                        <td>Shipped</td>
                        <td>24.99</td>
                        <td>2</td>
                        <td>12.50</td>
                     </tr>
                     <tr>
                        <td>25487</td>
                        <td className="orderNum">Bookshope</td>
                        <td>2020-03-20</td>
                        <td>Shipped</td>
                        <td>24.99</td>
                        <td>2</td>
                        <td>12.50</td>
                     </tr>
                     <tr>
                        <td>25487</td>
                        <td className="orderNum">Bookshope</td>
                        <td>2020-03-20</td>
                        <td>Shipped</td>
                        <td>24.99</td>
                        <td>2</td>
                        <td>12.50</td>
                     </tr>
                     <tr>
                        <td>25487</td>
                        <td className="orderNum">Bookshope</td>
                        <td>2020-03-20</td>
                        <td>Shipped</td>
                        <td>24.99</td>
                        <td>2</td>
                        <td>12.50</td>
                     </tr>
                     <tr className="OrderTotal">
                        <td colspan="3"></td>
                        <td>
                           <p className="SubTotal">
                              Subtotal
                           </p>
                           <p className="SubTotal">
                              Discount
                           </p>
                           <p className="SubTotal">
                              Shipping
                           </p>
                           <p className="orderTotal">
                              Order Total
                           </p>
                           <p className="vatTotal">
                              inclusive of <span>24 VAT</span>
                           </p>
                        </td>
                        <td colspan="2"></td>
                        <td className="dataRight">
                           <p className="SubTotal">
                              <span>GBP</span><span> 21.35</span>
                           </p>
                           <p className="SubTotal reCol">
                              <span>GBP</span><span> 21.35</span>
                           </p>
                           <p className="SubTotal">
                              <span>GBP</span><span> 21.35</span>
                           </p>
                           <p className="orderTotal">
                              <span>GBP</span><span> 21.35</span>
                           </p>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <div className="summaryMobile">
                   <div className="even cardBox">
                     <div className="row">
                       <div className="col-6 alignLeft">
                         <div className="DataTabs">
                         <p className="LabelHead">
                              Item
                           </p>
                           <p className="LabelData">
                             2154
                          </p>
                          </div>
                          <div className="DataTabs">
                         <p className="LabelHead">
                         Name
                           </p>
                           <p className="LabelData">
                           Back shope
                          </p>
                          </div>
                          <div className="DataTabs">
                         <p className="LabelHead">
                         Ship Date
                           </p>
                           <p className="LabelData">
                           2020-03-20
                          </p>
                          </div>
                          <div className="DataTabs">
                         <p className="LabelHead">
                         Status
                           </p>
                           <p className="LabelData">
                           Shipped
                          </p>
                          </div>
                       </div>
                       <div className="col-6 alignRight">
                       <div className="DataTabs">
                         <p className="LabelHead">
                         Price
                           </p>
                           <p className="LabelData">
                           24.99
                          </p>
                          </div>
                       <div className="DataTabs">
                         <p className="LabelHead">
                        Qty
                           </p>
                           <p className="LabelData">
                         2
                          </p>
                          </div>
                          <div className="DataTabs">
                         <p className="LabelHead">
                      Total
                           </p>
                           <p className="LabelData">
                           24.99
                          </p>
                          </div>
                       </div>
                     </div>
                        
                   </div>
                   <div className="odd cardBox">
                     <div className="row">
                       <div className="col-6 alignLeft">
                         <div className="DataTabs">
                         <p className="LabelHead">
                              Item
                           </p>
                           <p className="LabelData">
                             2154
                          </p>
                          </div>
                          <div className="DataTabs">
                         <p className="LabelHead">
                         Name
                           </p>
                           <p className="LabelData">
                           Back shope
                          </p>
                          </div>
                          <div className="DataTabs">
                         <p className="LabelHead">
                         Ship Date
                           </p>
                           <p className="LabelData">
                           2020-03-20
                          </p>
                          </div>
                          <div className="DataTabs">
                         <p className="LabelHead">
                         Status
                           </p>
                           <p className="LabelData">
                           Shipped
                          </p>
                          </div>
                       </div>
                       <div className="col-6 alignRight">
                       <div className="DataTabs">
                         <p className="LabelHead">
                         Price
                           </p>
                           <p className="LabelData">
                           24.99
                          </p>
                          </div>
                       <div className="DataTabs">
                         <p className="LabelHead">
                        Qty
                           </p>
                           <p className="LabelData">
                         2
                          </p>
                          </div>
                          <div className="DataTabs">
                         <p className="LabelHead">
                      Total
                           </p>
                           <p className="LabelData">
                           24.99
                          </p>
                          </div>
                       </div>
                     </div>
                        
                   </div>
                   <div className="totalAll">
                   <div className="row">
                       <div className="col-6 dataLeftDiv">
                       <p className="SubTotal">
                              Subtotal
                           </p>
                           <p className="SubTotal">
                              Discount
                           </p>
                           <p className="SubTotal">
                              Shipping
                           </p>
                           <p className="orderTotal">
                              Order Total
                           </p>
                           <p className="vatTotal">
                              inclusive of <span>24 VAT</span>
                           </p>
                         </div>
                         <div className="col-6 dataRightDiv">
                         <p className="SubTotal">
                              <span>GBP</span><span> 21.35</span>
                           </p>
                           <p className="SubTotal reCol">
                              <span>GBP</span><span> 21.35</span>
                           </p>
                           <p className="SubTotal">
                              <span>GBP</span><span> 21.35</span>
                           </p>
                           <p className="orderTotal">
                              <span>GBP</span><span> 21.35</span>
                           </p>
                         </div>
                         </div>
                   </div>

              
               </div>
            </div>
            <div className="col-md-4">
               <Needhelp />
            </div>
         </div>
      </div>
   </div>
   </Suspense>
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(OrderDetails)));

