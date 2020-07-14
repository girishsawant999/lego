import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import footerLogo from '../../assets/images/emmet-fe70d8bbd77eb5ec2f0a84f515f5121b.png';
import 'bootstrap/dist/css/bootstrap.css';
import LogoSlider from '../../components/HomeComponent/logoSlider';
import bagIcon from '../../assets/images/icons/bag.png';


class FourZeroFour extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const store_locale=this.props.globals.store_locale
        return (
            <div>
                 {/* <LogoSlider /> */}
                <div className="fourZero">
                                        
                        <div className="row">
                            <div className="col-md-12 nopadding">
                                <div className="jByEOj">
                                    <div data-test="not-found" className="fDUYrY">
                                    <img src={footerLogo} alt="footerLogo" className="iSgWqR"/>
                                        <div className="dPxVVf">
                                            <span className="dzLNQU">404</span><span color="white" className="hoaZnZ">Sorry, we can't find that page! Don't worry though, everything is STILL AWESOME!</span>
                                            <div className="hjDSIP">
                                                <a kind="lightTheme" className="hjHIQN dqpbzE" href="/en-us">
                                                    Start shopping
                                                    <svg width="16" height="16" className="ifWWhX bgViWV" viewBox="0 0 18 28" aria-hidden="true">
                                                        <path d="M1.825 28L18 14 1.825 0 0 1.715 14.196 14 0 26.285z" fill="currentColor"></path>
                                                    </svg>
                                                </a>
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
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(FourZeroFour)));
