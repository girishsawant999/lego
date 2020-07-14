import React, { Component } from 'react';
import pdpCounter1 from '../../assets/images/icons/pdpCounter1.png';
import pdpCounter2 from '../../assets/images/icons/pdpCounter2.png';
import pdpCounter3 from '../../assets/images/icons/pdpCounter3.png';
import { FormattedMessage, injectIntl } from 'react-intl';

class CountDetails extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const { product } = this.props;
        let productData = {};
        let additional_attributes = {};
        if (product.product) {
            productData = product.product[0]
            additional_attributes = product.product[0].additional_attributes ? product.product[0].additional_attributes[0] : {};
        }
        return (
            <div>
                <div className="CountDetails">
                    <div className="container">
               <div className="countInner">
             
                        <div className="box">
                            <div className="ages">
                                <img src={pdpCounter1} alt="pdpCounter1"/>
                                <p className="countDigit"> {additional_attributes.age}</p>
                                <p className="countText">
                                <FormattedMessage id='pdp.Ages' defaultMessage='Ages' /></p>
                            </div>
                        </div>
                     
                        <div className="box">
                        <div className="ages">
                                <img src={pdpCounter2} alt="pdpCounter1"/>
                                <p className="countDigit"> {additional_attributes.piece_count}</p>
                                <p className="countText">
                                <FormattedMessage id='pdp.Pieces' defaultMessage='Pieces' />
                                </p>
                            </div>
                            </div>
                            <div className="box">
                        <div className="ages">
                                <img src={pdpCounter3} alt="pdpCounter1"/>
                                <p className="countDigit">{additional_attributes.lego_id}</p>
                                <p className="countText">
                                <FormattedMessage id='pdp.Item' defaultMessage='Item' />
                                </p>

                            </div>
                            </div>
                   
               </div>
               </div>
                </div>
            </div>
        )
    }
}


export default (CountDetails);