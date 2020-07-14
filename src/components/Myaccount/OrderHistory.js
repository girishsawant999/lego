import React, { Component } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import Needhelp  from '../Myaccount/NeedHelp';
import LogoSlider from '../../components/HomeComponent/logoSlider';
import topImg from '../../assets/images/icons/needHelpOne.png';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';




class OrderHistory extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
      const store_locale=this.props.globals.store_locale
        return (
            <div>
                <div className="OrderHistoryPage">
                   {/* <LogoSlider /> */}
                   <div className="container">
                   <div className="row borderottom">
                       <div className="col-md-9 col-9">
                       <Breadcrumb />  
                       <p className="orderhistroyTitle"> <FormattedMessage id="OrderHistory.OrderStatus" defaultMessage="Order Status" />
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
                       <p className="orderSubtitle"> <FormattedMessage id="OrderHistory.OrderHistory" defaultMessage="Order History" />

                        </p>   
                        <p className="ordertract"><FormattedMessage id="OrderHistory.track" defaultMessage="To track the journey of your package, click on the order number below." />
                       
                       </p> 
                       <div className="borderottom"></div> 

                         <table className="table table-striped histroyTable">
    <thead>
      <tr>
        <th><FormattedMessage id="OrderHistory.OrderDate" defaultMessage="Order Date" /></th>
        <th><FormattedMessage id="OrderHistory.OrderNumber" defaultMessage="Order Number" /></th>
        <th><FormattedMessage id="OrderHistory.OrderStatus" defaultMessage="Order Status" /></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John</td>
        <td className="orderNum">T25485</td>
        <td>john@example.com</td>
      </tr>
      <tr>
        <td>Mary</td>
        <td className="orderNum">T36587</td>
        <td>mary@example.com</td>
      </tr>
      <tr>
        <td>July</td>
        <td className="orderNum">S54885</td>
        <td>july@example.com</td>
      </tr>
    </tbody>
  </table>     
  <div className="ButtonDiv">
      <div className="row">
      <div className="col-6">
      <button className="PreviousBtn"><FormattedMessage id="OrderHistory.PreviousPage" defaultMessage="Previous Page" /></button>
          </div>
          <div className="col-6">
          <Link to={`/${store_locale}/order-details`}>  <button className="nextBtn"><FormattedMessage id="OrderHistory.NextPage" defaultMessage="Next Page" /></button></Link>
         

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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(OrderHistory)));
