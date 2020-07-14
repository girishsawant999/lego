import React, { Component } from 'react';
import bagIcon from '../../assets/images/icons/bag.png';
import ButtonrightArrow from '../../assets/images/icons/rightArrow.png';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

class Beforelogin extends Component {
   constructor(props) {
       super(props);
       
   }

   render() {
    let { myCart, globals, user_details } = this.props;
       return (
           <div>
                <div className="beforeLogin">
                    <div className="container">
                        <div className="boxLogin">
                            {myCart.cart_count < 1 && <p>
                            <img src={bagIcon} alt="store" />
                            </p>}
                            {myCart.cart_count < 1 && <p className="titleBag">
                                <FormattedMessage id='cart.emptyMsg' defaultMessage="You don't have anything in your bag." />
                            </p>}
                            {!user_details.isUserLoggedIn && <p className="signtext">
                                <FormattedMessage id='cart.signMsg' defaultMessage="Sign in to see your bag and get shopping!" />
                            </p>}
                            {!user_details.isUserLoggedIn && <Link to={`/${globals.store_locale}/login`}>
                                <button className="signin">
                                    <FormattedMessage id='cart.signIn' defaultMessage="Sign in" />
                                </button>
                            </Link>}
                            {myCart.cart_count < 1 && <Link to={`/${globals.store_locale}`}>
                                <p className="continueShop">
                                    <FormattedMessage id='cart.startShop' defaultMessage="Start shopping" />
                                    <img src={ButtonrightArrow} alt="ButtonrightArrow" />
                                </p>
                            </Link>}
                        </div>
                    </div>
                </div>
           </div>
       )
   }
}


export default (Beforelogin);