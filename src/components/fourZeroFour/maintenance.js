import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import MainImage from '../../assets/images/icons/maintanImage.png';
import logo from '../../assets/images/icons/LEGO.gif';

class Maintenance extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const store_locale=this.props.globals.store_locale
        return (
            <div>                
                <div className="maintancePage"> 
                <div className="headerYellow">
                <Link to={`/`}>                  
                        <img src={logo} alt="logo" />
                    
                  </Link>
                </div>
                <div className="inside">                                     
                   <img className="imgMain" src={MainImage} alt="mainImage" />   
                   <div className="maintanceText">
                       <p className="service">Service unavailable!</p>
                       <p className="serviceMessage">
                       Lego is being updated and will be back soon. Sorry for the inconvenience. Please come back in a little while or call on our customer service number.
                       </p>
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
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Maintenance)));
