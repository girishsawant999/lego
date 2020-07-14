import React, { Component } from 'react';
import ImgSmall from '../../assets/images/icons/needHelpSmall.png';
import { FormattedMessage } from '../../../node_modules/react-intl';

class Needhelp extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <div>
                 <div className="needHelp">
                             <div className="row">
                             <div className="col-md-3 col-3 p-0">
                                 <div className="ImgSmall">
                                 <img src={ImgSmall} /> 
                                 </div>
                                 
                             </div>
                             <div className="col-md-9 pZero col-9">
                               <div className="needbox">
                                  <p className="Title"><FormattedMessage id="NeedHelp.NeedHelp" defaultMessage="Need Help?" /></p>
                                  <p className="text-cont"><FormattedMessage id="NeedHelp.info" defaultMessage="our excellent customer service team is waiting to answer any questions you might have." /></p>
                                  <p className="text-service"><FormattedMessage id="NeedHelp.CustomerCareService" defaultMessage="Customer Care Service" /></p>
                                  <p className="text-learn"><FormattedMessage id="NeedHelp.returnInfo" defaultMessage="Learn about our 90-day return policy." /></p>
                               </div>
                             </div>
                             </div>
                                </div> 
            </div>
        )
    }
}


export default (Needhelp);