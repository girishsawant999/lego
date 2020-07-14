import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Breadcrumb from '../../common/breadcrumb';
import LogoSlider from '../../components/HomeComponent/logoSlider';
import { Link } from 'react-router-dom';
import StepperH  from '../Myaccount/StepperH';
import StepperV  from '../Myaccount/StepperV';
import SupportImag from '../../assets/images/icons/supportImage.png';




class Tracking extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const store_locale=this.props.globals.store_locale
        return (
            <div>
                <div className="trackingPage">
                   {/* <LogoSlider /> */}
                   <Breadcrumb /> 
                   <div className="container">
                     <div className="mainStepper">
                       <p className="stepperTitle">
                           Your order <span>T25487</span> is in transit. 
                           <StepperH />
                       </p>
                     </div>
                     <div className="row">
                     <div className="col-md-4">
                          <StepperV />
                        </div>
                        <div className="col-md-8">
                        <div className="Support">
                            <div className="SupportImag">
                            <img src={SupportImag} />
                            </div>
                                 <ul className="list-group">
                                     <li className="list-inline-item title">Support</li>
                                     <li className="list-inline-item"><Link to={`/${store_locale}/delivery-information`}>Delivery Information</Link></li>
                                     <li className="list-inline-item"><Link to={`/${store_locale}/contact-us`}>Contact Us</Link></li>
                                     <li className="list-inline-item"><Link to={`/${store_locale}/faq`}>FAQs</Link></li>
                                </ul> 
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
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Tracking)));
